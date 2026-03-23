"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface InvoiceItem {
  name: string;
  description?: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceData {
  _id: string;
  invoiceNumber: string;
  status: string;
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  subTotal: number;
  discountPercent?: number;
  discountAmount?: number;
  taxPercent?: number;
  taxAmount?: number;
  description?: string;
  termsAndConditions?: string;
  items: InvoiceItem[];
  logo?: string;
  accentColor?: string;
  client: {
    clientName: string;
    email: string;
    phone?: string;
    address?: string;
  };
}

const THEMES = [
  { name: "Obsidian", accent: "#0f0f0f", light: "#f5f5f5", text: "#0f0f0f" },
  { name: "Indigo", accent: "#4f46e5", light: "#eef2ff", text: "#3730a3" },
  { name: "Emerald", accent: "#059669", light: "#ecfdf5", text: "#065f46" },
  { name: "Rose", accent: "#e11d48", light: "#fff1f2", text: "#9f1239" },
  { name: "Amber", accent: "#d97706", light: "#fffbeb", text: "#92400e" },
  { name: "Slate", accent: "#475569", light: "#f8fafc", text: "#1e293b" },
  { name: "Violet", accent: "#7c3aed", light: "#f5f3ff", text: "#5b21b6" },
  { name: "Cyan", accent: "#0891b2", light: "#ecfeff", text: "#155e75" },
  { name: "Coral", accent: "#f97316", light: "#fff7ed", text: "#9a3412" },
  { name: "Navy", accent: "#1e3a8a", light: "#eff6ff", text: "#1e3a8a" },
  { name: "Mint", accent: "#10b981", light: "#f0fdf4", text: "#065f46" },
  { name: "Pink", accent: "#db2777", light: "#fdf2f8", text: "#9d174d" },
  { name: "Teal", accent: "#0d9488", light: "#f0fdfa", text: "#134e4a" },
  { name: "Gold", accent: "#b45309", light: "#fefce8", text: "#713f12" },
  { name: "Crimson", accent: "#991b1b", light: "#fef2f2", text: "#7f1d1d" },
  { name: "Plum", accent: "#6b21a8", light: "#faf5ff", text: "#581c87" },
];
function InvoicePreview({
  invoice,
  logo,
  accent,
  businessName,
  businessEmail,
}: {
  invoice: InvoiceData;
  logo: string | null;
  accent: (typeof THEMES)[0];
  businessName: string;
  businessEmail: string;
}) {
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <div
      className="w-full bg-white shadow-2xl"
      style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "842px" }}
    >
      {/* Header band */}
      <div style={{ background: accent.accent, padding: "36px 48px 32px" }}>
        <div className="flex items-start justify-between">
          <div>
            {logo ? (
              <img src={logo} alt="logo" className="h-12 object-contain mb-3" style={{ filter: "brightness(0) invert(1)" }} />
            ) : (
              <div className="text-white font-bold text-2xl mb-1" style={{ letterSpacing: "-0.5px" }}>
                {businessName || "Your Business"}
              </div>
            )}
            <div className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>
              {businessEmail}
            </div>
          </div>
          <div className="text-right">
            <div className="text-white text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>
              Invoice
            </div>
            <div className="text-white font-bold text-xl">#{invoice.invoiceNumber}</div>
            <div
              className="text-xs mt-2 px-3 py-1 rounded-full inline-block font-semibold"
              style={{ background: "rgba(255,255,255,0.15)", color: "white" }}
            >
              {invoice.status}
            </div>
          </div>
        </div>
      </div>

      {/* Meta row */}
      <div className="grid grid-cols-3 gap-0" style={{ borderBottom: "1px solid #f0f0f0" }}>
        {[
          { label: "Billed To", value: invoice.client?.clientName, sub: invoice.client?.email },
          { label: "Issue Date", value: new Date(invoice.issueDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) },
          { label: "Due Date", value: new Date(invoice.dueDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }), highlight: true },
        ].map((cell, i) => (
          <div
            key={i}
            className="px-8 py-5"
            style={{
              borderRight: i < 2 ? "1px solid #f0f0f0" : "none",
              background: cell.highlight ? accent.light : "white",
            }}
          >
            <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#999" }}>
              {cell.label}
            </div>
            <div className="font-semibold text-sm" style={{ color: accent.text }}>
              {cell.value}
            </div>
            {cell.sub && <div className="text-xs mt-0.5" style={{ color: "#aaa" }}>{cell.sub}</div>}
          </div>
        ))}
      </div>

      {/* Items */}
      <div className="px-8 pt-6 pb-2">
        <table className="w-full" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${accent.accent}` }}>
              {["Item", "Qty", "Rate", "Amount"].map((h, i) => (
                <th
                  key={h}
                  className="pb-3 text-xs font-semibold uppercase tracking-widest"
                  style={{ color: accent.accent, textAlign: i === 0 ? "left" : "right" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoice.items?.map((item, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #f5f5f5" }}>
                <td className="py-3.5">
                  <div className="font-medium text-sm" style={{ color: "#1a1a1a" }}>{item.name}</div>
                  {item.description && (
                    <div className="text-xs mt-0.5" style={{ color: "#aaa" }}>{item.description}</div>
                  )}
                </td>
                <td className="py-3.5 text-sm text-right" style={{ color: "#666" }}>{item.quantity}</td>
                <td className="py-3.5 text-sm text-right" style={{ color: "#666" }}>{fmt(item.rate)}</td>
                <td className="py-3.5 text-sm text-right font-medium" style={{ color: "#1a1a1a" }}>{fmt(item.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="px-8 pb-6">
        <div className="ml-auto" style={{ maxWidth: "260px" }}>
          {[
            { label: "Subtotal", value: invoice.subTotal, show: true },
            { label: `Discount (${invoice.discountPercent || 0}%)`, value: -(invoice.discountAmount || 0), show: !!invoice.discountAmount },
            { label: `Tax (${invoice.taxPercent || 0}%)`, value: invoice.taxAmount || 0, show: !!invoice.taxAmount },
          ]
            .filter((r) => r.show)
            .map((row) => (
              <div key={row.label} className="flex justify-between py-1.5 text-sm" style={{ color: "#666" }}>
                <span>{row.label}</span>
                <span>{fmt(row.value)}</span>
              </div>
            ))}
          <div
            className="flex justify-between items-center mt-3 pt-3 rounded-lg px-4 py-3"
            style={{ background: accent.accent }}
          >
            <span className="font-bold text-sm text-white">Total Due</span>
            <span className="font-bold text-lg text-white">{fmt(invoice.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      {(invoice.description || invoice.termsAndConditions) && (
        <div className="mx-8 mb-8 grid grid-cols-2 gap-4">
          {invoice.description && (
            <div className="rounded-lg p-4" style={{ background: "#fafafa" }}>
              <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#aaa" }}>Notes</div>
              <div className="text-xs leading-relaxed" style={{ color: "#666" }}>{invoice.description}</div>
            </div>
          )}
          {invoice.termsAndConditions && (
            <div className="rounded-lg p-4" style={{ background: "#fafafa" }}>
              <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#aaa" }}>Terms</div>
              <div className="text-xs leading-relaxed" style={{ color: "#666" }}>{invoice.termsAndConditions}</div>
            </div>
          )}
        </div>
      )}

      {/* Footer strip */}
      <div className="px-8 py-4 flex items-center justify-between" style={{ borderTop: "1px solid #f0f0f0" }}>
        <span className="text-xs" style={{ color: "#ccc" }}>Generated via Invoicer</span>
        <div className="w-16 h-1 rounded-full" style={{ background: accent.accent, opacity: 0.3 }} />
      </div>
    </div>
  );
}

export default function InvoiceEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Customization state
  const [logo, setLogo] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
  const [businessName, setBusinessName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch invoice
  useEffect(() => {
    if (!id) return;
    fetch(`/api/invoices/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setInvoice(data);
        if (data.logo) setLogo(data.logo);
        if (data.accentColor) {
          const t = THEMES.find((t) => t.accent === data.accentColor);
          if (t) setSelectedTheme(t);
        }
      })
      .catch(() => setError("Failed to load invoice"))
      .finally(() => setLoading(false));
  }, [id]);

  // Logo upload handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("Logo must be under 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setLogo(reader.result as string);
    reader.readAsDataURL(file);
  };

  // Save customization to DB
  const saveCustomization = async () => {
    await fetch(`/api/invoices/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        logo,
        accentColor: selectedTheme.accent,
      }),
    });
  };

  // Send invoice
  const handleSend = async () => {
    if (!invoice) return;
    setSending(true);
    setError(null);

    try {
      // Save logo + theme first
      await saveCustomization();

      const res = await fetch(`/api/invoices/${id}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName, businessEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "insufficient_credits") {
          setError("Not enough credits to send this invoice.");
        } else {
          setError(data.error || "Failed to send invoice");
        }
        return;
      }

      setSent(true);
      setTimeout(() => router.push("/invoices"), 2500);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setSending(false);
    }
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0a" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <span className="text-white/40 text-sm">Loading invoice...</span>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0a" }}>
        <div className="text-white/40">Invoice not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a" }}>
      {/* Top bar */}
      <div
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-3"
        style={{ background: "rgba(10,10,10,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="text-white/40 hover:text-white/80 transition-colors text-sm flex items-center gap-1.5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back
          </button>
          <span className="text-white/20">/</span>
          <span className="text-white/60 text-sm">Invoice #{invoice.invoiceNumber}</span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}
          >
            {invoice.status}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Save button */}
          <button
            onClick={saveCustomization}
            className="text-sm px-4 py-1.5 rounded-lg transition-all"
            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            Save Draft
          </button>

          {/* Send button */}
          <motion.button
            onClick={handleSend}
            disabled={sending || sent}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 text-sm px-5 py-1.5 rounded-lg font-semibold transition-all disabled:opacity-50"
            style={{ background: selectedTheme.accent, color: "white" }}
          >
            {sending ? (
              <>
                <div className="w-3.5 h-3.5 border border-white/40 border-t-white rounded-full animate-spin" />
                Sending...
              </>
            ) : sent ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Sent!
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
                Send Invoice
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Error toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 left-1/2 z-50 -translate-x-1/2 px-4 py-2.5 rounded-lg text-sm flex items-center gap-2"
            style={{ background: "#ef4444", color: "white" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            {error}
            <button onClick={() => setError(null)} className="ml-2 opacity-70 hover:opacity-100">×</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success overlay */}
      <AnimatePresence>
        {sent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(10,10,10,0.9)", backdropFilter: "blur(8px)" }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex flex-col items-center gap-6 text-center"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: selectedTheme.accent }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <div>
                <div className="text-white text-2xl font-bold mb-2">Invoice Sent!</div>
                <div className="text-white/40 text-sm">
                  Email delivered to {invoice.client?.email}
                </div>
                <div className="text-white/30 text-xs mt-1">Redirecting to dashboard...</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main layout */}
      <div className="flex h-[calc(100vh-49px)]">
        {/* ── LEFT PANEL — Controls ── */}
        <div
          className="w-72 flex-shrink-0 overflow-y-auto"
          style={{ background: "#111", borderRight: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="p-5 space-y-6">

            {/* Logo Upload */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest mb-3 block" style={{ color: "rgba(255,255,255,0.3)" }}>
                Business Logo
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative rounded-xl overflow-hidden cursor-pointer transition-all group"
                style={{
                  border: "1.5px dashed rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.03)",
                  minHeight: "96px",
                }}
              >
                {logo ? (
                  <div className="relative">
                    <img src={logo} alt="logo" className="w-full h-24 object-contain p-3" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs font-medium">Change Logo</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                    </div>
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Upload logo</span>
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.15)" }}>PNG, JPG up to 2MB</span>
                  </div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              {logo && (
                <button
                  onClick={() => setLogo(null)}
                  className="text-xs mt-2 transition-colors"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#ef4444")}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.25)")}
                >
                  Remove logo
                </button>
              )}
            </div>

            {/* Business Info */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest mb-3 block" style={{ color: "rgba(255,255,255,0.3)" }}>
                Your Business
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Business name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full text-sm px-3 py-2.5 rounded-lg outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.8)",
                  }}
                />
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                  className="w-full text-sm px-3 py-2.5 rounded-lg outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.8)",
                  }}
                />
              </div>
            </div>

            {/* Color Theme */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest mb-3 block" style={{ color: "rgba(255,255,255,0.3)" }}>
                Accent Color
              </label>
              <div className="grid grid-cols-3 gap-2">
                {THEMES.map((theme) => (
                  <button
                    key={theme.name}
                    onClick={() => setSelectedTheme(theme)}
                    className="relative rounded-lg py-2.5 text-xs font-medium transition-all"
                    style={{
                      background: theme.accent,
                      color: "white",
                      outline: selectedTheme.name === theme.name ? `2px solid white` : "2px solid transparent",
                      outlineOffset: "2px",
                    }}
                  >
                    {theme.name}
                    {selectedTheme.name === theme.name && (
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-white rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Invoice summary */}
            <div className="rounded-xl p-4 space-y-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.25)" }}>
                Summary
              </div>
              {[
                { label: "Client", value: invoice.client?.clientName },
                { label: "Email", value: invoice.client?.email },
                { label: "Items", value: `${invoice.items?.length || 0} items` },
                { label: "Due", value: new Date(invoice.dueDate).toLocaleDateString("en-IN") },
              ].map((row) => (
                <div key={row.label} className="flex justify-between">
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{row.label}</span>
                  <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>{row.value}</span>
                </div>
              ))}
              <div className="pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.4)" }}>Total</span>
                  <span className="font-bold" style={{ color: selectedTheme.accent === "#0f0f0f" ? "white" : selectedTheme.accent }}>
                    ₹{invoice.totalAmount?.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* What happens on send */}
            <div className="rounded-xl p-4 space-y-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.07)" }}>
              <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.2)" }}>
                On Send
              </div>
              {[
                "Razorpay payment link created",
                "QR code generated",
                "Email sent via Resend",
                "Invoice marked as Sent",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: selectedTheme.accent + "33" }}>
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={selectedTheme.accent} strokeWidth="3">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <span className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL — Live Preview ── */}
        <div className="flex-1 overflow-y-auto p-8" style={{ background: "#0d0d0d" }}>
          <div className="max-w-2xl mx-auto">
            <div className="text-xs font-semibold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: "rgba(255,255,255,0.2)" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Preview
            </div>

            <motion.div
              key={selectedTheme.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl overflow-hidden shadow-2xl"
              style={{ boxShadow: `0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)` }}
            >
              <InvoicePreview
                invoice={invoice}
                logo={logo}
                accent={selectedTheme}
                businessName={businessName}
                businessEmail={businessEmail}
              />
            </motion.div>

            <div className="text-center mt-6 text-xs" style={{ color: "rgba(255,255,255,0.15)" }}>
              This is how your client will see the invoice in their email
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}