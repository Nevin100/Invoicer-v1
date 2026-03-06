"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Building2, TrendingUp, GraduationCap,
  ChevronRight, ChevronLeft, Check, Loader2,
  Briefcase, MapPin, Globe, Phone, FileText,
  Target, Zap, Star, Award
} from "lucide-react";
import toast from "react-hot-toast";

// ─── Types ───────────────────────────────────────────────
interface Page1Data {
  fullName: string;
  phone: string;
  bio: string;
  userType: "freelancer" | "business_owner" | "";
  occupation: string;
  tagline: string;
}

interface Page2Data {
  companyName: string;
  companyType: string;
  industry: string;
  yearsInBusiness: string;
  teamSize: string;
  officeAddress: { street: string; city: string; state: string; pincode: string };
  website: string;
  gstin: string;
}

interface Page3Data {
  monthlyRevenueRange: string;
  avgDealSize: string;
  primaryServices: string[];
  paymentTermsPreference: string;
  currentPriorities: { primary: string; secondary: string };
  goals: { shortTerm: string; midTerm: string; longTerm: string };
  dailyBusinessScale: string;
}

interface Page4Data {
  education: { degree: string; field: string; institution: string; year: string };
  achievements: string[];
  hobbies: string[];
  pastTradeHighlights: string;
  currentTargets: string;
}

// ─── Step Config ─────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Identity", icon: User, color: "from-indigo-500 to-violet-600" },
  { id: 2, label: "Business", icon: Building2, color: "from-blue-500 to-indigo-600" },
  { id: 3, label: "Finance", icon: TrendingUp, color: "from-emerald-500 to-teal-600" },
  { id: 4, label: "Background", icon: GraduationCap, color: "from-amber-500 to-orange-600" },
];

// ─── Input Components ────────────────────────────────────
const Field = ({ label, children, icon: Icon }: { label: string; children: React.ReactNode; icon?: any }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
      {Icon && <Icon size={11} />} {label}
    </label>
    {children}
  </div>
);

const inputCls = "w-full h-12 px-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/5 transition-all";
const selectCls = inputCls + " appearance-none cursor-pointer";
const textareaCls = "w-full px-4 py-3 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/5 transition-all resize-none";

