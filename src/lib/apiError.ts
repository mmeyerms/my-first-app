import { NextResponse } from 'next/server'
import { z } from 'zod'

/**
 * Turn an unknown error thrown inside an API route into a safe HTTP response.
 *
 * WHY THIS EXISTS
 * ---------------
 * Prior code shape:
 *   catch (err) {
 *     return NextResponse.json({ error: err.message }, { status: 500 })
 *   }
 *
 * That leaks internal detail to the client — Postgres error messages
 * include schema names, constraint names, and sometimes even column values
 * from failed inserts. Attackers use those messages to enumerate schemas
 * and to fingerprint versions. We must never surface them.
 *
 * BEHAVIOUR
 * ---------
 *  - `ZodError` → 400 with the flattened form-friendly payload.
 *  - Everything else → 500 with a generic 'Serverfehler' string.
 *  - The original error is always logged (server-side) with a tag that
 *    lets us grep production logs by route.
 *
 * USAGE
 * -----
 *   } catch (err) {
 *     return apiError(err, 'partner-invite')
 *   }
 *
 * Also convenient for the pattern where a Supabase call returned an error
 * object (not thrown) and we want the same log + safe body treatment:
 *
 *   const { error } = await supabase.from(...).update(...)
 *   if (error) return apiError(error, 'partner-invite/upsert-link')
 */
export function apiError(
  err: unknown,
  tag: string,
): NextResponse {
  if (err instanceof z.ZodError) {
    console.error(`[${tag}] validation error`, err.flatten())
    return NextResponse.json({ error: err.flatten() }, { status: 400 })
  }
  console.error(`[${tag}]`, err)
  return NextResponse.json({ error: 'Serverfehler' }, { status: 500 })
}
