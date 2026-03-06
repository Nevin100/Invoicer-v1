/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/lib/redux/store"
import { setClientField, resetClient } from "@/lib/redux/Features/clientSlice"
import { useState } from "react"
import { Globe, Mail, MapPin, Phone, User, Loader2, Building2, CreditCard, X, ChevronDown } from "lucide-react"
import Swal from "sweetalert2";
import Link from "next/link";
import { motion } from "framer-motion";
import CreditOverlay from "@/components/CreditOverlay"; 

export default function NewClientForm() {
  const dispatch = useDispatch()
  const client = useSelector((state: RootState) => state.client)
  const [loading, setLoading] = useState(false)
  const [country, setCountry] = useState(client.country)
  const [showCreditOverlay, setShowCreditOverlay] = useState(false);
  const [creditRemaining, setCreditRemaining] = useState(0);

  const handleChange = (field: string, value: string | number) => {
    dispatch(setClientField({ field: field as keyof typeof client, value }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(client),
      })

      const data = await res.json()

      if (res.status === 402) {
        setCreditRemaining(data.remaining);
        setShowCreditOverlay(true);
        return;
      }

      if (!res.ok) {
        Swal.fire({ title: "Error", text: data.message || "Something went wrong.", icon: "error", confirmButtonColor: "#4f46e5" })
        return
      }

      dispatch(resetClient())
      Swal.fire({ title: "Success", text: "Client onboarded successfully!", icon: "success", confirmButtonColor: "#4f46e5" })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center bg-[#fcfbf7] min-h-screen p-4 sm:p-8 relative overflow-hidden">

      <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-indigo-200/40 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-purple-200/40 rounded-full blur-[100px]" />

      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-7xl z-10">
        <Card className="border border-slate-200 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] bg-white/90 backdrop-blur-md rounded-[3rem] overflow-hidden">

          <div className="p-10 md:p-14 border-b border-slate-100 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="h-3 w-3 rounded-full bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
                <span className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">System / New Client</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
                Client <span className="text-indigo-600 italic underline decoration-indigo-200 underline-offset-8">Onboarding.</span>
              </h2>
            </div>
            <Link href="/clients">
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: "#fee2e2", color: "#ef4444" }}
                className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 transition-all cursor-pointer border border-slate-200 shadow-sm"
              >
                <X size={24} strokeWidth={3} />
              </motion.button>
            </Link>
          </div>

          <CardContent className="p-10 md:p-14">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-12">

              <FormField id="client-name" label="Primary Contact Person" icon={<User size={20} className="text-indigo-600" />} value={client.clientName} onChange={(e: any) => handleChange("clientName", e.target.value)} />
              <FormField id="company-name" label="Full Legal Entity Name" icon={<Building2 size={20} className="text-purple-600" />} value={client.companyName} onChange={(e: any) => handleChange("companyName", e.target.value)} />
              <FormField id="email" label="Professional Email Address" icon={<Mail size={20} className="text-indigo-600" />} value={client.email} onChange={(e: any) => handleChange("email", e.target.value)} />
              <FormField id="mobile" label="Direct Contact Number" icon={<Phone size={20} className="text-purple-600" />} value={client.mobile} onChange={(e: any) => handleChange("mobile", e.target.value)} />

              <div className="sm:col-span-2">
                <FormField id="address" label="Registered Office Address" icon={<MapPin size={20} className="text-indigo-600" />} value={client.address} onChange={(e: any) => handleChange("address", e.target.value)} />
              </div>

              <FormField id="postal" label="Zip / Postal Code" value={client.postal} onChange={(e: any) => handleChange("postal", e.target.value)} />
              <FormField id="state" label="State / Province" value={client.state} onChange={(e: any) => handleChange("state", e.target.value)} />

              <div className="space-y-4">
                <Label htmlFor="country" className="text-xs font-black uppercase tracking-widest text-slate-600 ml-1">Market Region</Label>
                <div className="relative group">
                  <select
                    id="country"
                    value={country}
                    onChange={(e) => { setCountry(e.target.value); handleChange("country", e.target.value) }}
                    className="w-full bg-[#fdfdfb] border-2 border-slate-200 rounded-[1.25rem] p-5 text-slate-800 font-bold text-lg focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all appearance-none outline-none shadow-sm group-hover:border-slate-300"
                  >
                    <option value="USA">🇺🇸 United States</option>
                    <option value="India">🇮🇳 India</option>
                    <option value="UK">🇬🇧 United Kingdom</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-indigo-600 transition-colors">
                    <ChevronDown size={22} strokeWidth={3} />
                  </div>
                </div>
              </div>

              <FormField id="service-charge" label="Service Rate (₹)" type="number" icon={<CreditCard size={20} className="text-emerald-600" />} value={client.serviceCharge} onChange={(e: any) => handleChange("serviceCharge", Number(e.target.value))} />

              <div className="sm:col-span-2">
                <FormField id="website" label="Digital Presence / Website" icon={<Globe size={20} className="text-indigo-600" />} value={client.website} onChange={(e: any) => handleChange("website", e.target.value)} />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end items-center gap-10 mt-20 pt-10 border-t-2 border-slate-50">
              <button type="button" className="text-slate-500 font-black text-sm uppercase tracking-widest hover:text-slate-900 transition-colors cursor-pointer" onClick={() => dispatch(resetClient())}>
                Clear All Fields
              </button>
              <Button className="bg-slate-900 hover:bg-indigo-600 text-white px-14 h-16 rounded-[1.25rem] font-black text-base uppercase tracking-widest shadow-2xl shadow-slate-200 transition-all active:scale-95 disabled:opacity-50 cursor-pointer group" disabled={loading} onClick={handleSubmit}>
                {loading ? <Loader2 className="animate-spin" size={24} /> : <span className="flex items-center gap-3">Deploy Profile</span>}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {showCreditOverlay && (
        <CreditOverlay
          action="add a client"
          remaining={creditRemaining}
          onClose={() => setShowCreditOverlay(false)}
        />
      )}
    </div>
  )
}

function FormField({ id, label, icon, value, onChange, type = "text" }: any) {
  return (
    <div className="space-y-4 group">
      <Label htmlFor={id} className="text-xs font-black uppercase tracking-widest text-slate-600 ml-1 group-focus-within:text-indigo-600 transition-colors">{label}</Label>
      <div className="flex items-center gap-4 bg-[#fdfdfb] border-2 border-slate-200 group-focus-within:border-indigo-600 group-focus-within:ring-4 group-focus-within:ring-indigo-50/50 group-focus-within:bg-white rounded-[1.25rem] px-6 py-1 transition-all shadow-sm group-hover:border-slate-300">
        <span className="opacity-70 group-focus-within:opacity-100 transition-all scale-110">{icon}</span>
        <Input id={id} type={type} placeholder={`Enter ${label.split(' ').pop()?.toLowerCase()}...`} className="border-none bg-transparent shadow-none focus-visible:ring-0 p-0 h-14 text-slate-900 font-bold text-lg placeholder:text-slate-300 placeholder:font-semibold" value={value} onChange={onChange} />
      </div>
    </div>
  )
}