"use client";

import React, { useState, useEffect } from "react";

const Loading = ({ delay = 3000 }) => {
  const [loading, setLoading] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("hasLoaded") ? false : true;
    }
    return true; // Default to true during SSR
  });

  useEffect(() => {
    if (!loading || typeof window === "undefined") return;

    const timer = setTimeout(() => {
      setLoading(false);
      localStorage.setItem("hasLoaded", "true");
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, loading]);

  if (!loading) return null;

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="relative w-16 h-16 flex justify-center items-center">
        <div className="absolute w-full h-full border-4 border-gray-300 border-t-[#6F38C9] rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default Loading;
