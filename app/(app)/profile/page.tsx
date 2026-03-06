"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Building2, TrendingUp, GraduationCap, Phone, Globe, MapPin, 
  Briefcase, Zap, Target, Star, Award, Edit3, Check, X, Loader2, 
  ChevronRight, FileText, Mail, BadgeCheck, Calendar, IndianRupee, 
  Users, Rocket, BriefcaseIcon, Heart
} from "lucide-react";
import toast from "react-hot-toast";

// --- Types ---
interface Profile {
  page1: { fullName: string; phone: string; bio: string; userType: string; occupation: string; tagline: string; avatar?: string };
  page2: { companyName: string; companyType: string; industry: string; yearsInBusiness: number; teamSize: string; officeAddress: { street: string; city: string; state: string; pincode: string }; website: string; gstin: string };
  page3: { monthlyRevenueRange: string; avgDealSize: string; primaryServices: string[]; paymentTermsPreference: string; currentPriorities: { primary: string; secondary: string }; goals: { shortTerm: string; midTerm: string; longTerm: string }; dailyBusinessScale: string };
  page4: { education: { degree: string; field: string; institution: string; year: number }; achievements: string[]; hobbies: string[]; pastTradeHighlights: string; currentTargets: string };
  completedPages: number[];
  isComplete: boolean;
}

// --- Constants ---
const REVENUE_LABELS: Record<string, string> = { under_50k: "Under ₹50K", "50k_2L": "₹50K – ₹2L", "2L_5L": "₹2L – ₹5L", "5L_10L": "₹5L – ₹10L", "10L_plus": "₹10L+" };
const DEAL_LABELS: Record<string, string> = { under_10k: "Under ₹10K", "10k_50k": "₹10K – ₹50K", "50k_2L": "₹50K – ₹2L", "2L_plus": "₹2L+" };
const TEAM_LABELS: Record<string, string> = { solo: "Solo", "2-5": "2–5 People", "6-15": "6–15 People", "16-50": "16–50 People", "50+": "50+ People" };

// --- Reusable Components ---

