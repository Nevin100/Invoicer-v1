export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database/db_connection';
import { getUserId } from '@/lib/helpers/getUserId';
import EvalReport from '@/lib/models/EvalReport.model';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = await getUserId();
  if (!userId)
    return new NextResponse('Unauthorized', { status: 401 });

  await connectDB();

  const report = await EvalReport.findOne({
    _id: id,
    user: userId,
  }).lean() as any;

  if (!report)
    return new NextResponse('Not found', { status: 404 });

  const REPORT_LABELS: Record<string, string> = {
    expense:  'Expense Insights',
    invoice:  'Invoice Insights',
    client:   'Client Insights',
    complete: 'Complete Report',
  };

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Invoicer — ${REPORT_LABELS[report.reportType]} Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', system-ui, sans-serif;
      color: #0f172a;
      background: #fff;
      padding: 48px;
      font-size: 13px;
      line-height: 1.6;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
      padding-bottom: 24px;
      border-bottom: 2px solid #f1f5f9;
    }
    .brand { font-size: 11px; font-weight: 900; letter-spacing: 0.2em; color: #6366f1; text-transform: uppercase; }
    .title { font-size: 28px; font-weight: 900; letter-spacing: -0.03em; margin-top: 4px; }
    .date { font-size: 10px; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; }
    .score-block {
      display: flex;
      align-items: center;
      gap: 16px;
      background: #f8fafc;
      border-radius: 16px;
      padding: 20px 28px;
      margin-bottom: 32px;
    }
    .score-num {
      font-size: 56px;
      font-weight: 900;
      letter-spacing: -0.04em;
      color: #4f46e5;
      line-height: 1;
    }
    .score-label { font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.15em; color: #94a3b8; }
    .summary { font-size: 14px; font-weight: 600; color: #334155; max-width: 600px; }
    .section { margin-bottom: 32px; }
    .section-title {
      font-size: 10px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: #94a3b8;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #f1f5f9;
    }
    ul { list-style: none; }
    ul li {
      padding: 8px 0;
      border-bottom: 1px solid #f8fafc;
      font-weight: 600;
      color: #334155;
    }
    ul li::before { content: "→ "; color: #6366f1; font-weight: 900; }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 99px;
      font-size: 9px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    .badge-priority { background: #ecfdf5; color: #059669; }
    .badge-maintain { background: #fffbeb; color: #d97706; }
    .badge-drop     { background: #fff1f2; color: #e11d48; }
    .badge-reduce   { background: #fffbeb; color: #d97706; }
    .badge-cut      { background: #fff1f2; color: #e11d48; }
    .badge-increase { background: #eff6ff; color: #2563eb; }
    .client-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 12px 0;
      border-bottom: 1px solid #f1f5f9;
      gap: 16px;
    }
    .client-name { font-weight: 900; font-size: 13px; }
    .client-meta { font-size: 11px; color: #64748b; font-weight: 600; margin-top: 2px; }
    .client-strategy { font-size: 11px; color: #6366f1; font-weight: 700; margin-top: 4px; }
    .market-box {
      background: #f8fafc;
      border-radius: 12px;
      padding: 16px 20px;
      margin-bottom: 12px;
    }
    .market-box p { color: #334155; font-weight: 600; font-size: 12px; }
    .pricing-box {
      background: #eef2ff;
      border-radius: 12px;
      padding: 16px 20px;
      color: #3730a3;
      font-weight: 700;
      font-size: 12px;
    }
    .footer {
      margin-top: 48px;
      padding-top: 16px;
      border-top: 1px solid #f1f5f9;
      font-size: 10px;
      color: #cbd5e1;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      display: flex;
      justify-content: space-between;
    }
    @media print {
      body { padding: 32px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>

  <!-- Print button (hidden on print) -->
  <div class="no-print" style="margin-bottom:24px">
    <button onclick="window.print()" style="
      background:#4f46e5;color:#fff;border:none;padding:10px 24px;
      border-radius:12px;font-weight:900;font-size:11px;
      letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;
    ">⬇ Download PDF</button>
  </div>

  <!-- Header -->
  <div class="header">
    <div>
      <div class="brand">Invoicer · AI Evaluation</div>
      <div class="title">${REPORT_LABELS[report.reportType]}</div>
    </div>
    <div class="date">${new Date(report.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric'
    })}</div>
  </div>

  <!-- Score -->
  ${report.report?.score != null ? `
  <div class="score-block">
    <div class="score-num">${report.report.score}</div>
    <div>
      <div class="score-label">Business Health Score</div>
      <div class="summary" style="margin-top:8px">${report.report.summary ?? ''}</div>
    </div>
  </div>` : `<div class="market-box"><p>${report.report?.summary ?? ''}</p></div>`}

  <!-- Snapshot -->
  <div class="section">
    <div class="section-title">Data Snapshot · Last ${report.dataSnapshot?.periodDays ?? 90} days</div>
    <ul>
      <li>${report.dataSnapshot?.invoiceCount ?? 0} Invoices analyzed</li>
      <li>${report.dataSnapshot?.clientCount ?? 0} Clients evaluated</li>
      <li>₹${(report.dataSnapshot?.expenseTotal ?? 0).toLocaleString('en-IN')} Total expenses</li>
      <li>${report.creditsUsed} credits used</li>
    </ul>
  </div>

  <!-- Market Context -->
  ${report.report?.marketContext ? `
  <div class="section">
    <div class="section-title">Market Context</div>
    <div class="market-box"><p>${report.report.marketContext}</p></div>
    ${report.report?.pricingInsight ? `<div class="pricing-box">💡 Pricing: ${report.report.pricingInsight}</div>` : ''}
    ${(report.report?.marketOpportunities ?? []).length > 0 ? `
    <ul style="margin-top:12px">
      ${report.report.marketOpportunities.map((o: string) => `<li>${o}</li>`).join('')}
    </ul>` : ''}
  </div>` : ''}

  <!-- Insights -->
  ${(report.report?.insights ?? []).length > 0 ? `
  <div class="section">
    <div class="section-title">Insights</div>
    <ul>${report.report.insights.map((i: string) => `<li>${i}</li>`).join('')}</ul>
  </div>` : ''}

  <!-- Red Flags -->
  ${(report.report?.redFlags ?? []).length > 0 ? `
  <div class="section">
    <div class="section-title">Red Flags</div>
    <ul>${report.report.redFlags.map((f: string) => `<li>${f}</li>`).join('')}</ul>
  </div>` : ''}

  <!-- Action Items -->
  ${(report.report?.actionItems ?? []).length > 0 ? `
  <div class="section">
    <div class="section-title">Action Items</div>
    <ul>${report.report.actionItems.map((a: string) => `<li>${a}</li>`).join('')}</ul>
  </div>` : ''}

  <!-- Client Recommendations -->
  ${(report.clientRecommendations ?? []).length > 0 ? `
  <div class="section">
    <div class="section-title">Client Analysis</div>
    ${report.clientRecommendations.map((c: any) => `
    <div class="client-row">
      <div>
        <div class="client-name">${c.clientName}</div>
        <div class="client-meta">${c.reasoning}</div>
        ${c.recommendedDealSize ? `<div class="client-meta">💰 Recommended deal size: ${c.recommendedDealSize}</div>` : ''}
        ${c.growthStrategy ? `<div class="client-strategy">→ ${c.growthStrategy}</div>` : ''}
      </div>
      <div style="text-align:right;flex-shrink:0">
        <div style="font-weight:900;font-size:18px">${c.dealScore}<span style="font-size:11px;color:#94a3b8">/10</span></div>
        <span class="badge badge-${c.tier}">${c.tier}</span>
      </div>
    </div>`).join('')}
  </div>` : ''}

  <!-- Expense Recommendations -->
  ${(report.expenseRecommendations ?? []).length > 0 ? `
  <div class="section">
    <div class="section-title">Expense Optimization</div>
    ${report.expenseRecommendations.map((e: any) => `
    <div class="client-row">
      <div>
        <div class="client-name" style="text-transform:uppercase;font-size:12px">${e.category}</div>
        <div class="client-meta">${e.suggestion}</div>
      </div>
      <span class="badge badge-${e.action}">${e.action}</span>
    </div>`).join('')}
  </div>` : ''}

  <!-- Revenue Forecast -->
  ${report.report?.predictedRevenue ? `
  <div class="section">
    <div class="section-title">3-Month Revenue Forecast</div>
    <div class="pricing-box">${report.report.predictedRevenue}</div>
  </div>` : ''}

  <div class="footer">
    <span>invoicer.nevinbali.me · AI Evaluation Report</span>
    <span>Generated ${new Date(report.createdAt).toLocaleString('en-IN')}</span>
  </div>

</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}