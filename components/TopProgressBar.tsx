"use client";

import { useEffect, useState } from "react";

const TopProgressBar = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsVisible(true);
    const handleStop = () => setTimeout(() => setIsVisible(false), 500);

    window.addEventListener("topbar-start", handleStart);
    window.addEventListener("topbar-stop", handleStop);

    return () => {
      window.removeEventListener("topbar-start", handleStart);
      window.removeEventListener("topbar-stop", handleStop);
    };
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 w-full h-[8px] bg-blue-600 z-[99999] transition-all duration-300 ${
        isVisible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
      } origin-left`}
    />
  );
};

export default TopProgressBar;
