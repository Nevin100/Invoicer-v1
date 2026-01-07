/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import FinMetricCard from "./FinMetricCard";
import axios from "axios";

export const Divider = () => {
  return <div className="border-2 border-blue-300 my-3" />;
};

interface Stats{
  totalAmount: number,
  totalExpenses:number,
  topCategory: string
}

const FinancialMetrics = () => {
  const [view, setView] = useState("Monthly");
  const [stats,setStats] = useState<Stats>({
    totalAmount: 0,
    totalExpenses: 0,
    topCategory: "NA"
  });
  
  useEffect(() =>{
    const fetchExpenses = async () =>{
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get<any>("/api/expenses",{
      headers : {
        Authorization : `Bearer ${token}`,
      }
    })

    console.log("Dashboard Expenses : ",res.data.stats)
    setStats(res.data.stats);    
  } catch (error : any) {
    console.log("Error in Fetching the Expenses", error);
  }
}

fetchExpenses()
  },[]);

type PropType = {
  title: string,
  topCategory: string
}

const FinMetricCardExtra = ({title, topCategory} : PropType)  =>{
    return(
      <div className="h-[107px] flex items-center justify-around rounded-lg px-3 rounded-md border-2 border-blue-600 bg-blue-50/40">
      {/* Title */}
      <p className="text-2xl sm:text-base md:text-2xl text-blue-800 font-semibold">
        {title}:
      </p>

      {/* Category */}
      <p className="text-xl sm:text-3xl font-bold text-blue-900 ">
        {topCategory}
      </p>
    </div>
    )
}

  return (
    <div className="bg-white px-4 sm:px-6 md:px-[31px] py-6 rounded-[16px] border border-[#e8e8e8] w-full h-[440px] flex flex-col justify-between">
      <FinMetricCard title="Total Amount (Expenses)" amount={stats.totalAmount} />

      <Divider />

      <FinMetricCardExtra title="Total Expenses" topCategory={stats.totalExpenses.toString()} />

      <Divider />

      <FinMetricCardExtra title=" Top Category" topCategory={stats.topCategory} />
    </div>
  );
};

export default FinancialMetrics;