// ─── Page 1: Basic Identity ──────────────────────────────
const Page1 = ({ data, onChange }: { data: Page1Data; onChange: (d: Page1Data) => void }) => {
  const set = (k: keyof Page1Data, v: any) => onChange({ ...data, [k]: v });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Full Name" icon={User}>
          <input className={inputCls} placeholder="Nevin Bali" value={data.fullName} onChange={e => set("fullName", e.target.value)} />
        </Field>
        <Field label="Phone" icon={Phone}>
          <input className={inputCls} placeholder="+91 98765 43210" value={data.phone} onChange={e => set("phone", e.target.value)} />
        </Field>
      </div>

      <Field label="Occupation / Role" icon={Briefcase}>
        <input className={inputCls} placeholder="e.g. Full Stack Developer, UI/UX Designer" value={data.occupation} onChange={e => set("occupation", e.target.value)} />
      </Field>

      <Field label="Your Tagline" icon={Zap}>
        <input className={inputCls} placeholder="e.g. Building products that matter" value={data.tagline} onChange={e => set("tagline", e.target.value)} />
      </Field>

      <Field label="Short Bio" icon={FileText}>
        <textarea className={textareaCls} rows={3} placeholder="Tell us a bit about yourself and what you do..." value={data.bio} onChange={e => set("bio", e.target.value)} maxLength={300} />
        <p className="text-right text-[10px] font-bold text-slate-300">{data.bio.length}/300</p>
      </Field>

      <Field label="I am a..." icon={User}>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: "freelancer", label: "Freelancer", sub: "Independent professional" },
            { value: "business_owner", label: "Business Owner", sub: "Running a company/firm" },
          ].map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => set("userType", opt.value)}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${
                data.userType === opt.value
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-slate-100 bg-slate-50/50 hover:border-slate-200"
              }`}
            >
              <p className={`text-sm font-black ${data.userType === opt.value ? "text-indigo-700" : "text-slate-700"}`}>{opt.label}</p>
              <p className="text-[10px] font-bold text-slate-400 mt-0.5">{opt.sub}</p>
            </button>
          ))}
        </div>
      </Field>
    </div>
  );
};

// ─── Page 2: Business Info ───────────────────────────────
const Page2 = ({ data, onChange }: { data: Page2Data; onChange: (d: Page2Data) => void }) => {
  const set = (k: keyof Page2Data, v: any) => onChange({ ...data, [k]: v });
  const setAddr = (k: string, v: string) => onChange({ ...data, officeAddress: { ...data.officeAddress, [k]: v } });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Company / Firm Name" icon={Building2}>
          <input className={inputCls} placeholder="Acme Technologies" value={data.companyName} onChange={e => set("companyName", e.target.value)} />
        </Field>
        <Field label="Company Type">
          <select className={selectCls} value={data.companyType} onChange={e => set("companyType", e.target.value)}>
            <option value="">Select type</option>
            <option value="sole_proprietor">Sole Proprietor</option>
            <option value="partnership">Partnership</option>
            <option value="pvt_ltd">Private Limited</option>
            <option value="llp">LLP</option>
            <option value="other">Other</option>
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Industry" icon={Briefcase}>
          <input className={inputCls} placeholder="e.g. IT Services, Design, Consulting" value={data.industry} onChange={e => set("industry", e.target.value)} />
        </Field>
        <Field label="Team Size">
          <select className={selectCls} value={data.teamSize} onChange={e => set("teamSize", e.target.value)}>
            <option value="">Select size</option>
            <option value="solo">Just Me (Solo)</option>
            <option value="2-5">2–5 People</option>
            <option value="6-15">6–15 People</option>
            <option value="16-50">16–50 People</option>
            <option value="50+">50+ People</option>
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Years in Business">
          <input className={inputCls} type="number" placeholder="3" value={data.yearsInBusiness} onChange={e => set("yearsInBusiness", e.target.value)} />
        </Field>
        <Field label="GSTIN (Optional)">
          <input className={inputCls} placeholder="22AAAAA0000A1Z5" value={data.gstin} onChange={e => set("gstin", e.target.value)} />
        </Field>
      </div>

      <Field label="Website" icon={Globe}>
        <input className={inputCls} placeholder="https://yoursite.com" value={data.website} onChange={e => set("website", e.target.value)} />
      </Field>

      <div className="space-y-2">
        <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <MapPin size={11} /> Office Address
        </label>
        <input className={inputCls + " mb-2"} placeholder="Street / Area" value={data.officeAddress.street} onChange={e => setAddr("street", e.target.value)} />
        <div className="grid grid-cols-3 gap-2">
          <input className={inputCls} placeholder="City" value={data.officeAddress.city} onChange={e => setAddr("city", e.target.value)} />
          <input className={inputCls} placeholder="State" value={data.officeAddress.state} onChange={e => setAddr("state", e.target.value)} />
          <input className={inputCls} placeholder="Pincode" value={data.officeAddress.pincode} onChange={e => setAddr("pincode", e.target.value)} />
        </div>
      </div>
    </div>
  );
};

// ─── Page 3: Financial Context ───────────────────────────
const Page3 = ({ data, onChange }: { data: Page3Data; onChange: (d: Page3Data) => void }) => {
  const set = (k: keyof Page3Data, v: any) => onChange({ ...data, [k]: v });
  const [serviceInput, setServiceInput] = useState("");

  const addService = () => {
    if (serviceInput.trim() && data.primaryServices.length < 6) {
      set("primaryServices", [...data.primaryServices, serviceInput.trim()]);
      setServiceInput("");
    }
  };

  const removeService = (i: number) => set("primaryServices", data.primaryServices.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Monthly Revenue Range" icon={TrendingUp}>
          <select className={selectCls} value={data.monthlyRevenueRange} onChange={e => set("monthlyRevenueRange", e.target.value)}>
            <option value="">Select range</option>
            <option value="under_50k">Under ₹50K</option>
            <option value="50k_2L">₹50K – ₹2L</option>
            <option value="2L_5L">₹2L – ₹5L</option>
            <option value="5L_10L">₹5L – ₹10L</option>
            <option value="10L_plus">₹10L+</option>
          </select>
        </Field>
        <Field label="Avg Deal / Invoice Size">
          <select className={selectCls} value={data.avgDealSize} onChange={e => set("avgDealSize", e.target.value)}>
            <option value="">Select range</option>
            <option value="under_10k">Under ₹10K</option>
            <option value="10k_50k">₹10K – ₹50K</option>
            <option value="50k_2L">₹50K – ₹2L</option>
            <option value="2L_plus">₹2L+</option>
          </select>
        </Field>
      </div>

      <Field label="Payment Terms Preference">
        <select className={selectCls} value={data.paymentTermsPreference} onChange={e => set("paymentTermsPreference", e.target.value)}>
          <option value="">Select preference</option>
          <option value="immediate">Immediate</option>
          <option value="net_15">Net 15</option>
          <option value="net_30">Net 30</option>
          <option value="net_60">Net 60</option>
          <option value="milestone_based">Milestone Based</option>
        </select>
      </Field>

      <Field label="Primary Services (Max 6)" icon={Zap}>
        <div className="flex gap-2">
          <input className={inputCls} placeholder="e.g. Web Development" value={serviceInput} onChange={e => setServiceInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addService())} />
          <button type="button" onClick={addService} className="h-12 px-5 bg-indigo-600 text-white rounded-2xl text-xs font-black hover:bg-indigo-700 transition-all">Add</button>
        </div>
        {data.primaryServices.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {data.primaryServices.map((s, i) => (
              <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-[11px] font-black">
                {s}
                <button type="button" onClick={() => removeService(i)} className="text-indigo-400 hover:text-red-500">×</button>
              </span>
            ))}
          </div>
        )}
      </Field>

      <div className="space-y-3">
        <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <Target size={11} /> Current Priorities
        </label>
        <input className={inputCls} placeholder="Primary — e.g. Scale revenue to ₹5L/month" value={data.currentPriorities.primary} onChange={e => set("currentPriorities", { ...data.currentPriorities, primary: e.target.value })} />
        <input className={inputCls} placeholder="Secondary — e.g. Build retainer client base" value={data.currentPriorities.secondary} onChange={e => set("currentPriorities", { ...data.currentPriorities, secondary: e.target.value })} />
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <Star size={11} /> Goals
        </label>
        <input className={inputCls} placeholder="Short Term (0–3 months)" value={data.goals.shortTerm} onChange={e => set("goals", { ...data.goals, shortTerm: e.target.value })} />
        <input className={inputCls} placeholder="Mid Term (3–12 months)" value={data.goals.midTerm} onChange={e => set("goals", { ...data.goals, midTerm: e.target.value })} />
        <input className={inputCls} placeholder="Long Term (1 year+)" value={data.goals.longTerm} onChange={e => set("goals", { ...data.goals, longTerm: e.target.value })} />
      </div>

      <Field label="Daily Business Scale" icon={Briefcase}>
        <textarea className={textareaCls} rows={2} placeholder="e.g. 3–4 client calls/day, 2 proposals/week, ₹50K avg weekly billing..." value={data.dailyBusinessScale} onChange={e => set("dailyBusinessScale", e.target.value)} />
      </Field>
    </div>
  );
};

// ─── Page 4: Background ──────────────────────────────────
const Page4 = ({ data, onChange }: { data: Page4Data; onChange: (d: Page4Data) => void }) => {
  const set = (k: keyof Page4Data, v: any) => onChange({ ...data, [k]: v });
  const setEdu = (k: string, v: string) => onChange({ ...data, education: { ...data.education, [k]: v } });
  const [achInput, setAchInput] = useState("");
  const [hobInput, setHobInput] = useState("");

  const addAch = () => { if (achInput.trim()) { set("achievements", [...data.achievements, achInput.trim()]); setAchInput(""); } };
  const addHob = () => { if (hobInput.trim()) { set("hobbies", [...data.hobbies, hobInput.trim()]); setHobInput(""); } };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <GraduationCap size={11} /> Education
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input className={inputCls} placeholder="Degree — e.g. B.Tech" value={data.education.degree} onChange={e => setEdu("degree", e.target.value)} />
          <input className={inputCls} placeholder="Field — e.g. Computer Science" value={data.education.field} onChange={e => setEdu("field", e.target.value)} />
          <input className={inputCls} placeholder="Institution" value={data.education.institution} onChange={e => setEdu("institution", e.target.value)} />
          <input className={inputCls} type="number" placeholder="Year — e.g. 2026" value={data.education.year} onChange={e => setEdu("year", e.target.value)} />
        </div>
      </div>

      <Field label="Key Achievements" icon={Award}>
        <div className="flex gap-2">
          <input className={inputCls} placeholder="e.g. ₹50L+ revenue in 2024" value={achInput} onChange={e => setAchInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addAch())} />
          <button type="button" onClick={addAch} className="h-12 px-5 bg-indigo-600 text-white rounded-2xl text-xs font-black hover:bg-indigo-700 transition-all">Add</button>
        </div>
        {data.achievements.length > 0 && (
          <div className="space-y-2 mt-2">
            {data.achievements.map((a, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-2.5 bg-amber-50 rounded-xl border border-amber-100">
                <span className="text-xs font-bold text-amber-800">{a}</span>
                <button type="button" onClick={() => set("achievements", data.achievements.filter((_, idx) => idx !== i))} className="text-amber-400 hover:text-red-500 text-sm">×</button>
              </div>
            ))}
          </div>
        )}
      </Field>

      <Field label="Hobbies & Interests" icon={Star}>
        <div className="flex gap-2">
          <input className={inputCls} placeholder="e.g. Open Source, Chess, Photography" value={hobInput} onChange={e => setHobInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addHob())} />
          <button type="button" onClick={addHob} className="h-12 px-5 bg-indigo-600 text-white rounded-2xl text-xs font-black hover:bg-indigo-700 transition-all">Add</button>
        </div>
        {data.hobbies.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {data.hobbies.map((h, i) => (
              <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-[11px] font-black">
                {h}
                <button type="button" onClick={() => set("hobbies", data.hobbies.filter((_, idx) => idx !== i))} className="hover:text-red-500">×</button>
              </span>
            ))}
          </div>
        )}
      </Field>

      <Field label="Notable Past Trade / Work Highlights" icon={TrendingUp}>
        <textarea className={textareaCls} rows={3} placeholder="e.g. Closed a ₹12L enterprise deal with XYZ Corp in 2024. Led 3 product launches..." value={data.pastTradeHighlights} onChange={e => set("pastTradeHighlights", e.target.value)} />
      </Field>

      <Field label="Current Targets This Quarter" icon={Target}>
        <textarea className={textareaCls} rows={2} placeholder="e.g. Close 3 enterprise clients, launch new service offering, hit ₹8L MRR..." value={data.currentTargets} onChange={e => set("currentTargets", e.target.value)} />
      </Field>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────
export default function ProfileSetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [direction, setDirection] = useState(1);

  const [page1, setPage1] = useState<Page1Data>({ fullName: "", phone: "", bio: "", userType: "", occupation: "", tagline: "" });
  const [page2, setPage2] = useState<Page2Data>({ companyName: "", companyType: "", industry: "", yearsInBusiness: "", teamSize: "", officeAddress: { street: "", city: "", state: "", pincode: "" }, website: "", gstin: "" });
  const [page3, setPage3] = useState<Page3Data>({ monthlyRevenueRange: "", avgDealSize: "", primaryServices: [], paymentTermsPreference: "", currentPriorities: { primary: "", secondary: "" }, goals: { shortTerm: "", midTerm: "", longTerm: "" }, dailyBusinessScale: "" });
  const [page4, setPage4] = useState<Page4Data>({ education: { degree: "", field: "", institution: "", year: "" }, achievements: [], hobbies: [], pastTradeHighlights: "", currentTargets: "" });

  const validateStep = () => {
    if (step === 1) {
      if (!page1.fullName.trim()) { toast.error("Full name is required!"); return false; }
      if (!page1.userType) { toast.error("Please select your user type!"); return false; }
      if (!page1.occupation.trim()) { toast.error("Occupation is required!"); return false; }
    }
    if (step === 2) {
      if (!page2.companyName.trim()) { toast.error("Company name is required!"); return false; }
      if (!page2.industry.trim()) { toast.error("Industry is required!"); return false; }
    }
    if (step === 3) {
      if (!page3.monthlyRevenueRange) { toast.error("Please select revenue range!"); return false; }
      if (page3.primaryServices.length === 0) { toast.error("Add at least one service!"); return false; }
    }
    return true;
  };

  const saveCurrentPage = async () => {
    const pageData: Record<number, any> = { 1: page1, 2: page2, 3: page3, 4: page4 };
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ pageNumber: step, data: pageData[step] }),
    });
    if (!res.ok) throw new Error("Save failed");
  };

  const handleNext = async () => {
    if (!validateStep()) return;
    setSaving(true);
    try {
      await saveCurrentPage();
      if (step < 4) {
        setDirection(1);
        setStep(s => s + 1);
      } else {
        toast.success("Profile complete! Welcome to Invoicer 🎉");
        router.push("/dashboard");
      }
    } catch {
      toast.error("Failed to save. Try again!");
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    setDirection(-1);
    setStep(s => s - 1);
  };

  const currentStep = STEPS[step - 1];

  return (
    <div className="min-h-screen w-full bg-[#fcfcfd] font-['Archivo'] relative overflow-hidden">

      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-[140px] -mr-72 -mt-72 opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-50 rounded-full blur-[140px] -ml-64 -mb-64 opacity-50 pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-10 md:py-16">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full mb-4">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Profile Setup</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-slate-900 uppercase">
            Build Your <span className="text-indigo-600">Profile.</span>
          </h1>
          <p className="text-slate-400 font-bold text-sm mt-2">This powers your AI engine — takes 3 minutes.</p>
        </motion.div>

        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = s.id === step;
            const isDone = s.id < step;
            return (
              <div key={s.id} className="flex items-center gap-2">
                <motion.div
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-2xl transition-all ${
                    isActive ? "bg-slate-900 text-white shadow-xl" :
                    isDone ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                    "bg-white text-slate-300 border border-slate-100"
                  }`}
                >
                  {isDone ? <Check size={14} strokeWidth={3} /> : <Icon size={14} />}
                  <span className="hidden md:block text-[11px] font-black uppercase tracking-widest">{s.label}</span>
                </motion.div>
                {i < STEPS.length - 1 && (
                  <div className={`w-6 h-0.5 rounded-full ${isDone ? "bg-emerald-200" : "bg-slate-100"}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-100 rounded-full mb-8 overflow-hidden">
          <motion.div
            className="h-full bg-indigo-600 rounded-full"
            animate={{ width: `${(step / 4) * 100}%` }}
            transition={{ type: "spring", stiffness: 200 }}
          />
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden">

          {/* Card Header */}
          <div className="p-6 md:p-8 border-b border-slate-50 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${currentStep.color} flex items-center justify-center text-white shadow-lg`}>
              <currentStep.icon size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Step {step} of 4</p>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {step === 1 && "Who are you?"}
                {step === 2 && "Your Business"}
                {step === 3 && "Financial Context"}
                {step === 4 && "Background & Goals"}
              </h2>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6 md:p-8">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -40 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {step === 1 && <Page1 data={page1} onChange={setPage1} />}
                {step === 2 && <Page2 data={page2} onChange={setPage2} />}
                {step === 3 && <Page3 data={page3} onChange={setPage3} />}
                {step === 4 && <Page4 data={page4} onChange={setPage4} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Card Footer */}
          <div className="px-6 md:px-8 pb-6 md:pb-8 flex gap-3">
            {step > 1 && (
              <button
                onClick={handleBack}
                disabled={saving}
                className="flex items-center gap-2 h-14 px-6 rounded-2xl border-2 border-slate-100 text-slate-500 font-black text-xs uppercase tracking-widest hover:border-slate-200 hover:text-slate-700 transition-all disabled:opacity-50"
              >
                <ChevronLeft size={16} /> Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 h-14 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-slate-200 transition-all duration-300 active:scale-[0.98] disabled:opacity-70"
            >
              {saving ? (
                <><Loader2 size={18} className="animate-spin" /> Saving...</>
              ) : step === 4 ? (
                <><Check size={18} /> Complete Profile</>
              ) : (
                <>Continue <ChevronRight size={16} /></>
              )}
            </button>
          </div>
        </div>

        {/* Skip Note */}
        <p className="text-center text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mt-6">
          You can update this anytime from Settings
        </p>
      </div>
    </div>
  );
}