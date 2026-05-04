export function exportReportAsPdf(reportId: string, reportType: string) {
  const printWindow = window.open(`/api/ai-eval/pdf/${reportId}`, '_blank');
  if (!printWindow) {
    alert('Popup blocked — please allow popups for PDF export.');
  }
}