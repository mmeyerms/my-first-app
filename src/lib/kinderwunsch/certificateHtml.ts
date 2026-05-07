type Statement = { id: string; text: string }

interface BuildArgs {
  statements: Statement[]
  signedAt: string
  mama?: string
  partner?: string
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function formatDateLong(iso: string): string {
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return ''
    const months = [
      'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
    ]
    return `${d.getDate()}. ${months[d.getMonth()]} ${d.getFullYear()}`
  } catch {
    return ''
  }
}

export function buildManifestCertificateHtml({ statements, signedAt, mama, partner }: BuildArgs): string {
  const dateLong = formatDateLong(signedAt)
  const namesLine = [mama, partner].filter(Boolean).join('  &  ') || 'die werdenden Eltern'

  const statementHtml = statements
    .map(
      (s, i) =>
        `<li><span class="num">${String(i + 1).padStart(2, '0')}</span><span class="txt">${escapeHtml(s.text)}</span></li>`,
    )
    .join('')

  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Unser Eltern-Manifest</title>
<style>
  @page { size: A4 portrait; margin: 1.2cm; }
  *, *::before, *::after { box-sizing: border-box; }
  html, body {
    margin: 0;
    padding: 0;
    background: #f9fafb;
    font-family: Georgia, "Times New Roman", serif;
    color: #111827;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .page {
    max-width: 760px;
    margin: 24px auto;
    padding: 32px;
  }
  .frame-outer {
    position: relative;
    border: 3px double #fda4af;
    border-radius: 14px;
    padding: 14px;
    background: linear-gradient(135deg, #fff1f2 0%, #ffffff 50%, #fffbeb 100%);
    box-shadow: 0 10px 30px rgba(244, 63, 94, 0.08);
  }
  .frame-inner {
    border: 1px solid #fecdd3;
    border-radius: 9px;
    padding: 40px 28px;
  }
  .center { text-align: center; }
  .flourish {
    font-size: 1.6rem;
    letter-spacing: 0.4em;
    color: #fb7185;
  }
  .tulip { font-size: 4rem; margin: 12px 0; }
  .zertifikat-label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5em;
    color: #f43f5e;
    margin: 4px 0 0;
  }
  .title {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 2.25rem;
    font-weight: 700;
    color: #1f2937;
    margin: 8px 0 4px;
    letter-spacing: 0.01em;
  }
  .subtitle {
    font-style: italic;
    color: #6b7280;
    font-size: 14px;
    margin: 0;
  }
  .divider {
    width: 96px;
    height: 1px;
    background: #fda4af;
    margin: 16px auto;
  }
  .intro {
    text-align: center;
    font-size: 17px;
    line-height: 1.7;
    color: #374151;
    margin: 28px 8px;
  }
  .names {
    color: #e11d48;
    font-weight: 700;
    white-space: nowrap;
  }
  .statements {
    list-style: none;
    padding: 0;
    margin: 24px auto 8px;
    max-width: 540px;
  }
  .statements li {
    display: flex;
    gap: 18px;
    align-items: flex-start;
    margin-bottom: 14px;
    page-break-inside: avoid;
  }
  .statements .num {
    flex: 0 0 auto;
    color: #fb7185;
    font-size: 26px;
    font-weight: 700;
    line-height: 1;
    min-width: 36px;
  }
  .statements .txt {
    font-size: 15px;
    line-height: 1.65;
    color: #1f2937;
  }
  .date-block {
    text-align: center;
    margin-top: 36px;
  }
  .date-label {
    font-style: italic;
    font-size: 14px;
    color: #4b5563;
    margin: 12px 0 4px;
  }
  .date {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 22px;
    font-weight: 600;
    color: #e11d48;
    margin: 0;
  }
  .signatures {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px;
    margin: 56px 24px 16px;
  }
  .sig-line {
    border-bottom: 2px solid #6b7280;
    padding-bottom: 4px;
    height: 2em;
  }
  .sig-name {
    text-align: center;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: #6b7280;
    margin-top: 8px;
  }
  .footer { text-align: center; margin-top: 28px; }
  .footer-flourish {
    font-size: 1.3rem;
    letter-spacing: 0.4em;
    color: #fb7185;
  }
  .footer-text {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.3em;
    color: #9ca3af;
    margin: 8px 0 0;
  }
  .no-print {
    position: fixed;
    top: 16px;
    right: 16px;
    display: flex;
    gap: 8px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    z-index: 1000;
  }
  .no-print button {
    padding: 10px 18px;
    border-radius: 10px;
    border: none;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  .btn-print {
    background: #f43f5e;
    color: white;
  }
  .btn-print:hover { background: #e11d48; }
  .btn-close {
    background: #e5e7eb;
    color: #374151;
  }
  .btn-close:hover { background: #d1d5db; }
  @media print {
    html, body { background: white; }
    .page { margin: 0; padding: 0; max-width: none; }
    .frame-outer { box-shadow: none; }
    .no-print { display: none !important; }
  }
</style>
</head>
<body>
  <div class="no-print">
    <button class="btn-print" onclick="window.print()">🖨️ Drucken / PDF</button>
    <button class="btn-close" onclick="window.close()">Schließen</button>
  </div>
  <div class="page">
    <div class="frame-outer">
      <div class="frame-inner">
        <div class="center">
          <div class="flourish">✦ ✦ ✦</div>
          <div class="tulip">🌷</div>
          <p class="zertifikat-label">Zertifikat</p>
          <h1 class="title">Unser Eltern-Manifest</h1>
          <p class="subtitle">Eine gegenseitige Verpflichtung</p>
          <div class="divider"></div>
        </div>
        <p class="intro">
          Wir, <span class="names">${escapeHtml(namesLine)}</span>,<br />
          verpflichten uns auf dem gemeinsamen Weg in die Elternschaft zu folgenden Grundsätzen:
        </p>
        <ol class="statements">${statementHtml}</ol>
        <div class="date-block">
          <div class="divider"></div>
          <p class="date-label">Besiegelt an diesem</p>
          <p class="date">${escapeHtml(dateLong)}</p>
        </div>
        <div class="signatures">
          <div>
            <div class="sig-line"></div>
            <p class="sig-name">${escapeHtml(mama || 'Mama')}</p>
          </div>
          <div>
            <div class="sig-line"></div>
            <p class="sig-name">${escapeHtml(partner || 'Partner/in')}</p>
          </div>
        </div>
        <div class="footer">
          <div class="footer-flourish">✦ ✦ ✦</div>
          <p class="footer-text">MamaMap · ein Versprechen an euch und euer Kind</p>
        </div>
      </div>
    </div>
  </div>
  <script>
    window.addEventListener('load', function () {
      setTimeout(function () { window.focus(); window.print(); }, 300);
    });
  </script>
</body>
</html>`
}
