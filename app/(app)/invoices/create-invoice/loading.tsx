"use client"

import React, { useState, useEffect } from "react";

const Loading = ({ delay = 3000 }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (!loading) return null; // Loader remove after delay

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="relative w-16 h-16 flex justify-center items-center">
        {/* Spinning Ring */}
        <div className="absolute w-full h-full border-4 border-gray-300 border-t-[#6F38C9] rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default Loading;
