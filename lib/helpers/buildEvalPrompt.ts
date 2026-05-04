type ReportType = 'expense' | 'invoice' | 'client' | 'complete';

interface TavilyResult {
  marketOverview: string;
  pricingBenchmarks: string;
  combined: string;
}

interface BuildPromptParams {
  reportType: ReportType;
  profile: any;
  invoices: any[];
  clients: any[];
  expenses: any[];
  marketContext: TavilyResult;
}

export function buildEvalPrompt({
  reportType,
  profile,
  invoices,
  clients,
  expenses,
  marketContext,
}: BuildPromptParams): string {
  const sections: string[] = [];

  sections.push(`REPORT TYPE: ${reportType.toUpperCase()}`);

  sections.push(`\nUSER PROFILE:\n${JSON.stringify({
    userType:    profile.page1?.userType,
    occupation:  profile.page1?.occupation,
    bio:         profile.page1?.bio,
    company:     profile.page2?.companyName,
    industry:    profile.page2?.industry,
    teamSize:    profile.page2?.teamSize,
    revenue:     profile.page3?.monthlyRevenueRange,
    dealSize:    profile.page3?.avgDealSize,
    services:    profile.page3?.primaryServices,
    paymentPref: profile.page3?.paymentTermsPreference,
    priorities:  profile.page3?.currentPriorities,
    goals:       profile.page3?.goals,
  }, null, 2)}`);

  if (['invoice', 'complete'].includes(reportType)) {
    sections.push(`\nINVOICES (last 90 days, ${invoices.length} total):\n${JSON.stringify(
      invoices.map(inv => ({
        title:    inv.invoiceTitle,
        amount:   inv.totalAmount,
        status:   inv.status,
        clientId: inv.clientId?.toString(),
        client:   inv.clientName,
        date:     inv.date,
      })), null, 2
    )}`);
  }

  // Per-client deep analysis — link invoices to each client
  if (['client', 'complete'].includes(reportType)) {
    const clientsWithInvoices = clients.map(c => {
      const clientInvoices = invoices.filter(
        inv => inv.clientId?.toString() === c._id?.toString()
      );
      const totalBilled   = clientInvoices.reduce((s, inv) => s + (inv.totalAmount ?? 0), 0);
      const paidInvoices  = clientInvoices.filter(inv => inv.status === 'paid');
      const paymentRate   = clientInvoices.length
        ? Math.round((paidInvoices.length / clientInvoices.length) * 100)
        : 0;

      return {
        name:              c.clientName,
        company:           c.companyName,
        country:           c.country,
        currentCharge:     c.serviceCharge,
        totalInvoices:     clientInvoices.length,
        totalBilled,
        paymentRate:       `${paymentRate}%`,
        avgInvoiceValue:   clientInvoices.length
          ? Math.round(totalBilled / clientInvoices.length)
          : 0,
        recentInvoices:    clientInvoices.slice(0, 5).map(inv => ({
          title:  inv.invoiceTitle,
          amount: inv.totalAmount,
          status: inv.status,
          date:   inv.date,
        })),
      };
    });

    sections.push(`\nCLIENTS WITH INVOICE HISTORY (${clients.length} total):\n${JSON.stringify(
      clientsWithInvoices, null, 2
    )}`);
  }

  if (['expense', 'complete'].includes(reportType)) {
    sections.push(`\nEXPENSES (last 90 days, ${expenses.length} total):\n${JSON.stringify(
      expenses.map(e => ({
        category:    e.category,
        amount:      e.amount,
        description: e.description,
        date:        e.date,
      })), null, 2
    )}`);
  }

  // Richer market context — both sections
  sections.push(`\nMARKET CONTEXT (live web data):
${marketContext.combined}`);

  return sections.join('\n');
}