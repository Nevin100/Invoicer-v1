/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { rpz_creds_route } from "@/lib/helpers/api-endpoints";
import Swal from "sweetalert2";

export default function RazorpayDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) {
  const [disableBtn, setDisableBtn] = useState(true);
  const [keyId, setKeyId] = useState("");
  const [keySecret, setKeySecret] = useState("");
  const [credentialsExist, setCredentialsExist] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(rpz_creds_route, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data as { keyId?: string };

        if (response.status === 200 && data.keyId) {
          setCredentialsExist(true);
          setKeyId(data.keyId);
          setKeySecret("");
        } else if (response.status === 204) {
          setCredentialsExist(false);
        }
      } catch (error: any) {
        if (error.response?.status === 204) {
          setCredentialsExist(false);
        } else {
          console.error("Error checking Razorpay credentials", error);
        }
      }
    };

    if (open) fetchCredentials();
  }, [open]);

  useEffect(() => {
    setDisableBtn(keyId.trim() === "" || keySecret.trim() === "");
  }, [keyId, keySecret]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (keyId === "" || keySecret === "") {
      setDisableBtn(true);
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in first.");
        return;
      }

      const response = await axios.post(
        rpz_creds_route,
        { keyId, keySecret },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        Swal.fire({
          title: "Saved!",
          text: "Credentials have been saved",
          icon: "success",
          confirmButtonText: "OK",
        });

        setKeyId("");
        setKeySecret("");

        setOpen(false);
      } else {
        alert("Error saving credentials.");
      }
    } catch (error) {
      console.error("Error submitting Razorpay credentials", error);
      alert("An error occurred while saving credentials.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {credentialsExist === false
              ? "Enter Razorpay Credentials"
              : "Update Razorpay Credentials"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="keyId" className="text-right">
                Key ID
              </Label>
              <Input
                id="keyId"
                className="col-span-3"
                placeholder="Enter Key ID"
                value={keyId}
                onChange={(e) => setKeyId(e.target.value)}
                autoComplete="off"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="keySecret" className="text-right">
                Key Secret
              </Label>
              <Input
                id="keySecret"
                className="col-span-3"
                placeholder="Enter Key Secret"
                type="password"
                value={keySecret}
                onChange={(e) => setKeySecret(e.target.value)}
                autoComplete="off"
              />
            </div>
          </div>
          <DialogFooter>
            <Button disabled={disableBtn} type="submit">
              {credentialsExist === false
                ? "Save Credentials"
                : "Update Credentials"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
