"use client";

import { useState, useRef, useEffect } from "react";
import { FiMenu } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { FaCirclePlus } from "react-icons/fa6";
import Link from "next/link";

const getUsernameFromToken = () => {
  if (typeof window === "undefined") return "Guest";

  const token = localStorage.getItem("token");
  if (!token) return "Guest";

  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    return payload.username || "Guest";
  } catch (error) {
    return "Guest";
    console.log(error);
  }
};

const Navbar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [username, setUsername] = useState("Guest");

  useEffect(() => {
    setUsername(getUsernameFromToken());
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
    <div className="flex items-center justify-between bg-white px-6 py-2 shadow-md">
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar} className="md:hidden text-gray-700">
          <FiMenu size={24} />
        </button>
        <div>
          <p className="text-sm font-semibold text-gray-500">Hey 😊😊,</p>
          <h2 className="text-lg font-bold text-gray-800">{username}</h2>
        </div>
      </div>

      <div className="flex items-center space-x-6 relative" ref={dropdownRef}>
      
        <div className="relative">
          <Button
            variant="outline"
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <FaCirclePlus />
          </Button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-md z-50">
              <Link
                href="/clients/create-client"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                Create Client
              </Link>
              <Link
                href="/expenses/create-expense"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                Create Expense
              </Link>
              <Link
                href="/invoices/create-invoice"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                Create Invoice
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
