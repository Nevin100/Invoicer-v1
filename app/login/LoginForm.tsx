"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import { login } from "@/lib/redux/Features/authSlice";
import { ImSpinner2 } from "react-icons/im";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.includes("@")) {
      setEmailError("Invalid Email");
      return;
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      dispatch(login(data.token));

      window.location.href = "/";
      
    } catch (error) {
      setEmailError("Invalid email or password" + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative md:mt-10 mt-8">
      <div className="p-6">
        <button className="absolute top-5 right-4">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4L4 12"
              stroke="#000"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 4L12 12"
              stroke="#000"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="flex justify-center mb-6 py-2">
          <Image src="/InstantPaid.jpeg" alt="Financea Logo" width={290} height={400} />
        </div>

        <h2 className="text-2xl font-semibold mb-1">Log in</h2>
        <p className="text-lg text-gray-600 mb-4">
          Create an account?{" "}
          <Link href="/signup" className="text-[#5C2FA8] font-medium text-lg">
            Sign up
          </Link>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="email" className="block text-xl mb-1 md:py-2">
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              className={`w-full p-2.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#5C2FA8] ${
                emailError ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="example@gmail.com"
            />
            {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
          </div>

          <div className="mb-2">
            <label htmlFor="password" className="block text-xl mb-1 md:py-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={handlePasswordChange}
                className={`w-full p-2.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#5C2FA8] pr-10 ${
                  passwordError ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
          </div>

          <p className="text-sm text-gray-500 mb-4 mt-4 py-2">
            Use 8 or more characters with a mix of letters, numbers & symbols
          </p>

          <button
            type="submit"
            className="w-full bg-[#5C2FA8] text-xl font-semibold text-white py-4 rounded-md hover:bg-purple-700 transition-colors"
            disabled={loading}
          >
            {loading ? (
              <div className="flex justify-center items-center">  
                <ImSpinner2 className="w-6 h-6 animate-spin text-center text-gray-50" />
              </div>
            ) : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}
