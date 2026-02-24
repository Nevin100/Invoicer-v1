"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  ReceiptText, 
  WalletCards, 
  Users2, 
  Settings,
  ActivityIcon,
  UserIcon
} from "lucide-react"; 
import { motion } from "framer-motion";

interface SidebarProps {
  onLinkClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLinkClick }) => {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
    { name: "Invoices", icon: <ReceiptText size={20} />, path: "/invoices" },
    { name: "Expenses", icon: <WalletCards size={20} />, path: "/expenses" },
    { name: "AI Evaluation", icon: <ActivityIcon size={20} />, path: "/ai-eval" },
    { name: "Clients", icon: <Users2 size={20} />, path: "/clients" },
    { name: "Settings", icon: <Settings size={20} />, path: "/settings" },
    { name: "Profile", icon: <UserIcon size={20} />, path: "/profile" },
  ];

  const handleLinkClick = (clickedPath: string) => {
    if (pathname === clickedPath) return;
    window.dispatchEvent(new Event("topbar-start"));
    if (onLinkClick && window.innerWidth < 768) {
      onLinkClick();
    }
    router.push(clickedPath);
  };

  return (
    <div className="h-full w-[260px] bg-white border-r border-slate-100 py-8 px-4 font-['Archivo',sans-serif] flex flex-col justify-between relative shadow-[10px_0_30px_rgba(0,0,0,0.02)]">
      
      <div>
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-4 mb-12">
          <div className="relative w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
             <Image src="/favicon.ico" alt="Logo" width={24} height={24} />
          </div>
          <span className="text-2xl font-black tracking-tighter text-indigo-900">
            Invoicer
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.path;
            
            return (
              <div
                key={index}
                onClick={() => handleLinkClick(item.path)}
                className={`group relative cursor-pointer px-4 h-[54px] flex items-center transition-all duration-300 rounded-2xl
                  ${isActive 
                    ? "bg-indigo-50/50 text-indigo-600" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
              >
                {/* Active Pill Indicator */}
                {isActive && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute left-0 w-1 h-6 bg-indigo-600 rounded-r-full"
                  />
                )}

                <div className="flex items-center space-x-4 w-full">
                  <span className={`transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                    {item.icon}
                  </span>
                  <span className={`text-sm font-black uppercase tracking-widest transition-colors
                    ${isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`}>
                    {item.name}
                  </span>
                </div>

                {/* Subtle Hover Glow */}
                {!isActive && (
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-indigo-50/20 to-transparent rounded-2xl -z-10" />
                )}
              </div>
            );
          })}
        </nav>
      </div>

    </div>
  );
};

export default Sidebar;