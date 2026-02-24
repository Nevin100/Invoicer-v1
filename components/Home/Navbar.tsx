"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiArrowRight, FiMenu, FiX } from "react-icons/fi";
import Image from "next/image";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
            
              <Image src={"/favicon.ico"} alt="Logo" width={34} height={34} className="block" />
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
            className="md:hidden text-slate-700"
          >
            {open ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Overlay */}
        <div
          onClick={() => setOpen(false)}
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        />

        {/* Drawer Panel */}
        <div
          className={`absolute top-0 right-0 w-72 h-full bg-white shadow-2xl p-8 flex flex-col gap-8 transform transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <Link href="/" onClick={() => setOpen(false)} className="font-bold text-xl">
            Invoicer
          </Link>


          <Link href="/login" onClick={() => setOpen(false)}>
            <button className="mt-auto bg-indigo-600 text-white py-3 rounded-xl font-semibold">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}