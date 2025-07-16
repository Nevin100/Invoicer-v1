// Sidebar.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  FaFileInvoiceDollar,
  FaMoneyCheckAlt,
  FaChartBar,
  FaFileAlt,
  FaCog,
  FaUsers,
} from "react-icons/fa";

interface SidebarProps {
  onLinkClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLinkClick }) => {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: "Dashboard", icon: <FaChartBar />, path: "/" },
    { name: "Invoices", icon: <FaFileInvoiceDollar />, path: "/invoices" },
    { name: "Payments", icon: <FaMoneyCheckAlt />, path: "/payments" },
    { name: "Expenses", icon: <FaFileAlt />, path: "/expenses" },
    { name: "Clients", icon: <FaUsers />, path: "/clients" },
    { name: "Settings", icon: <FaCog />, path: "/settings" },
  ];

  const handleLinkClick = (clickedPath: string) => {
    if (pathname === clickedPath) return; // avoid re-routing if already on same path

    // Optional: Notify topbar or handle sidebar behavior
    window.dispatchEvent(new Event("topbar-start"));
    if (onLinkClick && window.innerWidth < 768) {
      onLinkClick();
    }

    router.push(clickedPath);
  };

  return (
    <div className=" h-full w-[250px] bg-white shadow-md py-5  font-['Archivo',sans-serif] flex flex-col justify-between relative">
      <div>
        <h2 className=" text-xl font-bold text-gray-800 ml-5 mb-8">
          Instant Paid
        </h2>
        <nav className=" flex flex-col ">
          {menuItems.map((item, index) => (
            <div
              key={index}
              onClick={() => handleLinkClick(item.path)}
              className={` cursor-pointer pl-5 flex justify-between text-gray-700 h-[50px]
                ${pathname === item.path ? "bg-[#7a9dfe2c]" : "hover:bg-gray-50"}`}
            >
              <div className="flex items-center space-x-4">
                <span className="text-xl">{item.icon}</span>
                <span className="text-base font-medium">{item.name}</span>
              </div>

              <div
                className={`w-[3px]  ${pathname === item.path ? "bg-[#5E84EC]" : ""} `}
              >
                {/* To show the current tab */}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
