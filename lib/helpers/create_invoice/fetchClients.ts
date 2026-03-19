import { Client } from "@/components/invoice/create_invoice_form";
import { Dispatch, SetStateAction } from "react";

export const fetchClients = async (
  setClients: Dispatch<SetStateAction<Client[]>>,
) => {
  try {
    const res = await fetch("/api/clients", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
         withCredentials: "include",
      },
    });

    if (!res.ok) throw Error("Failed to fetch clients");

    const data = await res.json();
    setClients(data);
  } catch (error) {
    console.error("Error fetching clients:", error);
  }
};
