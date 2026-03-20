"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";

interface CreditContextType {
  credits: number;
  plan: string;
  deductOptimistic: (cost: number, label?: string) => void;
  rollback: (cost: number) => void;
  refresh: () => Promise<void>;
  setCredits: (n: number) => void;
}

const CreditContext = createContext<CreditContextType | null>(null);

export function CreditProvider({ children }: { children: React.ReactNode }) {
  const [credits, setCredits] = useState<number>(0);
  const [plan, setPlan] = useState<string>("free");

  const refresh = useCallback(async () => {
    const res = await fetch("/api/credits");
    const data = await res.json();
    setCredits(data.credits);
    setPlan(data.plan);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const deductOptimistic = useCallback((cost: number, label = "Action") => {
    setCredits((prev) => Math.max(0, prev - cost));

    toast.success(`${label} complete · ${cost} credits used`, {
      icon: "⚡",
      style: {
        background: "#111",
        color: "#fff",
        border: "1px solid rgba(255,255,255,0.08)",
        fontSize: "13px",
      },
    });
  }, []);

  const rollback = useCallback((cost: number) => {
    setCredits((prev) => prev + cost);
    toast.error("Action failed · Credits restored", {
      style: { background: "#111", color: "#fff" },
    });
  }, []);

  return (
    <CreditContext.Provider value={{ credits, plan, deductOptimistic, rollback, refresh, setCredits }}>
      {children}
    </CreditContext.Provider>
  );
}

export const useCredits = () => {
  const ctx = useContext(CreditContext);
  if (!ctx) throw new Error("useCredits must be inside CreditProvider");
  return ctx;
};