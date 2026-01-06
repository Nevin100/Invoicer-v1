'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import axios from "axios"; // You can use axios or fetch here
import { rpz_creds_route } from "@/lib/helpers/api-endpoints";

export default function PaymentPage() {
  const [keyId, setKeyId] = useState("");
  const [keySecret, setKeySecret] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Get the token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in first.");
        return;
      }

      // Send the Razorpay credentials to the backend with the token in headers
      const response = await axios.post(
        rpz_creds_route,
        {
          keyId,
          keySecret,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the Authorization header
          },
        }
      );

      if (response.status === 201) {
        alert("Credentials saved successfully!");
      } else {
        alert("Error saving credentials.");
      }
    } catch (error) {
      console.error("Error submitting Razorpay credentials", error);
      alert("An error occurred while saving credentials.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add or Change Rzp Payment credentials</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter Razorpay Credentials</DialogTitle>
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
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
