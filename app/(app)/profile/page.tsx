"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Building2, TrendingUp, GraduationCap, Phone, Globe,
  Briefcase, Zap, Target, Star, Award, Edit3, Check, X, Loader2,
  FileText, BadgeCheck, Calendar, IndianRupee, Users, Rocket,
  BriefcaseIcon, Heart, Crown, ChevronRight, Sparkles, CreditCard,
  QrCode, Landmark, AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// ─── Types ───────────────────────────────────────────────
interface Profile {
  page1: { fullName: string; phone: string; bio: string; userType: string; occupation: string; tagline: string; avatar?: string };
  page2: { companyName: string; companyType: string; industry: string; yearsInBusiness: number; teamSize: string; officeAddress: { street: string; city: string; state: string; pincode: string }; website: string; gstin: string };
  page3: { monthlyRevenueRange: string; avgDealSize: string; primaryServices: string[]; paymentTermsPreference: string; currentPriorities: { primary: string; secondary: string }; goals: { shortTerm: string; midTerm: string; longTerm: string }; dailyBusinessScale: string };
  page4: { education: { degree: string; field: string; institution: string; year: number }; achievements: string[]; hobbies: string[]; pastTradeHighlights: string; currentTargets: string };
  page5?: { preferredMethod?: string; upiId?: string; accountName?: string; accountNo?: string; ifsc?: string; bankName?: string; branchName?: string; qrCode?: string };
  completedPages: number[];
  isComplete: boolean;
}

interface UserMeta {
  credits: number; plan: "starter" | "pro"; planExpiresAt?: string; username?: string; email?: string;
}

// ─── Labels ───────────────────────────────────────────────
const REVENUE_LABELS: Record<string, string> = { under_50k: "Under ₹50K", "50k_2L": "₹50K – ₹2L", "2L_5L": "₹2L – ₹5L", "5L_10L": "₹5L – ₹10L", "10L_plus": "₹10L+" };
const DEAL_LABELS: Record<string, string>    = { under_10k: "Under ₹10K", "10k_50k": "₹10K – ₹50K", "50k_2L": "₹50K – ₹2L", "2L_plus": "₹2L+" };
const TEAM_LABELS: Record<string, string>    = { solo: "Solo", "2-5": "2–5 People", "6-15": "6–15 People", "16-50": "16–50 People", "50+": "50+ People" };

