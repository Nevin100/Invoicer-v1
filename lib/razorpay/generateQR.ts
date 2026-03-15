import QRCode from "qrcode";

export async function generateQRBase64(url: string): Promise<string> {
  const qr = await QRCode.toDataURL(url, {
    width: 200,
    margin: 2,
    color: { dark: "#000000", light: "#FFFFFF" },
  });
  return qr; 
}