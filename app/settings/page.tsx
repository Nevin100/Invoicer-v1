"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LuLogOut } from "react-icons/lu";
import { ImSpinner2 } from "react-icons/im";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "@/lib/redux/Features/authSlice";

const Settings = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      dispatch(logout());
      router.push("/login");
    }, 1500);
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen w-full bg-gradient-to-b from-gray-50 to-gray-200 py-10 px-4 rounded-md">
      {/* Prototype Info Section */}
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-lg p-8 text-center mb-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
          Invoicer Version 1
        </h1>
        <p className="text-gray-600 text-base md:text-lg leading-relaxed">
  This project is in an advanced stage of development, with most core
  functionalities already implemented. The remaining features are{" "}
  <span className="text-blue-600 font-medium">
    actively being developed and refined
  </span>{" "}
  for future updates.
</p>

      </div>

      {/* Logout Section */}
      <div className="flex flex-col items-center justify-center w-full max-w-3xl bg-white rounded-2xl shadow-md p-8 relative">
        <h2 className="text-xl font-semibold text-gray-700 mb-6">
          User Settings
        </h2>

        <Button
          variant="outline"
          className="flex items-center justify-center gap-3 px-8 py-4 w-full text-lg font-medium text-gray-700 hover:text-white hover:bg-red-600 transition-all duration-300 rounded-xl"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <>
              <ImSpinner2 className="w-5 h-5 animate-spin text-purple-600" />
              Logging out...
            </>
          ) : (
            <>
              <LuLogOut className="w-5 h-5" />
              Logout
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Settings;
