/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { FaDownload } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import ProfileCard from "@/components/ProfileCard_Old"; // Import ProfileCard
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
  const [client, setClient] = useState<Client | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [selectedDays, setSelectedDays] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

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

    if (!id) return;
    const fetchClient = async () => {
      try {
        const res = await axios.get(`/api/clients/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setClient(res.data as Client);
      } catch (err) {
        console.error("Error fetching client:", err);
      }
    };

    fetchClient();
    fetchClients();
  }, [id]);

  const filterLastNDays = (days: number) => {
    setSelectedDays(days);
    const today = new Date();
    const lastNDays = new Date(today.setDate(today.getDate() - days));

    const recentClients = clients.filter((client) => {
      const clientDate = new Date(client.createdAt);
      return clientDate >= lastNDays;
    });

    setFilteredClients(recentClients);
    setCurrentPage(1);
  };

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

  const paginatedClients = () => {
    const allClients = searchClients();
    const start = (currentPage - 1) * itemsPerPage;
    return allClients.slice(start, start + itemsPerPage);
  };

  const totalPages = Math.ceil(searchClients().length / itemsPerPage);

  const toggleSelectAll = () => {
    if (selectedClients.length === paginatedClients().length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(paginatedClients().map((c) => c._id));
    }
  };

  const toggleSelectClient = (id: string) => {
    setSelectedClients((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

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
      setClients(
        clients.filter((client) => !selectedClients.includes(client._id))
      );
      setFilteredClients(
        filteredClients.filter(
          (client) => !selectedClients.includes(client._id)
        )
      );
      setSelectedClients([]);

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

    const filteredData =
      selectedClients.length > 0
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
        className="px-3 py-1 border rounded hover:bg-gray-200 disabled:opacity-50"
      >
        Prev
      </button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => setCurrentPage(i + 1)}
          className={`px-3 py-1 border rounded hover:bg-gray-200 ${currentPage === i + 1 ? "bg-gray-800 text-white" : ""}`}
        >
          {i + 1}
        </button>
      ))}
      <button
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border rounded hover:bg-gray-200 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );

  //Main block :
  return (
    <div className="font-['Archivo'] p-4 sm:p-6 bg-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 font-['Archivo']">
        {client && (
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <ProfileCard
              name={client.clientName}
              email={client.email}
              phone={client.mobile}
            />
          </div>
        )}

        <div className="bg-white border rounded-lg p-4 flex flex-col justify-center">
          <p className="text-xl text-gray-500 pb-2">Total Service Charge</p>
          <h3 className="md:text-3xl text-xl font-bold">
            ${client?.serviceCharge}
          </h3>
        </div>
        <div className="bg-white border rounded-lg p-4 flex flex-col justify-center">
          <p className="text-xl text-gray-500 pb-2">Company Name</p>
          <h3 className="md:text-3xl text-xl font-bold">
            {client?.companyName}
          </h3>
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
          <Button
            onClick={handleExport}
            className="border px-5 py-2 rounded-md text-white flex items-center text-sm cursor-pointer hover:bg-gray-800"
          >
            <FaDownload className="mr-2" /> Export
          </Button>
          <select
            onChange={(e) => filterLastNDays(Number(e.target.value))}
            value={selectedDays ?? ""}
            className="border px-4 py-2 rounded-md text-sm cursor-pointer hover:bg-purple-500"
          >
            <option value="">Filter by days</option>
            <option value={15}>Last 15 days</option>
            <option value={30}>Last 30 days</option>
            <option value={45}>Last 45 days</option>
            <option value={60}>Last 60 days</option>
            <option value={90}>Last 90 days</option>
            <option value={180}>Last 180 days</option>
            <option value={365}>Last 365 days</option>
          </select>

          <button
            onClick={handleDelete}
            className="border px-5 py-2 rounded-md text-red-500 flex items-center text-sm cursor-pointer hover:bg-red-500 hover:text-white"
          >
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
                <input
                  type="checkbox"
                  checked={
                    paginatedClients().length > 0 &&
                    selectedClients.length === paginatedClients().length
                  }
                  onChange={toggleSelectAll}
                  className="accent-purple-600"
                />
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
            {paginatedClients().map((client) => (
              <tr
                key={client._id}
                className="border-t cursor-pointer hover:bg-gray-100"
                onClick={() => router.push(`/clients/profile?id=${client._id}`)}
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedClients.includes(client._id)}
                    onChange={() => toggleSelectClient(client._id)}
                    className="accent-purple-600"
                  />
                </td>
                <td className="p-3 font-bold text-black">
                  ${client.serviceCharge}
                </td>
                <td className="p-3">
                  <span className="bg-green-100 text-green-800 px-2 py-1 text-xs rounded-full">
                    Paid
                  </span>
                </td>
                <td className="p-3">
                  <div className="font-medium text-gray-800">
                    {client.clientName}
                  </div>
                  <div className="text-xs text-gray-500">{client.email}</div>
                  <div className="text-xs text-gray-500">{client.mobile}</div>
                </td>
                <td className="p-3 text-gray-700">{client.companyName}</td>
                <td className="p-3">
                  {new Date(client.createdAt).toLocaleString()}
                </td>
                <td className="p-3">
                  {new Date(client.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile View */}
      <div className="md:hidden flex flex-col gap-4">
        {paginatedClients().map((client, i) => (
          <div
            key={i}
            className="border rounded-lg p-4 shadow-sm relative cursor-pointer"
            onClick={() => router.push(`/clients/profile?id=${client._id}`)}
          >
            <input
              type="checkbox"
              checked={selectedClients.includes(client._id)}
              onChange={() => toggleSelectClient(client._id)}
              className="absolute bottom-2 right-2 h-4 w-4 accent-purple-600"
            />
            <div className="flex justify-between items-center mb-2 pr-6">
              <div className="font-bold text-lg">${client.serviceCharge}</div>
              <span className="bg-green-100 text-green-800 px-2 py-1 text-xs rounded-full">
                Paid
              </span>
            </div>
            <div className="text-sm font-medium">{client.clientName}</div>
            <div className="text-xs text-gray-500">{client.email}</div>
            <div className="text-xs text-gray-500 mb-2">{client.mobile}</div>
            <div className="text-sm mb-1">
              <span className="font-semibold">Issue:</span>{" "}
              {new Date(client.createdAt).toLocaleString()}
            </div>
            <div className="text-sm mb-1">
              <span className="font-semibold">Due:</span>{" "}
              {new Date(client.createdAt).toLocaleDateString()}
            </div>
            <div className="text-sm">{client.companyName}</div>
          </div>
        ))}
      </div>
      <div className="mt-auto">{renderPagination()}</div>{" "}
      {/* Pagination component call */}
    </div>
  );
};

export default ClientPage;
