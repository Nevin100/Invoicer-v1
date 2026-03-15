interface InvoiceEmailProps {
  invoiceNumber: string;
  clientName: string;
  totalAmount: number;
  dueDate: string;
  paymentLink: string;
  qrCodeBase64: string;
  fromBusiness: string;
  items: { name: string; qty: number; rate: number; amount: number }[];
}

export function invoiceEmailHTML(props: InvoiceEmailProps): string {
  const {
    invoiceNumber, clientName, totalAmount, dueDate,
    paymentLink, qrCodeBase64, fromBusiness, items,
  } = props;

  const itemRows = items.map(item => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #f0f0f0">${item.name}</td>
      <td style="padding:8px;border-bottom:1px solid #f0f0f0;text-align:center">${item.qty}</td>
      <td style="padding:8px;border-bottom:1px solid #f0f0f0;text-align:right">₹${item.rate.toLocaleString("en-IN")}</td>
      <td style="padding:8px;border-bottom:1px solid #f0f0f0;text-align:right">₹${item.amount.toLocaleString("en-IN")}</td>
    </tr>
  `).join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
        
        <!-- Header -->
        <tr>
          <td style="background:#0f0f0f;padding:32px 40px">
            <h1 style="color:#fff;margin:0;font-size:24px">${fromBusiness}</h1>
            <p style="color:#888;margin:4px 0 0">Invoice ${invoiceNumber}</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px">
            <p style="font-size:16px;color:#333">Hi <strong>${clientName}</strong>,</p>
            <p style="color:#555">Please find your invoice below. Payment is due by <strong>${dueDate}</strong>.</p>

            <!-- Items Table -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;border-collapse:collapse">
              <thead>
                <tr style="background:#f9f9f9">
                  <th style="padding:10px 8px;text-align:left;font-size:12px;color:#888;text-transform:uppercase">Item</th>
                  <th style="padding:10px 8px;text-align:center;font-size:12px;color:#888;text-transform:uppercase">Qty</th>
                  <th style="padding:10px 8px;text-align:right;font-size:12px;color:#888;text-transform:uppercase">Rate</th>
                  <th style="padding:10px 8px;text-align:right;font-size:12px;color:#888;text-transform:uppercase">Amount</th>
                </tr>
              </thead>
              <tbody>${itemRows}</tbody>
            </table>

            <!-- Total -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="text-align:right;padding:8px">
                  <span style="font-size:20px;font-weight:700;color:#0f0f0f">
                    Total: ₹${totalAmount.toLocaleString("en-IN")}
                  </span>
                </td>
              </tr>
            </table>

            <!-- Pay Now Button -->
            <div style="text-align:center;margin:32px 0">
              <a href="${paymentLink}"
                style="background:#0f0f0f;color:#fff;padding:14px 40px;border-radius:8px;text-decoration:none;font-size:16px;font-weight:600;display:inline-block">
                Pay Now ₹${totalAmount.toLocaleString("en-IN")}
              </a>
            </div>

            <!-- QR Code -->
            <div style="text-align:center;margin:24px 0">
              <p style="color:#888;font-size:13px;margin-bottom:12px">Or scan QR to pay</p>
              <img src="${qrCodeBase64}" width="160" height="160" alt="Payment QR Code"
                style="border:1px solid #eee;border-radius:8px;padding:8px"/>
            </div>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9f9f9;padding:20px 40px;text-align:center">
            <p style="color:#aaa;font-size:12px;margin:0">
              This is an automated invoice from ${fromBusiness} via Invoicer
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}