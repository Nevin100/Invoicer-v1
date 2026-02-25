import { Client } from "@/components/invoice/create_invoice_form";
import { Dispatch, SetStateAction } from "react";

export const fetchClients = async (
  setClients: Dispatch<SetStateAction<Client[]>>,
) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`/api/clients`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw Error("Failed to fetch clients");

    const data = await res.json();
    setClients(data);
  } catch (error) {
    console.error("Error fetching clients:", error);
  }
};
