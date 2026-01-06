/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { FaDownload } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Client {
  _id: string;
  clientName: string;
  email: string;
  mobile: string;
  companyName: string;
  serviceCharge: number;
  createdAt: string; 
}

const ClientPage = () => {
  const router = useRouter();

  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [selectedDays, setSelectedDays] = useState<number | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const [metrics, setMetrics] = useState({ totalClients: 0, totalPayment: 0 });

  //Fetching Clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get<Client[]>("/api/clients", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClients(res.data);
        setFilteredClients(res.data);
      } catch (err) {
        console.error("Error fetching clients", err);
      }
    };

    const fetchStats = async () => {
      try {
        const res = await axios.get<{ totalClients: number; totalPayment: number }>("/api/clients/stats", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setMetrics(res.data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };
    fetchStats();
    fetchClients();
  }, []);

  //filter LastN days : 
  const filterLastNDays = (days: number) => {
    setSelectedDays(days);
    const today = new Date();
    const lastNDays = new Date(today.setDate(today.getDate() - days));
    
    const recentClients = clients.filter(client => {
      const clientDate = new Date(client.createdAt);
      return clientDate >= lastNDays;
    });
  
    setFilteredClients(recentClients);
    setCurrentPage(1);
  };
  
//Search Client : 
  const searchClients = () => {
    const query = searchQuery.toLowerCase();
    return filteredClients.filter((client) => {
      return (
        client.clientName?.toLowerCase().includes(query) ||
        client.email?.toLowerCase().includes(query) ||
        client.mobile?.toString().includes(query) ||
        client.companyName?.toLowerCase().includes(query)
      );
    });
  };

  //pagination start : 
  const paginatedClients = () => {
    const allClients = searchClients();
    const start = (currentPage - 1) * itemsPerPage;
    return allClients.slice(start, start + itemsPerPage);
  };

  const totalPages = Math.ceil(searchClients().length / itemsPerPage);

  //Toggle Select All Clients :
  const toggleSelectAll = () => {
    if (selectedClients.length === paginatedClients().length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(paginatedClients().map((c) => c._id));
    }
  };

  //Toggle Select Client :
  const toggleSelectClient = (id: string) => {
    setSelectedClients((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  //Delete Client
  const handleDelete = async () => {
    if (selectedClients.length === 0) {
      Swal.fire({
        title: "No clients selected!",
        text: "Please select at least one client to delete.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete selected expenses?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete them!",
    });

    if (!confirmResult.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete<Client[]>("/api/clients", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { clientIds: selectedClients },
      } as any);

      console.log(res);
      setClients(clients.filter((client) => !selectedClients.includes(client._id)));
      setFilteredClients(filteredClients.filter((client) => !selectedClients.includes(client._id)));
      setSelectedClients([]);

      const updatedStats = await axios.get<{ totalClients: number; totalPayment: number }>("/api/clients/stats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      // Update the metrics with the new stats
      setMetrics(updatedStats.data);

      Swal.fire({
        title: "Deleted!",
        text: "Selected clients have been deleted.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (err: any) {
      console.error("Error deleting clients", err);
      Swal.fire({
        title: "Error!",
        text: err?.response?.data?.error,
        icon: "error", 
      });
      
    }
  };

  //handle Export : 
  const handleExport = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Clients");
  
    worksheet.columns = [
      { header: "Client Name", key: "clientName" },
      { header: "Email", key: "email" },
      { header: "Mobile", key: "mobile" },
      { header: "Company", key: "companyName" },
      { header: "Service Charge", key: "serviceCharge" },
      { header: "Status", key: "status" },
      { header: "Issue Date", key: "createdAt" },
      { header: "Due Date", key: "dueDate" },
    ];
  
    const filteredData = selectedClients.length > 0
      ? clients.filter((client) => selectedClients.includes(client._id))
      : searchClients();
  
    filteredData.forEach((client) => {
      worksheet.addRow({
        clientName: client.clientName,
        email: client.email,
        mobile: client.mobile,
        companyName: client.companyName,
        serviceCharge: client.serviceCharge,
        status: "Paid",
        createdAt: new Date(client.createdAt).toLocaleString(),
        dueDate: new Date(client.createdAt).toLocaleDateString(),
      });
    });
  
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: "application/octet-stream" });
      saveAs(blob, "clients.xlsx");
    });
  };
  

  //render Pagination : 
  const renderPagination = () => (
    <div className="flex justify-center items-center mt-6 gap-2">
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 border rounded hover:bg-gray-200 disabled:opacity-50 cursor-pointer"
      >
        Prev
      </button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => setCurrentPage(i + 1)}
          className={`px-3 py-1 border rounded cursor-pointer hover:bg-gray-200 ${currentPage === i + 1 ? "bg-gray-800 text-white" : ""}`}
        >
          {i + 1}
        </button>
      ))}
      <button
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border rounded hover:bg-gray-200 disabled:opacity-50 cursor-pointer"
      >
        Next
      </button>
    </div>
  );

  //Main block : 
  return (
    <div className="font-['Archivo'] p-4 sm:p-6 bg-white">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 font-['Archivo']">
        <div className="bg-white border rounded-lg p-4">
          <p className="text-xl text-gray-500 pb-2">Total Clients</p>
          <h3 className="md:text-3xl text-xl font-bold">{metrics.totalClients}</h3>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-xl text-gray-500 pb-2">Total Payment</p>
          <h3 className="md:text-3xl text-xl font-bold">${metrics.totalPayment}</h3>
        </div>
        
      </div>
      {/* Search + Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Search clients..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full sm:w-1/3 border px-4 py-2 rounded-md text-sm"
        />
        <div className="flex flex-wrap justify-end gap-2">
          <Button onClick={handleExport} className="border px-5 py-2 rounded-md text-white flex items-center text-sm cursor-pointer hover:bg-gray-800">
            <FaDownload className="mr-2" /> Export
          </Button>
          <select
            onChange={(e) => filterLastNDays(Number(e.target.value))}
            value={selectedDays ?? ""}
            className="border px-4 py-2 rounded-md text-sm cursor-pointer hover:bg-gray-100"
            >
            <option value={365}>Filter by days</option>
            <option value={15}>Last 15 days</option>
            <option value={30}>Last 30 days</option>
            <option value={45}>Last 45 days</option>
            <option value={60}>Last 60 days</option>
            <option value={90}>Last 90 days</option>
            <option value={180}>Last 180 days</option>
            <option value={365}>Last 365 days</option>
          </select>

          <button onClick={handleDelete} className="border px-5 py-2 rounded-md text-red-500 flex items-center text-sm cursor-pointer hover:bg-red-500 hover:text-white">
            Delete Selected
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block border rounded-lg min-h-[450px]">
        <table className="w-full text-sm text-left">
          <thead className="bg-white border-b text-gray-600 font-medium">
            <tr>
              <th className="p-3">
                <input type="checkbox" checked={paginatedClients().length > 0 && selectedClients.length === paginatedClients().length} onChange={toggleSelectAll} className="accent-purple-600" />
              </th>
              <th className="p-3">Charge</th>
              <th className="p-3">Status</th>
              <th className="p-3">Customer Info</th>
              <th className="p-3">Company Name</th>
              <th className="p-3">Issue Date</th>
              <th className="p-3">Due Date</th>
            </tr>
          </thead>
          <tbody>
        {paginatedClients().length > 0 ? (
          <>
              {paginatedClients().map((client) => (
              <tr key={client._id}   
              onClick={() => router.push(`/clients/profile?id=${client._id}`)}
              className="border-t cursor-pointer hover:bg-gray-100">
                <td className="p-3">
                  <input type="checkbox" checked={selectedClients.includes(client._id)} onChange={() => toggleSelectClient(client._id)} className="accent-purple-600 cursor-pointer" />
                </td>
                <td className="p-3 font-bold text-black">${client.serviceCharge}</td>
                <td className="p-3">
                  <span className="bg-green-100 text-green-800 px-2 py-1 text-xs rounded-full">Paid</span>
                </td>
                <td className="p-3">
                  <div className="font-medium text-gray-800">{client.clientName}</div>
                  <div className="text-xs text-gray-500">{client.email}</div>
                  <div className="text-xs text-gray-500">{client.mobile}</div>
                </td>
                <td className="p-3 text-gray-700">{client.companyName}</td>
                <td className="p-3">{new Date(client.createdAt).toLocaleString()}</td>
                <td className="p-3">{new Date(client.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </>
        ) : (
          <tr>
            <td colSpan={7}  
            className="h-[300px] text-center align-middle">
               <div className="flex justify-center items-center h-full text-gray-500 text-2xl font-semibold">
          No Clients have been updated yet
        </div>
        </td>
          </tr>
        )}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex flex-col gap-4">
        {paginatedClients.length > 0 ? 
        (<>
        {paginatedClients().map((client, i) => (
          <div key={i} className="border rounded-lg p-4 shadow-sm relative cursor-pointer" onClick={() => router.push(`/clients/profile?id=${client._id}`)}>
            <input type="checkbox" checked={selectedClients.includes(client._id)} onChange={() => toggleSelectClient(client._id)} className="absolute bottom-2 right-2 h-4 w-4 accent-purple-600" />
            <div className="flex justify-between items-center mb-2 pr-6">
              <div className="font-bold text-lg">${client.serviceCharge}</div>
              <span className="bg-green-100 text-green-800 px-2 py-1 text-xs rounded-full">Paid</span>
            </div>
            <div className="text-sm font-medium">{client.clientName}</div>
            <div className="text-xs text-gray-500">{client.email}</div>
            <div className="text-xs text-gray-500 mb-2">{client.mobile}</div>
            <div className="text-sm mb-1"><span className="font-semibold">Issue:</span> {new Date(client.createdAt).toLocaleString()}</div>
            <div className="text-sm mb-1"><span className="font-semibold">Due:</span> {new Date(client.createdAt).toLocaleDateString()}</div>
            <div className="text-sm">{client.companyName}</div>
          </div>
        ))}</>) : (
          <div className="h-[60vh] flex justify-center items-center text-gray-500 text-xl font-semibold">
      No Expenses have been made yet
    </div>
        )}
      </div>

      <div className="mt-auto">{renderPagination()}</div> {/* Pagination component call */}
    </div>
  );
};

export default ClientPage;
