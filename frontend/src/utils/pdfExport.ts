export interface ForensicReportData {
  title: string;
  fileName: string;
  fileSize: string;
  threatScore: number;
  severity: string;
  hashes: {
    md5: string;
    sha1: string;
    sha256: string;
  };
  signatures: string[];
  notes: string[];
  custody: string[];
}

export function exportForensicPdf(report: ForensicReportData) {
  const custodyMarkup = report.custody.map((entry) => `<li>${entry}</li>`).join('');
  const signaturesMarkup = report.signatures.map((signature) => `<li>${signature}</li>`).join('');
  const notesMarkup = report.notes.map((note) => `<li>${note}</li>`).join('');

  const html = `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${report.title}</title>
        <style>
          body { font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #111827; padding: 24px; line-height: 1.55; background: #f8fafc; }
          .logo { height: 48px; margin-bottom: 8px; }
          .page { border: 1px solid #e6eef6; padding: 18px; background: #ffffff; border-radius: 8px; }
          h1 { font-size: 30px; margin: 0 0 4px 0; color: #111827; }
          h2 { font-size: 16px; margin: 0 0 12px 0; color: #111827; }
          .header { border-bottom: 1px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 24px; }
          .subtext { font-size: 12px; color: #475569; margin: 4px 0; }
          .card { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 14px; padding: 18px 20px; margin-bottom: 18px; box-shadow: 0 5px 18px rgba(15, 23, 42, 0.05); }
          .label { display: inline-flex; align-items: center; justify-content: center; padding: 4px 10px; border-radius: 999px; background: #eff6ff; color: #1d4ed8; font-weight: 700; font-size: 11px; letter-spacing: 0.02em; }
          .hash { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace; font-size: 11px; word-break: break-all; background: #f8fafc; padding: 10px; border-radius: 10px; margin: 10px 0 0 0; }
          .details { display: grid; grid-template-columns: 160px 1fr; gap: 10px 24px; font-size: 13px; color: #334155; }
          .details dt { font-weight: 700; color: #0f172a; }
          .details dd { margin: 0 0 10px 0; }
          ul { margin: 0; padding-left: 20px; }
          li { margin-bottom: 8px; }
          .footer { margin-top: 24px; font-size: 11px; color: #64748b; }
          @page { size: A4; margin: 14mm; }
        </style>
      </head>
      <body>
        <div class="header page">
          <img class="logo" src="/uploads/logo.png" alt="ForensiGuard logo" onerror="this.style.display='none'" />
          <h1>${report.title}</h1>
          <div class="subtext">Artifact: ${report.fileName} · Size: ${report.fileSize}</div>
          <div class="subtext">Generated: ${new Date().toLocaleString('en-GB', { timeZone: 'UTC' })} UTC</div>
        </div>
        <div class="card">
          <h2>Executive summary</h2>
          <dl class="details">
            <dt>Threat score</dt><dd>${report.threatScore}/100</dd>
            <dt>Severity</dt><dd><span class="label">${report.severity}</span></dd>
          </dl>
        </div>
        <div class="card">
          <h2>Digital fingerprints</h2>
          <dl class="details">
            <dt>MD5</dt><dd><div class="hash">${report.hashes.md5}</div></dd>
            <dt>SHA-1</dt><dd><div class="hash">${report.hashes.sha1}</div></dd>
            <dt>SHA-256</dt><dd><div class="hash">${report.hashes.sha256}</div></dd>
          </dl>
        </div>
        <div class="card">
          <h2>Detection summary</h2>
          <ul>${signaturesMarkup}</ul>
        </div>
        <div class="card">
          <h2>Investigation notes</h2>
          <ul>${notesMarkup}</ul>
        </div>
        <div class="card">
          <h2>Chain of custody</h2>
          <ul>${custodyMarkup}</ul>
        </div>
        <div class="footer">ForensiGuard forensic report intended for internal incident response. Retain as evidence summary and compliance reference.</div>
        <script>
          // Add page number when printing
          (function(){
            function addPageNumbers(){
              const total = Math.ceil(document.body.scrollHeight / window.innerHeight);
              const footers = document.querySelectorAll('.footer');
              footers.forEach((f, i)=>{
                const pageNum = i+1;
                f.textContent = f.textContent + ' — Page ' + pageNum + ' of ' + total;
              });
            }
            window.onload = addPageNumbers;
          })();
        </script>
      </body>
    </html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const printWindow = window.open(url, '_blank');

  if (!printWindow) {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${report.fileName.replace(/\s+/g, '_')}_forensic-report.html`;
    anchor.click();
    URL.revokeObjectURL(url);
    return;
  }

  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };

  printWindow.onafterprint = () => {
    printWindow.close();
    URL.revokeObjectURL(url);
  };
}
