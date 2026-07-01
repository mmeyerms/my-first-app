import { NextRequest, NextResponse } from "next/server";
import { mergePreferences, type UserPreferences } from "@/lib/preferences/types";

/**
 * Weekly summary cron.
 *
 * Triggered by Vercel Cron (see /vercel.json) every Sunday at 09:00 UTC.
 *
 * Auth:
 *   - If CRON_SECRET is set, the request MUST include
 *     `Authorization: Bearer <CRON_SECRET>`.
 *   - Otherwise we assume the endpoint is running inside Vercel's authenticated
 *     cron environment.
 *
 * Behavior:
 *   - Iterates all user_preferences with settings.notifications.weeklyEmail = true.
 *   - For each user, fetches the mother's profile, last week's diary entries and
 *     the next upcoming termin.
 *   - Composes a Gmail-safe (inline-styled) HTML email body.
 *   - If RESEND_API_KEY is set, dispatches via Resend.
 *   - Otherwise runs in no-op mode and only logs which recipients WOULD be mailed.
 */

// This endpoint may need more time when there are many recipients.
export const maxDuration = 60;
// Never cache — must run fresh on every cron invocation.
export const dynamic = "force-dynamic";

interface MotherProfile {
  user_id: string;
  email: string | null;
  display_name: string | null;
  due_date: string | null; // ISO date
}

interface DiaryEntry {
  entry_date: string; // ISO date
  mood: string | null;
  note: string | null;
}

interface Termin {
  title: string;
  scheduled_at: string; // ISO datetime
  location: string | null;
}

interface PreferenceRow {
  user_id: string;
  settings: Partial<UserPreferences> | null;
}

/**
 * Compute the current SSW (Schwangerschaftswoche) from an ISO due date.
 * Pregnancy is counted as 40 weeks from the day BEFORE the due date.
 */
function computeSSW(dueDate: string | null): number | null {
  if (!dueDate) return null;
  const due = new Date(dueDate);
  if (Number.isNaN(due.getTime())) return null;
  const now = new Date();
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const weeksUntilDue = (due.getTime() - now.getTime()) / msPerWeek;
  const ssw = Math.round(40 - weeksUntilDue);
  if (ssw < 1) return 1;
  if (ssw > 42) return 42;
  return ssw;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("de-DE", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Compose the weekly email as a single HTML string with inline styles.
 * Kept intentionally simple so Gmail (and other webmail clients) render it
 * without stripping style blocks.
 */
export function composeWeeklyEmail(params: {
  profile: MotherProfile;
  diary: DiaryEntry[];
  nextTermin: Termin | null;
}): { subject: string; html: string } {
  const { profile, diary, nextTermin } = params;
  const ssw = computeSSW(profile.due_date);
  const greetingName = profile.display_name ? escapeHtml(profile.display_name) : "liebe Mama";

  const moodCounts: Record<string, number> = {};
  for (const entry of diary) {
    if (entry.mood) moodCounts[entry.mood] = (moodCounts[entry.mood] ?? 0) + 1;
  }
  const moodEntries = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);
  const moodRecap =
    moodEntries.length === 0
      ? "In dieser Woche hast du noch keinen Tagebucheintrag angelegt."
      : moodEntries
          .map(([mood, count]) => `${escapeHtml(mood)} (${count}x)`)
          .join(", ");

  const sswLine = ssw !== null ? `Du bist aktuell in <strong>SSW ${ssw}</strong>.` : "Trage dein Entbindungsdatum ein, damit wir deine SSW berechnen können.";

  const terminLine = nextTermin
    ? `<strong>${escapeHtml(nextTermin.title)}</strong> am ${escapeHtml(formatDate(nextTermin.scheduled_at))}${nextTermin.location ? ` (${escapeHtml(nextTermin.location)})` : ""}`
    : "Aktuell ist kein Termin geplant.";

  const subject = ssw !== null ? `Deine Wochenübersicht – SSW ${ssw}` : "Deine Wochenübersicht";

  const html = `<!DOCTYPE html><html lang="de"><body style="margin:0;padding:0;background-color:#faf5ff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:#1f2937;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#faf5ff;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
          <tr>
            <td style="padding:24px 32px;background-color:#f5d0fe;">
              <h1 style="margin:0;font-size:22px;line-height:1.3;color:#701a75;">MamaMap Wochenzusammenfassung</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px;">
              <p style="margin:0 0 16px 0;font-size:16px;line-height:1.5;">Hallo ${greetingName},</p>
              <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#374151;">${sswLine}</p>

              <h2 style="margin:24px 0 8px 0;font-size:16px;color:#701a75;">Nächster Termin</h2>
              <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#374151;">${terminLine}</p>

              <h2 style="margin:24px 0 8px 0;font-size:16px;color:#701a75;">Deine Stimmung diese Woche</h2>
              <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#374151;">${escapeHtml(moodRecap)}</p>

              <p style="margin:32px 0 0 0;font-size:13px;line-height:1.5;color:#6b7280;">Alles Liebe,<br/>dein MamaMap-Team</p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px;background-color:#faf5ff;border-top:1px solid #f3e8ff;">
              <p style="margin:0;font-size:12px;line-height:1.5;color:#6b7280;">Du erhältst diese E-Mail, weil du die wöchentliche Zusammenfassung in deinen Einstellungen aktiviert hast. Du kannst sie jederzeit unter „Einstellungen → Benachrichtigungen“ wieder deaktivieren.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body></html>`;

  return { subject, html };
}

/**
 * Loads the list of users who have opted into the weekly email.
 * When Supabase is not configured we return an empty list — the cron then
 * simply logs 0 recipients and exits.
 */
async function loadOptedInPreferences(): Promise<PreferenceRow[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return [];
  }
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(url, serviceKey);
  const { data, error } = await supabase
    .from("user_preferences")
    .select("user_id, settings")
    .limit(1000);
  if (error) {
    console.error("[weekly-summary] failed to load preferences", error);
    return [];
  }
  const rows = (data ?? []) as PreferenceRow[];
  return rows.filter((row) => mergePreferences(row.settings ?? {}).notifications.weeklyEmail);
}

