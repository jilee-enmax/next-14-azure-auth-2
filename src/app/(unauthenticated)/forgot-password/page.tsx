"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DrawerPanel } from "@/components/DrawerPanel"; // ✅ Import Sign-In Drawer

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [continuationToken, setContinuationToken] = useState("");

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔹 Step 1: Request Password Reset
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      console.log(`📨 [Step 1] Sending reset request for: ${email}`);
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, step: 1 }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setContinuationToken(data.continuation_token);
      await requestOTPEmail(data.continuation_token);
      setStep(2);
      setIsModalOpen(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Step 2: Request OTP Email
  const requestOTPEmail = async (token: string) => {
    try {
      console.log(`📨 [Step 2] Requesting OTP for token: ${token}`);
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ continuation_token: token, step: 2 }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      console.log("✅ OTP email sent successfully!");
    } catch (err: any) {
      setError(err.message);
    }
  };

  // 🔹 Step 3: Verify OTP
  const handleOTPSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      console.log(`📨 [Step 3] Verifying OTP: ${otp}`);
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ continuation_token: continuationToken, oob: otp, step: 3 }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setContinuationToken(data.continuation_token);
      setStep(3);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Step 4: Submit New Password
  const handleNewPasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      console.log(`📨 [Step 4] Submitting new password`);
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ continuation_token: continuationToken, new_password: newPassword, step: 4 }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      console.log("✅ Password reset successful! Redirecting to home page...");
      setIsModalOpen(false);
      setStep(1);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      {/* 🔹 Global Sign-In Drawer Panel */}
      <DrawerPanel />

      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-yellow-400">Forgot Password</h2>

        <label className="block mb-2 text-sm font-medium">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
          placeholder="Enter your email"
          required
        />

        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md">
          {loading ? "Processing..." : "Send Reset Link"}
        </button>

        {error && <div className="mt-4 text-red-500">{error}</div>}
      </form>

      {/* 🔹 Modal for OTP & New Password */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
            {step === 2 && (
              <form onSubmit={handleOTPSubmit}>
                <h2 className="text-xl font-semibold mb-4 text-white">Enter OTP</h2>
                <label className="block mb-2 text-sm font-medium">One Time Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
                  placeholder="Enter OTP"
                  required
                />
                <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md">
                  {loading ? "Processing..." : "Verify OTP"}
                </button>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleNewPasswordSubmit}>
                <h2 className="text-xl font-semibold mb-4 text-white">Set New Password</h2>
                <label className="block mb-2 text-sm font-medium">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
                  placeholder="Enter New Password"
                  required
                />
                <label className="block mb-2 text-sm font-medium">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
                  placeholder="Re-enter New Password"
                  required
                />
                <button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md">
                  {loading ? "Processing..." : "Reset Password"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
