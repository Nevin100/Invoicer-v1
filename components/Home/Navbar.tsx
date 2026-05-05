"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiArrowRight, FiMenu, FiX } from "react-icons/fi";
import Image from "next/image";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-lg border-b border-slate-200/60"
            : "bg-white/40 backdrop-blur-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex justify-between items-center">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image src="/favicon.ico" alt="Logo" width={34} height={34} className="block" />
            <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              Invoicer
            </h1>
          </Link>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Link href="/login">
              <button className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-medium hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-300 flex items-center gap-2 group cursor-pointer">
                Get Started
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-700 active:scale-95 transition-transform"
          >
            {open ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Sheet */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        {/* Overlay */}
        <div
          onClick={() => setOpen(false)}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Bottom Sheet Panel */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-[2rem] shadow-2xl px-8 pt-6 pb-10 flex flex-col gap-6 transform transition-transform duration-300 ease-out ${
            open ? "translate-y-0" : "translate-y-full"
          }`}
        >
          {/* Handle */}
          <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto" />

          {/* Brand */}
          <div className="flex items-center gap-2">
            <Image src="/favicon.ico" alt="Logo" width={28} height={28} />
            <span className="font-black text-lg bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              Invoicer
            </span>
          </div>

          {/* Nav Links */}
          <div className="flex flex-col gap-1">
            {[
              { label: "Features", href: "/#features" },
              { label: "Pricing", href: "/#pricing" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-xl text-slate-700 font-semibold hover:bg-slate-50 active:bg-slate-100 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <Link href="/login" onClick={() => setOpen(false)}>
            <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 group active:scale-95 transition-transform cursor-pointer">
              Get Started
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}