/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, Plus, UserCircle, ChevronDown, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [username, setUsername] = useState("Guest");
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setUsername(data.user.username || "User");
      } else {
        setUsername("Guest");
      }
    } catch {
      setUsername("Guest");
    } finally {
      setLoadingUser(false);
    }
  };

  fetchUser();
}, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-3">
      <div className="flex items-center justify-between max-w-[1600px] mx-auto">
        
        {/* Left Side: Brand/User Info */}
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar} 
            className="md:hidden p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors"
          >
            <Menu size={24} />
          </button>
          
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">Welcome back</span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {username}<span className="text-indigo-600">.</span>
            </h2>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-3 sm:gap-6" ref={dropdownRef}>

          {/* Create New Dropdown */}
          <div className="relative">
            <Button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl px-5 h-11 font-black text-xs uppercase tracking-widest shadow-lg shadow-slate-200 transition-all active:scale-95 flex items-center gap-2"
            >
              <Plus size={18} strokeWidth={3} />
              <span className="hidden sm:inline">Quick Action</span>
              <ChevronDown size={14} className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </Button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] py-2 z-50 overflow-hidden"
                >
                  <div className="px-4 py-2 mb-1 border-b border-slate-50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Create New</p>
                  </div>
                  
                  <DropdownLink 
                    href="/invoices/create-invoice" 
                    label="New Invoice" 
                    color="text-indigo-600"
                    onClick={() => setDropdownOpen(false)} 
                  />
                  <DropdownLink 
                    href="/clients/create-client" 
                    label="Onboard Client" 
                    color="text-emerald-600"
                    onClick={() => setDropdownOpen(false)} 
                  />
                  <DropdownLink 
                    href="/expenses/create-expense" 
                    label="Log Expense" 
                    color="text-rose-600"
                    onClick={() => setDropdownOpen(false)} 
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Avatar Placeholder */}
          <div className="h-10 w-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
            <UserCircle size={24} />
          </div>
        </div>
      </div>
    </nav>
  );
};

// Sub-component for cleaner dropdown links
const DropdownLink = ({ href, label, color, onClick }: any) => (
  <Link
    href={href}
    onClick={onClick}
    className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
  >
    <PlusCircle size={16} className={color} />
    {label}
  </Link>
);

export default Navbar;