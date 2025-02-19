"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function SignInForm() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      const result = await signIn("credentials", {
        username: credentials.username,
        password: credentials.password,
      });

      if (result?.error) {
        setError("Invalid username or password");
      } else {
        router.refresh();
        router.replace("/");
      }
    } catch (err) {
      setError("An error occurred during sign-in.");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 bg-gray-800 p-6 rounded-md shadow-lg w-full max-w-md">
      {/* Form Inputs */}
      <form className="flex flex-col items-center space-y-4 w-full" onSubmit={handleSignIn}>
        <div className="w-full">
          <label htmlFor="username" className="block text-white font-medium mb-2">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            className="w-full px-3 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-900 text-white"
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="w-full">
          <label htmlFor="password" className="block text-white font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            className="w-full px-3 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-900 text-white"
            placeholder="Enter your password"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 mt-4 rounded bg-green-500 hover:bg-green-600 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-green-300"
        >
          Sign In
        </button>
      </form>

      {/* Error Message */}
      {error && <p className="text-red-500 pt-3">{error}</p>}

      {/* Divider */}
      <div className="flex items-center w-full">
        <div className="border-t border-gray-600 flex-grow"></div>
        <span className="px-3 text-gray-400 text-sm">or</span>
        <div className="border-t border-gray-600 flex-grow"></div>
      </div>

      {/* Responsive Social Sign-In Buttons */}
      <div className="flex flex-wrap justify-center gap-3 w-full">
        {/* Microsoft */}
        <button
          className="flex items-center justify-center gap-2 bg-white hover:bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded transition duration-200 border border-gray-300 w-full sm:w-auto"
          onClick={() => signIn("microsoft-entra-id")}
        >
          <img
            src="https://img.icons8.com/?size=100&id=22989&format=png&color=000000"
            alt="Microsoft Entra ID"
            className="w-5 h-5"
          />
          EntraID
        </button>

        {/* Google */}
        <button
          className="flex items-center justify-center gap-2 bg-white hover:bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded transition duration-200 border border-gray-300 w-full sm:w-auto"
          onClick={() => signIn("google")}
        >
          <img
            src="https://img.icons8.com/?size=100&id=V5cGWnc9R4xj&format=png&color=000000"
            alt="Google Icon"
            className="w-5 h-5"
          />
          Google
        </button>

        {/* Apple */}
        <button
          className="flex items-center justify-center gap-2 bg-black hover:bg-[#222222] text-white px-4 py-2 rounded transition duration-200 w-full sm:w-auto"
          onClick={() => signIn("apple")}
        >
          <img
            src="https://img.icons8.com/?size=100&id=30840&format=png&color=FFFFFF"
            alt="Apple Icon"
            className="w-5 h-5"
          />
          Apple
        </button>

        {/* Facebook */}
        <button
          className="flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded transition duration-200 w-full sm:w-auto"
          onClick={() => signIn("facebook")}
        >
          <img
            src="https://img.icons8.com/?size=100&id=uLWV5A9vXIPu&format=png&color=000000"
            alt="Facebook Icon"
            className="w-5 h-5"
          />
          Facebook
        </button>
      </div>

      {/* Create New User & Forgot Password */}
      <div className="flex flex-col sm:flex-row justify-between w-full text-sm text-gray-400 mt-4">
        <button onClick={() => router.push("/signup")} className="hover:underline">
          Create New User
        </button>
        <Link href="/forgot-password" rel="noopener noreferrer" className="hover:underline text-center">
          Forgot Password?
        </Link>
      </div>
    </div>
  );
}
