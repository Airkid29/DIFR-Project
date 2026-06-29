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
          body { font-family: Arial, sans-serif; color: #111827; padding: 24px; line-height: 1.5; }
          h1, h2 { color: #0f172a; }
          .card { border: 1px solid #d1d5db; border-radius: 10px; padding: 16px; margin-bottom: 16px; }
          .meta { font-size: 12px; color: #475569; margin-bottom: 8px; }
          .badge { display: inline-block; padding: 4px 8px; border-radius: 999px; background: #eff6ff; color: #1d4ed8; font-weight: 700; font-size: 12px; }
          .hash { font-family: Consolas, monospace; font-size: 11px; word-break: break-all; background: #f8fafc; padding: 8px; border-radius: 6px; margin-top: 4px; }
          ul { margin: 0; padding-left: 18px; }
          @page { size: A4; margin: 12mm; }
        </style>
      </head>
      <body>
        <h1>${report.title}</h1>
        <div class="meta">Artifact: ${report.fileName} | Size: ${report.fileSize}</div>
        <div class="card">
          <h2>Summary</h2>
          <p><strong>Threat score:</strong> ${report.threatScore}/100</p>
          <p><strong>Severity:</strong> <span class="badge">${report.severity}</span></p>
        </div>
        <div class="card">
          <h2>Digital fingerprints</h2>
          <p><strong>MD5</strong><div class="hash">${report.hashes.md5}</div></p>
          <p><strong>SHA-1</strong><div class="hash">${report.hashes.sha1}</div></p>
          <p><strong>SHA-256</strong><div class="hash">${report.hashes.sha256}</div></p>
        </div>
        <div class="card">
          <h2>YARA / detection matches</h2>
          <ul>${signaturesMarkup}</ul>
        </div>
        <div class="card">
          <h2>Operational notes</h2>
          <ul>${notesMarkup}</ul>
        </div>
        <div class="card">
          <h2>Digital chain of custody</h2>
          <ul>${custodyMarkup}</ul>
        </div>
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