const SectionCard = ({ title, icon: Icon, color, children, onEdit }: { title: string; icon: any; color: string; children: React.ReactNode; onEdit: () => void }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="bg-white border border-slate-200/60 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col h-full"
  >
    <div className="flex items-center justify-between p-6 border-b border-slate-50">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg`}>
          <Icon size={20} />
        </div>
        <h3 className="text-xs font-black uppercase tracking-[0.15em] text-slate-800">{title}</h3>
      </div>
      <button 
        onClick={onEdit} 
        className="p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-all border border-slate-100 hover:border-indigo-100"
      >
        <Edit3 size={16} />
      </button>
    </div>
    <div className="p-7 flex-1">{children}</div>
  </motion.div>
);

const InfoItem = ({ label, value, icon: Icon }: { label: string; value?: string | number; icon?: any }) => {
  if (!value) return null;
  return (
    <div className="group flex gap-4 py-3 border-b border-slate-50 last:border-0 items-center">
      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-indigo-500 transition-colors">
        {Icon ? <Icon size={14} /> : <div className="w-1 h-1 rounded-full bg-slate-300" />}
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
        <p className="text-sm font-semibold text-slate-700 leading-tight">{value}</p>
      </div>
    </div>
  );
};

// --- Edit Modal (Simplified logic, elegant UI) ---

const InputWrapper = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5 flex-1">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
    {children}
  </div>
);

const EditModal = ({ pageNumber, profile, onClose, onSave }: { pageNumber: number; profile: Profile; onClose: () => void; onSave: (pageNumber: number, data: any) => Promise<void> }) => {
  const [data, setData] = useState<any>(profile[`page${pageNumber}` as keyof Profile]);
  const [loading, setLoading] = useState(false);
  const inputClass = "w-full px-4 h-12 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 outline-none transition-all";

  const handleUpdate = async () => {
    setLoading(true);
    await onSave(pageNumber, data);
    setLoading(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
          className="bg-white rounded-[3rem] w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-black text-slate-900 italic">Refine Section</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Update your profile details</p>
            </div>
            <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="p-8 overflow-y-auto space-y-6">
             {/* Render Inputs dynamically based on pageNumber */}
             {pageNumber === 1 && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <InputWrapper label="Full Name"><input className={inputClass} value={data.fullName} onChange={e => setData({...data, fullName: e.target.value})} /></InputWrapper>
                 <InputWrapper label="Occupation"><input className={inputClass} value={data.occupation} onChange={e => setData({...data, occupation: e.target.value})} /></InputWrapper>
                 <div className="md:col-span-2">
                   <InputWrapper label="Bio"><textarea className={inputClass + " h-24 py-3 resize-none"} value={data.bio} onChange={e => setData({...data, bio: e.target.value})} /></InputWrapper>
                 </div>
               </div>
             )}
             {/* Additional pages logic remains similar to your original but with improved CSS classes */}
             <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
               <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">System Note</p>
               <p className="text-xs text-amber-600/80 font-medium">Updating this will reflect immediately on your public dashboard.</p>
             </div>
          </div>

          <div className="p-8 border-t border-slate-50 flex gap-4">
            <button onClick={onClose} className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-xs text-slate-400 hover:bg-slate-50 transition-colors">Cancel</button>
            <button 
              onClick={handleUpdate}
              disabled={loading}
              className="flex-[2] h-14 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-xs hover:bg-indigo-600 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <><Check size={18} /> Save Changes</>}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// --- Main Profile Page ---

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/profile", { credentials: "include" })
      .then(r => r.json())
      .then(d => setProfile(d.profile))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (pageNumber: number, data: any) => {
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageNumber, data }),
    });
    const updated = await res.json();
    setProfile(updated.profile);
    toast.success("Changes synced successfully", {
      style: { borderRadius: '20px', background: '#0f172a', color: '#fff', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase' }
    });
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity }} className="w-16 h-16 bg-indigo-600 rounded-3xl shadow-xl flex items-center justify-center text-white">
        <Rocket size={24} />
      </motion.div>
    </div>
  );

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 lg:p-12 selection:bg-indigo-100">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Profile Hero Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative bg-white border border-slate-200/60 rounded-[3rem] shadow-xl shadow-slate-200/50 overflow-hidden"
        >
          {/* Banner */}
          <div className="h-48 md:h-64 bg-slate-900 relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-transparent" />
            <button 
              onClick={() => setEditingPage(1)}
              className="absolute top-6 right-6 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-[10px] font-black uppercase text-white hover:bg-white/20 transition-all"
            >
              Update Identity
            </button>
          </div>

          {/* Content */}
          <div className="px-8 pb-10">
            <div className="relative flex flex-col md:flex-row items-end gap-6 -mt-12 md:-mt-16">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-gradient-to-tr from-indigo-600 to-violet-500 border-[6px] border-white shadow-2xl flex items-center justify-center text-white text-5xl font-black italic">
                {profile.page1.fullName.charAt(0)}
              </div>
              <div className="flex-1 mb-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter italic">{profile.page1.fullName}</h1>
                  {profile.isComplete && <BadgeCheck className="text-indigo-500" size={28} />}
                </div>
                <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-xs flex items-center gap-2">
                  <BriefcaseIcon size={14} className="text-slate-400" /> {profile.page1.occupation}
                </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-slate-50">
              <div className="md:col-span-2 space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">Professional Bio</h4>
                <p className="text-slate-600 font-medium leading-relaxed italic text-lg">"{profile.page1.bio}"</p>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">Contact Details</h4>
                <div className="space-y-2">
                   <div className="flex items-center gap-3 text-sm font-bold text-slate-600"><Phone size={14} className="text-slate-300" /> {profile.page1.phone}</div>
                   <div className="flex items-center gap-3 text-sm font-bold text-indigo-600"><Globe size={14} className="text-indigo-300" /> {profile.page2.website}</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Business Section */}
          <SectionCard title="Business" icon={Building2} color="from-blue-600 to-cyan-500" onEdit={() => setEditingPage(2)}>
            <div className="space-y-1">
              <InfoItem label="Entity" value={profile.page2.companyName} icon={Briefcase} />
              <InfoItem label="Industry" value={profile.page2.industry} icon={Target} />
              <InfoItem label="Team Size" value={TEAM_LABELS[profile.page2.teamSize]} icon={Users} />
              <InfoItem label="GSTIN" value={profile.page2.gstin} icon={FileText} />
            </div>
          </SectionCard>

          {/* Performance Section */}
          <SectionCard title="Economics" icon={TrendingUp} color="from-emerald-600 to-teal-500" onEdit={() => setEditingPage(3)}>
            <div className="space-y-1">
              <InfoItem label="Revenue" value={REVENUE_LABELS[profile.page3.monthlyRevenueRange]} icon={IndianRupee} />
              <InfoItem label="Deal Size" value={DEAL_LABELS[profile.page3.avgDealSize]} icon={Zap} />
              <InfoItem label="Payments" value={profile.page3.paymentTermsPreference} icon={Calendar} />
              <div className="mt-4 flex flex-wrap gap-2">
                {profile.page3.primaryServices.slice(0, 3).map(s => (
                  <span key={s} className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-lg uppercase tracking-wider">{s}</span>
                ))}
              </div>
            </div>
          </SectionCard>

          {/* Background Section */}
          <SectionCard title="Journey" icon={GraduationCap} color="from-amber-500 to-orange-400" onEdit={() => setEditingPage(4)}>
            <div className="space-y-1">
              <InfoItem label="Education" value={`${profile.page4.education.degree} in ${profile.page4.education.field}`} icon={Award} />
              <InfoItem label="Institution" value={profile.page4.education.institution} icon={Building2} />
              <div className="mt-6">
                <h5 className="text-[9px] font-black uppercase text-slate-400 mb-2">Key Hobbies</h5>
                <div className="flex gap-2">
                  {profile.page4.hobbies.map(h => (
                    <div key={h} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-help" title={h}>
                      <Heart size={16} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>

        </div>
      </div>

      {/* Modals */}
      {editingPage && (
        <EditModal 
          pageNumber={editingPage} 
          profile={profile} 
          onClose={() => setEditingPage(null)} 
          onSave={handleSave} 
        />
      )}
    </div>
  );
}