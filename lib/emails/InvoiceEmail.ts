interface InvoiceEmailProps {
  invoiceNumber: string;
  clientName: string;
  totalAmount: number;
  dueDate: string;
  paymentLink: string;
  qrCodeBase64: string;
  fromBusiness: string;
  accentColor?: string;
  items: { name: string; quantity: number; rate: number; amount: number }[];
}

export function invoiceEmailHTML(props: InvoiceEmailProps): string {
  const {
    invoiceNumber, clientName, totalAmount, dueDate,
    paymentLink, qrCodeBase64, fromBusiness, items,
    accentColor = "#0f0f0f",
  } = props;

  const accentAlpha = accentColor + "18";

  const itemRows = items.map(item => {
    const qty = item.quantity ?? 1;
    const rate = item.rate ?? 0;
    const amount = item.amount ?? qty * rate; 

    return `
    <tr>
      <td style="padding:12px 8px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#1a1a1a">${item.name || "Item"}</td>
      <td style="padding:12px 8px;border-bottom:1px solid #f0f0f0;text-align:center;font-size:13px;color:#666">${qty}</td>
      <td style="padding:12px 8px;border-bottom:1px solid #f0f0f0;text-align:right;font-size:13px;color:#666">₹${rate.toLocaleString("en-IN")}</td>
      <td style="padding:12px 8px;border-bottom:1px solid #f0f0f0;text-align:right;font-size:13px;font-weight:600;color:#1a1a1a">₹${amount.toLocaleString("en-IN")}</td>
    </tr>
  `}).join("");

  return`
  <!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f0f0f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f0f0;padding:48px 0">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">

        <!-- TOP ACCENT BAR -->
        <tr>
          <td style="background:${accentColor};height:4px;font-size:0;line-height:0">&nbsp;</td>
        </tr>

        <!-- HEADER -->
        <tr>
          <td style="padding:36px 48px 28px">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <div style="font-size:20px;font-weight:800;color:#0f0f0f;letter-spacing:-0.5px">${fromBusiness}</div>
                  <div style="font-size:12px;color:#999;margin-top:3px;font-weight:500;text-transform:uppercase;letter-spacing:1px">Invoice</div>
                </td>
                <td align="right">
                  <div style="display:inline-block;background:${accentAlpha};border:1px solid ${accentColor}33;border-radius:8px;padding:8px 16px">
                    <span style="font-size:14px;font-weight:800;color:${accentColor}">#${invoiceNumber}</span>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- DIVIDER -->
        <tr><td style="padding:0 48px"><div style="height:1px;background:#f0f0f0"></div></td></tr>

        <!-- META ROW -->
        <tr>
          <td style="padding:0">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:20px 48px;border-right:1px solid #f0f0f0" width="50%">
                  <div style="font-size:10px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:6px">Billed To</div>
                  <div style="font-size:14px;font-weight:700;color:#0f0f0f">${clientName}</div>
                </td>
                <td style="padding:20px 48px" width="50%">
                  <div style="font-size:10px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:6px">Due Date</div>
                  <div style="font-size:14px;font-weight:700;color:${accentColor}">${dueDate}</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- DIVIDER -->
        <tr><td style="padding:0 48px"><div style="height:1px;background:#f0f0f0"></div></td></tr>

        <!-- BODY -->
        <tr>
          <td style="padding:32px 48px">

            <!-- Greeting -->
            <p style="font-size:15px;color:#333;margin:0 0 24px">
              Hi <strong style="color:#0f0f0f">${clientName}</strong>, please find your invoice details below.
            </p>

            <!-- Items Table -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px">
              <thead>
                <tr style="background:${accentAlpha}">
                  <th style="padding:10px 8px;text-align:left;font-size:10px;font-weight:700;color:${accentColor};text-transform:uppercase;letter-spacing:1px">Item</th>
                  <th style="padding:10px 8px;text-align:center;font-size:10px;font-weight:700;color:${accentColor};text-transform:uppercase;letter-spacing:1px">Qty</th>
                  <th style="padding:10px 8px;text-align:right;font-size:10px;font-weight:700;color:${accentColor};text-transform:uppercase;letter-spacing:1px">Rate</th>
                  <th style="padding:10px 8px;text-align:right;font-size:10px;font-weight:700;color:${accentColor};text-transform:uppercase;letter-spacing:1px">Amount</th>
                </tr>
              </thead>
              <tbody>${itemRows}</tbody>
            </table>

            <!-- Total box -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="right">
                  <div style="display:inline-block;background:${accentColor};border-radius:12px;padding:14px 24px;min-width:200px">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:12px;font-weight:600;color:rgba(255,255,255,0.7);padding-right:24px">Total Due</td>
                        <td style="font-size:20px;font-weight:800;color:#ffffff">₹${totalAmount.toLocaleString("en-IN")}</td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>
            </table>

            <!-- Pay Now Button -->
            <div style="text-align:center;margin:36px 0 28px">
              <a href="${paymentLink}"
                style="background:${accentColor};color:#ffffff;padding:16px 48px;border-radius:10px;text-decoration:none;font-size:15px;font-weight:700;display:inline-block;letter-spacing:0.3px">
                Pay Now ₹${totalAmount.toLocaleString("en-IN")}
              </a>
            </div>

            <!-- QR Code -->
            <div style="text-align:center;margin:0 0 8px">
              <p style="color:#aaa;font-size:12px;margin:0 0 14px;font-weight:500">Or scan to pay</p>
              <img src="${qrCodeBase64}" width="140" height="140" alt="Payment QR"
                style="border:2px solid ${accentColor}22;border-radius:12px;padding:10px;background:#fafafa"/>
            </div>

          </td>
        </tr>

        <!-- BOTTOM ACCENT BAR + FOOTER -->
        <tr>
          <td style="background:${accentAlpha};padding:20px 48px;border-top:1px solid ${accentColor}22">
            <p style="color:#aaa;font-size:11px;margin:0;text-align:center;font-weight:500">
              Sent by <strong style="color:${accentColor}">${fromBusiness}</strong> via Invoicer &nbsp;·&nbsp; Do not reply to this email
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}
