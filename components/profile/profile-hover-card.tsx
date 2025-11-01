"use client";

import { TbCopy } from "react-icons/tb";
import { useState } from "react";

interface PropTypes {
  infoName: string;
  val: string;
}

export default function ProfileHoverCardDemo({ infoName, val }: PropTypes) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(val).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500); // Reset after 1.5 seconds
    });
  };

  return (
    <div className="flex justify-start items-center cursor-default">
      <p>{infoName}</p>
      <p className="text-[17px] ml-1" title={val}>
        {val}
      </p>
      <TbCopy
        className="ml-1 cursor-pointer hover:text-blue-500"
        onClick={handleCopy}
        title={copied ? "Copied!" : "Copy to clipboard"}
      />
    </div>
  );
}