async function loadRecipientData(userId: string): Promise<{
  profile: MotherProfile | null;
  diary: DiaryEntry[];
  nextTermin: Termin | null;
}> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return { profile: null, diary: [], nextTermin: null };
  }
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(url, serviceKey);

  const [{ data: profile }, { data: diary }, { data: termine }] = await Promise.all([
    supabase
      .from("profiles")
      .select("user_id, email, display_name, due_date")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("diary_entries")
      .select("entry_date, mood, note")
      .eq("user_id", userId)
      .gte("entry_date", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order("entry_date", { ascending: false })
      .limit(20),
    supabase
      .from("termine")
      .select("title, scheduled_at, location")
      .eq("user_id", userId)
      .gte("scheduled_at", new Date().toISOString())
      .order("scheduled_at", { ascending: true })
      .limit(1),
  ]);

  return {
    profile: (profile as MotherProfile | null) ?? null,
    diary: (diary as DiaryEntry[] | null) ?? [],
    nextTermin: ((termine as Termin[] | null) ?? [])[0] ?? null,
  };
}

async function sendViaResend(params: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ ok: boolean; status: number; body: string }> {
  const apiKey = process.env.RESEND_API_KEY!;
  const from = process.env.RESEND_FROM_EMAIL ?? "MamaMap <no-reply@mamamap.app>";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to: params.to,
      subject: params.subject,
      html: params.html,
    }),
  });
  const body = await res.text();
  return { ok: res.ok, status: res.status, body };
}

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  const preferences = await loadOptedInPreferences();
  const dryRun = !process.env.RESEND_API_KEY;

  let sent = 0;
  let skipped = 0;
  const errors: Array<{ userId: string; message: string }> = [];

  for (const pref of preferences) {
    try {
      const { profile, diary, nextTermin } = await loadRecipientData(pref.user_id);
      if (!profile || !profile.email) {
        skipped++;
        continue;
      }
      const { subject, html } = composeWeeklyEmail({ profile, diary, nextTermin });
      if (dryRun) {
        console.log(`[weekly-summary] would send to ${profile.email} (user ${pref.user_id}) subject="${subject}"`);
        sent++;
        continue;
      }
      const result = await sendViaResend({ to: profile.email, subject, html });
      if (!result.ok) {
        errors.push({ userId: pref.user_id, message: `resend ${result.status}: ${result.body}` });
      } else {
        sent++;
      }
    } catch (err) {
      errors.push({
        userId: pref.user_id,
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return NextResponse.json({
    ok: true,
    dryRun,
    recipients: preferences.length,
    sent,
    skipped,
    errors,
  });
}
