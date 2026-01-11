/* eslint-disable @typescript-eslint/no-explicit-any */
import PDFDocument from "pdfkit";

export async function generateInvoicePdf(invoice: any): Promise<Buffer> {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers: Buffer[] = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    // Header
    doc.fontSize(20).text("INVOICE", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Invoice No: ${invoice.invoiceNumber}`);
    doc.text(`Issue Date: ${new Date(invoice.issueDate).toDateString()}`);
    doc.text(`Due Date: ${new Date(invoice.dueDate).toDateString()}`);
    doc.moveDown();

    // Client
    doc.text(`Billed To: ${invoice.client.clientName}`);
    doc.text(`Email: ${invoice.client.email}`);
    doc.moveDown();

    // Items
    doc.fontSize(14).text("Items");
    doc.moveDown(0.5);

    invoice.items.forEach((item: any, i: number) => {
      doc.text(
        `${i + 1}. ${item.name} - ${item.quantity} x ₹${item.rate}`
      );
    });

    doc.moveDown();

    doc.text(`Discount: ${invoice.discount}%`);
    doc.text(`Tax: ${invoice.tax}%`);
    doc.fontSize(12).font("Helvetica-Bold").text(`Total Amount: ₹${invoice.totalAmount}`);

    doc.end();
  });
}
