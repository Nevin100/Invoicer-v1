"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";

interface Client {
  _id: string;
  clientName: string;
  email: string;
  companyName: string;
  phone: string;
  createdAt: string;
}

const PaymentRequests = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          Swal.fire({
            icon: "error",
            title: "Unauthorized",
            text: "Please log in to view clients.",
          });
          setLoading(false);
          return;
        }

        const res = await fetch("/api/clients", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to fetch clients");
        }

        const data: Client[] = await res.json();
        // Sort latest first & take only 5
        const latestClients = data
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 5);

        setClients(latestClients);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  if (loading) {
  return (
    <div className="bg-white border border-[#e8e8e8] rounded-[16px] h-[410px] md:h-[440px] flex items-center justify-center">
      <div className="flex items-center gap-4">
        {/* Spinner */}
        <div className="relative w-10 h-10">
          {/* Outer circle */}
          <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-spin" />
          {/* Inner circle */}
          <div className="absolute inset-2 rounded-full bg-[#0052CC] animate-ping" />
        </div>

        {/* Text */}
        <p className="text-gray-600 text-sm">
          Loading the Customer list...
        </p>
      </div>
    </div>
  );
}
  if (error)
    return <p className="text-center text-red-500 font-medium">{error}</p>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md mt-6 md:h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-gray-800">Clients</h2>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-3 pb-2 border-b text-gray-500 text-sm font-semibold">
        <span>Details</span>
        <span className="text-center">Date Added</span>
        <span className="text-right">Company</span>
      </div>

      {/* Client List */}
      <div className="divide-y">
        {clients.length > 0 ? (
          clients.map((client) => (
            <div
              key={client._id}
              className="grid grid-cols-3 items-center py-4 hover:bg-gray-50 transition-all"
            >
              {/* Client Name & Email */}
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {client.clientName}
                </p>
                <p className="text-xs text-gray-500">{client.email}</p>
              </div>

              {/* Date */}
              <p className="text-gray-600 text-sm text-center">
                {new Date(client.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>

              {/* Company */}
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-right justify-self-end">
                {client.companyName || "Freelance"}
              </span>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-10">No clients found.</p>
        )}
      </div>
    </div>
  );
};

export default PaymentRequests;