function getCreditColor(credits: number) {
  if (credits > 200) return { text: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100", bar: "bg-indigo-500" };
  if (credits > 50)  return { text: "text-amber-600",  bg: "bg-amber-50",  border: "border-amber-100",  bar: "bg-amber-400"  };
  return               { text: "text-red-500",    bg: "bg-red-50",    border: "border-red-100",    bar: "bg-red-400"    };
}

// ─── Section Card ─────────────────────────────────────────
const SectionCard = ({ title, icon: Icon, color, children, onEdit }: { title: string; icon: any; color: string; children: React.ReactNode; onEdit: () => void }) => (
  <motion.div whileHover={{ y: -4 }} className="bg-white border border-slate-200/60 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col h-full">
    <div className="flex items-center justify-between p-6 border-b border-slate-50">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg`}><Icon size={20} /></div>
        <h3 className="text-xs font-black uppercase tracking-[0.15em] text-slate-800">{title}</h3>
      </div>
      <button onClick={onEdit} className="p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-all border border-slate-100 hover:border-indigo-100"><Edit3 size={16} /></button>
    </div>
    <div className="p-7 flex-1">{children}</div>
  </motion.div>
);

const InfoItem = ({ label, value, icon: Icon }: { label: string; value?: string | number; icon?: any }) => {
  if (!value) return null;
  return (
    <div className="group flex gap-4 py-3 border-b border-slate-50 last:border-0 items-center">
      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-indigo-500 transition-colors flex-shrink-0">
        {Icon ? <Icon size={14} /> : <div className="w-1 h-1 rounded-full bg-slate-300" />}
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
        <p className="text-sm font-semibold text-slate-700 leading-tight">{value}</p>
      </div>
    </div>
  );
};

const InputWrapper = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5 flex-1">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block">{label}</label>
    {children}
  </div>
);

// ─── Edit Modal ───────────────────────────────────────────
const EditModal = ({ pageNumber, profile, onClose, onSave }: {
  pageNumber: number; profile: Profile;
  onClose: () => void; onSave: (p: number, d: any) => Promise<void>;
}) => {
  const rawData = pageNumber === 5
    ? (profile.page5 || { preferredMethod: "upi", upiId: "", accountName: "", accountNo: "", ifsc: "", bankName: "", branchName: "", qrCode: "" })
    : profile[`page${pageNumber}` as keyof Profile];

  const [data, setData] = useState<any>(JSON.parse(JSON.stringify(rawData)));
  const [loading, setLoading] = useState(false);

  const ic = "w-full px-4 h-12 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 outline-none transition-all text-slate-800";
  const sc = ic + " appearance-none cursor-pointer";
  const tc = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 outline-none transition-all resize-none text-slate-800";

  const PAGE_TITLES = ["", "Basic Identity", "Business Info", "Financial Context", "Background", "Payment Details"];

  const handleUpdate = async () => {
    setLoading(true);
    try { await onSave(pageNumber, data); onClose(); }
    finally { setLoading(false); }
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={e => e.target === e.currentTarget && onClose()}>
        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[88vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col"
          onClick={e => e.stopPropagation()}>

          <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">Editing</p>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">{PAGE_TITLES[pageNumber]}</h2>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-2xl bg-slate-50 hover:bg-red-50 flex items-center justify-center text-slate-400 hover:text-red-500 border border-slate-100 transition-all"><X size={18} /></button>
          </div>

          <div className="overflow-y-auto flex-1 px-8 py-6 space-y-5">
            {/* Page 1 */}
            {pageNumber === 1 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputWrapper label="Full Name"><input className={ic} value={data.fullName || ""} onChange={e => setData({ ...data, fullName: e.target.value })} /></InputWrapper>
                  <InputWrapper label="Phone"><input className={ic} value={data.phone || ""} onChange={e => setData({ ...data, phone: e.target.value })} /></InputWrapper>
                </div>
                <InputWrapper label="Occupation"><input className={ic} value={data.occupation || ""} onChange={e => setData({ ...data, occupation: e.target.value })} /></InputWrapper>
                <InputWrapper label="Tagline"><input className={ic} value={data.tagline || ""} onChange={e => setData({ ...data, tagline: e.target.value })} /></InputWrapper>
                <InputWrapper label="Bio"><textarea className={tc} rows={3} value={data.bio || ""} onChange={e => setData({ ...data, bio: e.target.value })} /></InputWrapper>
              </>
            )}
            {/* Page 2 */}
            {pageNumber === 2 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputWrapper label="Company Name"><input className={ic} value={data.companyName || ""} onChange={e => setData({ ...data, companyName: e.target.value })} /></InputWrapper>
                  <InputWrapper label="Industry"><input className={ic} value={data.industry || ""} onChange={e => setData({ ...data, industry: e.target.value })} /></InputWrapper>
                  <InputWrapper label="Team Size">
                    <select className={sc} value={data.teamSize || ""} onChange={e => setData({ ...data, teamSize: e.target.value })}>
                      <option value="">Select</option>
                      <option value="solo">Solo</option><option value="2-5">2–5</option>
                      <option value="6-15">6–15</option><option value="16-50">16–50</option><option value="50+">50+</option>
                    </select>
                  </InputWrapper>
                  <InputWrapper label="GSTIN"><input className={ic} value={data.gstin || ""} onChange={e => setData({ ...data, gstin: e.target.value })} /></InputWrapper>
                </div>
                <InputWrapper label="Website"><input className={ic} value={data.website || ""} onChange={e => setData({ ...data, website: e.target.value })} /></InputWrapper>
              </>
            )}
            {/* Page 3 */}
            {pageNumber === 3 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputWrapper label="Revenue Range">
                  <select className={sc} value={data.monthlyRevenueRange || ""} onChange={e => setData({ ...data, monthlyRevenueRange: e.target.value })}>
                    <option value="">Select</option>
                    <option value="under_50k">Under ₹50K</option><option value="50k_2L">₹50K–₹2L</option>
                    <option value="2L_5L">₹2L–₹5L</option><option value="5L_10L">₹5L–₹10L</option><option value="10L_plus">₹10L+</option>
                  </select>
                </InputWrapper>
                <InputWrapper label="Avg Deal Size">
                  <select className={sc} value={data.avgDealSize || ""} onChange={e => setData({ ...data, avgDealSize: e.target.value })}>
                    <option value="">Select</option>
                    <option value="under_10k">Under ₹10K</option><option value="10k_50k">₹10K–₹50K</option>
                    <option value="50k_2L">₹50K–₹2L</option><option value="2L_plus">₹2L+</option>
                  </select>
                </InputWrapper>
                <InputWrapper label="Payment Terms">
                  <select className={sc} value={data.paymentTermsPreference || ""} onChange={e => setData({ ...data, paymentTermsPreference: e.target.value })}>
                    <option value="">Select</option>
                    <option value="immediate">Immediate</option><option value="net_15">Net 15</option>
                    <option value="net_30">Net 30</option><option value="net_60">Net 60</option><option value="milestone_based">Milestone Based</option>
                  </select>
                </InputWrapper>
                <InputWrapper label="Daily Scale"><input className={ic} value={data.dailyBusinessScale || ""} onChange={e => setData({ ...data, dailyBusinessScale: e.target.value })} /></InputWrapper>
              </div>
            )}
            {/* Page 4 */}
            {pageNumber === 4 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputWrapper label="Degree"><input className={ic} value={data.education?.degree || ""} onChange={e => setData({ ...data, education: { ...data.education, degree: e.target.value } })} /></InputWrapper>
                <InputWrapper label="Field"><input className={ic} value={data.education?.field || ""} onChange={e => setData({ ...data, education: { ...data.education, field: e.target.value } })} /></InputWrapper>
                <InputWrapper label="Institution"><input className={ic} value={data.education?.institution || ""} onChange={e => setData({ ...data, education: { ...data.education, institution: e.target.value } })} /></InputWrapper>
                <InputWrapper label="Year"><input className={ic} type="number" value={data.education?.year || ""} onChange={e => setData({ ...data, education: { ...data.education, year: Number(e.target.value) } })} /></InputWrapper>
              </div>
            )}
            {/* Page 5 — Payment Details */}
            {pageNumber === 5 && (
              <div className="space-y-5">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Preferred Method</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[{ v: "upi", l: "UPI", e: "📱" }, { v: "bank", l: "Bank", e: "🏦" }, { v: "both", l: "Both", e: "✅" }].map(opt => (
                      <button key={opt.v} type="button" onClick={() => setData({ ...data, preferredMethod: opt.v })}
                        className={`p-3 rounded-2xl border-2 text-center transition-all ${data.preferredMethod === opt.v ? "border-violet-500 bg-violet-50" : "border-slate-200 hover:border-slate-300"}`}>
                        <p className="text-lg mb-0.5">{opt.e}</p>
                        <p className={`text-[11px] font-black ${data.preferredMethod === opt.v ? "text-violet-700" : "text-slate-500"}`}>{opt.l}</p>
                      </button>
                    ))}
                  </div>
                </div>
                {(data.preferredMethod === "upi" || data.preferredMethod === "both") && (
                  <div className="space-y-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">UPI Details</p>
                    <InputWrapper label="UPI ID"><input className={ic} placeholder="yourname@ybl" value={data.upiId || ""} onChange={e => setData({ ...data, upiId: e.target.value })} /></InputWrapper>
                    <InputWrapper label="QR Code URL (optional)"><input className={ic} placeholder="https://..." value={data.qrCode || ""} onChange={e => setData({ ...data, qrCode: e.target.value })} /></InputWrapper>
                  </div>
                )}
                {(data.preferredMethod === "bank" || data.preferredMethod === "both") && (
                  <div className="space-y-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bank Transfer Details</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputWrapper label="Account Name"><input className={ic} placeholder="Nevin Bali" value={data.accountName || ""} onChange={e => setData({ ...data, accountName: e.target.value })} /></InputWrapper>
                      <InputWrapper label="Account Number"><input className={ic} placeholder="XXXX XXXX XXXX" value={data.accountNo || ""} onChange={e => setData({ ...data, accountNo: e.target.value })} /></InputWrapper>
                      <InputWrapper label="IFSC"><input className={ic} placeholder="SBIN0001234" value={data.ifsc || ""} onChange={e => setData({ ...data, ifsc: e.target.value.toUpperCase() })} /></InputWrapper>
                      <InputWrapper label="Bank Name"><input className={ic} placeholder="State Bank of India" value={data.bankName || ""} onChange={e => setData({ ...data, bankName: e.target.value })} /></InputWrapper>
                      <div className="sm:col-span-2">
                        <InputWrapper label="Branch (Optional)"><input className={ic} placeholder="New Delhi Main Branch" value={data.branchName || ""} onChange={e => setData({ ...data, branchName: e.target.value })} /></InputWrapper>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="px-8 py-6 border-t border-slate-50 flex gap-3">
            <button onClick={onClose} className="flex-1 h-12 rounded-2xl border-2 border-slate-100 text-slate-500 font-black text-xs uppercase tracking-widest hover:border-slate-200 transition-all">Cancel</button>
            <button onClick={handleUpdate} disabled={loading}
              className="flex-[2] h-12 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-white font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Check size={16} /> Save Changes</>}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─── Main Page ────────────────────────────────────────────
export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile]   = useState<Profile | null>(null);
  const [userMeta, setUserMeta] = useState<UserMeta | null>(null);
  const [loading, setLoading]   = useState(true);
  const [editingPage, setEditingPage] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/profile",  { credentials: "include" }).then(r => r.json()),
      fetch("/api/auth/me",  { credentials: "include" }).then(r => r.json()),
    ]).then(([profileData, meData]) => {
      setProfile(profileData.profile);
      if (meData.user) setUserMeta({ credits: meData.user.credits ?? 0, plan: meData.user.plan ?? "starter", planExpiresAt: meData.user.planExpiresAt, username: meData.user.username || meData.user.name, email: meData.user.email });
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = async (pageNumber: number, data: any) => {
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ pageNumber, data }),
    });
    if (!res.ok) { toast.error("Failed to save changes!"); return; }
    const updated = await res.json();
    setProfile(updated.profile);
    toast.success("Changes saved!", { style: { borderRadius: "20px", background: "#0f172a", color: "#fff", fontSize: "12px", fontWeight: "900" } });
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}
        className="w-16 h-16 bg-indigo-600 rounded-3xl shadow-xl flex items-center justify-center text-white">
        <Rocket size={24} />
      </motion.div>
    </div>
  );

  if (!profile) return null;

  const isPro      = userMeta?.plan === "pro";
  const credits    = userMeta?.credits ?? 0;
  const maxCredits = isPro ? 1500 : 200;
  const creditPct  = Math.min((credits / maxCredits) * 100, 100);
  const cs         = getCreditColor(credits);
  const p5         = profile.page5;
  const hasPaymentDetails = p5 && (p5.upiId || p5.accountNo);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 lg:p-12 font-['Archivo']">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ── Hero ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative bg-white border border-slate-200/60 rounded-[3rem] shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="h-48 md:h-56 bg-slate-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-transparent" />
            {isPro && <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none" style={{ background: "radial-gradient(circle, #fbbf24, #f59e0b)" }} />}
            <button onClick={() => setEditingPage(1)} className="absolute top-6 right-6 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-[10px] font-black uppercase text-white hover:bg-white/20 transition-all">Update Identity</button>
          </div>

          <div className="px-8 pb-10">
            <div className="relative flex flex-col md:flex-row items-end gap-6 -mt-12 md:-mt-16">
              <div className="relative flex-shrink-0">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-gradient-to-tr from-indigo-600 to-violet-500 border-[6px] border-white shadow-2xl flex items-center justify-center text-white text-5xl font-black italic">
                  {profile.page1.fullName?.charAt(0)?.toUpperCase() || "?"}
                </div>
                {isPro && (
                  <div className="absolute -top-2 -right-2 w-10 h-10 rounded-2xl bg-amber-400 border-4 border-white shadow-lg flex items-center justify-center">
                    <Crown size={16} className="text-white fill-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 mb-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter italic">{profile.page1.fullName}</h1>
                  {profile.isComplete && <BadgeCheck className="text-indigo-500" size={28} />}
                  {isPro
                    ? <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200"><Crown size={11} className="text-amber-500 fill-amber-400" /><span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Pro</span></div>
                    : <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Starter</span></div>
                  }
                </div>
                <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-xs flex items-center gap-2"><BriefcaseIcon size={14} className="text-slate-400" /> {profile.page1.occupation}</p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-slate-50">
              <div className="md:col-span-2 space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">Professional Bio</h4>
                <p className="text-slate-600 font-medium leading-relaxed italic text-lg">"{profile.page1.bio}"</p>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">Contact</h4>
                <div className="space-y-2">
                  {profile.page1.phone && <div className="flex items-center gap-3 text-sm font-bold text-slate-600"><Phone size={14} className="text-slate-300" /> {profile.page1.phone}</div>}
                  {profile.page2.website && <a href={profile.page2.website} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm font-bold text-indigo-500 hover:text-indigo-700"><Globe size={14} /> {profile.page2.website}</a>}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Credits + Plan ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Credits */}
          <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl ${cs.bg} ${cs.border} border flex items-center justify-center`}><Zap size={14} className={cs.text} /></div>
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">Credits Available</span>
              </div>
              <span className={`text-2xl font-black tabular-nums ${cs.text}`}>{credits.toLocaleString()}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${creditPct}%` }} transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }} className={`h-full rounded-full ${cs.bar}`} />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[10px] font-bold text-slate-400">{credits} / {maxCredits.toLocaleString()} credits</span>
              <span className={`text-[10px] font-black ${cs.text}`}>{creditPct.toFixed(0)}% remaining</span>
            </div>
            {credits <= 50 && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 border border-red-100">
                <Zap size={11} className="text-red-500 flex-shrink-0" />
                <span className="text-[10px] font-black text-red-500">Low credits — consider upgrading to avoid blocked actions.</span>
              </motion.div>
            )}
          </div>

          {/* Plan */}
          {isPro ? (
            <div className="relative rounded-[2rem] overflow-hidden p-6" style={{ background: "linear-gradient(135deg, #0f0c29 0%, #1a1060 50%, #24243e 100%)", boxShadow: "0 8px 32px rgba(79,70,229,0.2)" }}>
              <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: "radial-gradient(circle, #fbbf24, #f59e0b)" }} />
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center"><Crown size={14} className="text-amber-400 fill-amber-400" /></div>
                    <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Pro Plan Active</span>
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-tighter">Full access<br /><span className="italic" style={{ background: "linear-gradient(90deg, #a5b4fc, #c4b5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>unlocked.</span></h3>
                  {userMeta?.planExpiresAt && <p className="text-[10px] font-bold text-white/30 mt-2 uppercase tracking-widest">Renews {new Date(userMeta.planExpiresAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</p>}
                </div>
                <div className="flex flex-col items-end gap-2">
                  {["AI Reports", "Risk Scoring", "1,500 CR"].map(f => (
                    <div key={f} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/8 border border-white/10">
                      <Sparkles size={9} className="text-indigo-300" /><span className="text-[9px] font-black text-white/60 uppercase tracking-widest">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="relative rounded-[2rem] overflow-hidden p-6 cursor-pointer group" style={{ background: "linear-gradient(135deg, #f8f7ff 0%, #f0f4ff 100%)", border: "1.5px dashed rgba(79,70,229,0.2)" }} onClick={() => router.push("/upgrade/pro")}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center"><Zap size={14} className="text-indigo-500" /></div>
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Starter Plan</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Upgrade to<br /><span className="text-indigo-600 italic">Pro for ₹499.</span></h3>
                  <p className="text-xs font-bold text-slate-400 mt-2 max-w-[180px] leading-relaxed">1,500 credits, AI reports, client risk scoring & more.</p>
                </div>
                <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest" style={{ background: "rgba(79,70,229,0.08)", color: "#4f46e5", border: "1px solid rgba(79,70,229,0.15)" }}>
                  <Crown size={12} /> Upgrade <ChevronRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* ── 3 Column Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SectionCard title="Business" icon={Building2} color="from-blue-600 to-cyan-500" onEdit={() => setEditingPage(2)}>
            <InfoItem label="Entity"     value={profile.page2.companyName} icon={Briefcase} />
            <InfoItem label="Industry"   value={profile.page2.industry}    icon={Target}    />
            <InfoItem label="Team Size"  value={TEAM_LABELS[profile.page2.teamSize]} icon={Users} />
            <InfoItem label="GSTIN"      value={profile.page2.gstin}       icon={FileText}  />
          </SectionCard>

          <SectionCard title="Economics" icon={TrendingUp} color="from-emerald-600 to-teal-500" onEdit={() => setEditingPage(3)}>
            <InfoItem label="Revenue"    value={REVENUE_LABELS[profile.page3.monthlyRevenueRange]} icon={IndianRupee} />
            <InfoItem label="Deal Size"  value={DEAL_LABELS[profile.page3.avgDealSize]}            icon={Zap}         />
            <InfoItem label="Payments"   value={profile.page3.paymentTermsPreference}              icon={Calendar}    />
            {profile.page3.primaryServices?.length > 0 && (
              <div className="pt-3 flex flex-wrap gap-1.5">
                {profile.page3.primaryServices.slice(0, 3).map(s => (
                  <span key={s} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-lg">{s}</span>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard title="Journey" icon={GraduationCap} color="from-amber-500 to-orange-400" onEdit={() => setEditingPage(4)}>
            {profile.page4.education?.degree && (
              <div className="mb-4 p-3 bg-amber-50 rounded-2xl border border-amber-100">
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-0.5">Education</p>
                <p className="text-sm font-black text-amber-900">{profile.page4.education.degree} in {profile.page4.education.field}</p>
                <p className="text-xs font-bold text-amber-700">{profile.page4.education.institution}{profile.page4.education.year ? ` · ${profile.page4.education.year}` : ""}</p>
              </div>
            )}
            {profile.page4.hobbies?.length > 0 && (
              <div>
                <p className="text-[9px] font-black uppercase text-slate-400 mb-2">Interests</p>
                <div className="flex flex-wrap gap-2">
                  {profile.page4.hobbies.map(h => (
                    <div key={h} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-help" title={h}><Heart size={16} /></div>
                  ))}
                </div>
              </div>
            )}
          </SectionCard>
        </div>

        {/* ── Payment Details Card ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white border border-slate-200/60 rounded-[2.5rem] shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <CreditCard size={20} />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.15em] text-slate-800">Payment Details</h3>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5">Shown on every invoice you send to clients</p>
              </div>
            </div>
            <button onClick={() => setEditingPage(5)} className="p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-all border border-slate-100 hover:border-indigo-100">
              <Edit3 size={16} />
            </button>
          </div>

          <div className="p-7">
            {!hasPaymentDetails ? (
              /* Empty state */
              <div className="flex flex-col sm:flex-row items-center gap-6 py-4">
                <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <AlertCircle size={28} className="text-violet-400" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-sm font-black text-slate-900 mb-1">Payment details not configured</p>
                  <p className="text-xs font-bold text-slate-400 leading-relaxed">Add your UPI ID or bank details so clients know how to pay you. These appear on every invoice you send.</p>
                </div>
                <button onClick={() => setEditingPage(5)}
                  className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-violet-100 flex-shrink-0">
                  <CreditCard size={14} /> Add Now
                </button>
              </div>
            ) : (
              /* Filled state */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Method badge */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-violet-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <CreditCard size={16} className="text-violet-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Method</p>
                    <p className="text-sm font-black text-slate-800 capitalize">{p5?.preferredMethod || "UPI"}</p>
                  </div>
                </div>

                {/* UPI */}
                {p5?.upiId && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <QrCode size={16} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">UPI ID</p>
                      <p className="text-sm font-black text-slate-800">{p5.upiId}</p>
                    </div>
                  </div>
                )}

                {/* Bank */}
                {p5?.accountName && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Landmark size={16} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Bank Account</p>
                      <p className="text-sm font-black text-slate-800">{p5.accountName}</p>
                      {p5.bankName && <p className="text-[10px] font-bold text-slate-400">{p5.bankName} · {p5.ifsc}</p>}
                    </div>
                  </div>
                )}

                {/* QR preview */}
                {p5?.qrCode && (
                  <div className="sm:col-span-2 lg:col-span-3 flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p5.qrCode} alt="Payment QR" className="w-16 h-16 object-contain rounded-xl border border-slate-200 bg-white" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">QR Code</p>
                      <p className="text-xs font-bold text-slate-600">This QR will be embedded in your invoices — clients can scan and pay instantly.</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

      </div>

      {/* Edit Modal */}
      {editingPage !== null && (
        <EditModal pageNumber={editingPage} profile={profile} onClose={() => setEditingPage(null)} onSave={handleSave} />
      )}
    </div>
  );
}