"use client"

import type React from "react"
import { useState } from "react"
import Sidebar from "@/components/Sidebar"
import Navbar from "@/components/Navbar"

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen">
      <div className="w-[250px] hidden md:block">
        <Sidebar />
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden z-40"
          onClick={() => setIsSidebarOpen(false)} 
        ></div>
      )}

      <div
        className={`fixed top-0 left-0 h-full w-[250px] bg-white border-r border-gray-200 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform md:hidden z-50 shadow-lg`}
      >
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="bg-gray-100 flex-1 flex flex-col md:mt-2">
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <div
          className="flex-1 overflow-y-auto p-4 md:mt-2"
          onClick={() => isSidebarOpen && setIsSidebarOpen(false)}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout
