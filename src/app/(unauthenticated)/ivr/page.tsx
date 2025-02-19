"use client";

import { useState } from "react";

// https://ciamexternalqa.cloudenmax.com/enmax/entraid/api/v1.1/interaction/smartaction/ivr/v3/accounts/entraid
const IVR_API_URL = process.env.NEXT_PUBLIC_IVR_GET_ACCOUNTS_FULL_URL;

export default function IVRPage() {
  // State for Token Fetching Form
  const [token, setToken] = useState("");
  const [tokenError, setTokenError] = useState<string | null>(null);

  // State for IVR Fetching Form
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bp, setBp] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch Token from Microsoft Identity Platform
  const fetchToken = async (event: React.FormEvent) => {
    event.preventDefault();
    setTokenError(null);
    setToken("");

    try {
      const res = await fetch("/api/get-ivr-token", { method: "POST" });

      if (!res.ok) {
        throw new Error("Failed to fetch token.");
      }

      const data = await res.json();
      setToken(data.access_token);
    } catch (err: any) {
      setTokenError(err.message);
    }
  };

  // Fetch IVR Smart Action Data
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!phoneNumber && !bp) {
      setError("Please enter either a phone number or BP.");
      return;
    }

    if (!token) {
      setError("Bearer token is required.");
      return;
    }

    setError(null);
    setResponse(null);

    let url = `${IVR_API_URL}`;
    if (phoneNumber) {
      url += `?phone_number=${encodeURIComponent(phoneNumber)}`;
    } else if (bp) {
      url += `?bp=${encodeURIComponent(bp)}`;
    }

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status} - ${res.statusText}`);
      }

      const data = await res.json();
      setResponse(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      {/* Responsive Grid: Side-by-Side Forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Left Form: Fetch Token */}
        <form onSubmit={fetchToken} className="bg-gray-800 p-6 rounded-lg shadow-md w-full">
          <h2 className="text-xl font-semibold mb-4 text-blue-400">Fetch Bearer Token</h2>

          <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md">
            Get Token
          </button>

          {token && (
            <div className="mt-4">
              <label className="block mb-2 text-sm font-medium text-green-300">IVR Access Token</label>
              <div className="p-2 bg-gray-700 rounded text-green-400 text-xs break-words max-w-full overflow-hidden">
                {token}
              </div>
            </div>
          )}
        </form>

        {/* Right Form: Fetch IVR Data */}
        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-md w-full">
          <h2 className="text-xl font-semibold mb-4 text-yellow-400">Query Accounts</h2>

          <label className="block mb-2 text-sm font-medium">Phone Number (Optional)</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
            placeholder="Enter phone number"
            disabled={!!bp}
          />

          <label className="block mb-2 text-sm font-medium">BP (Optional)</label>
          <input
            type="text"
            value={bp}
            onChange={(e) => setBp(e.target.value)}
            className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
            placeholder="Enter BP"
            disabled={!!phoneNumber}
          />

          <label className="block mb-2 text-sm font-medium">Bearer Token</label>
          <input
            type="text"
            value={token}
            readOnly
            className="w-full p-2 mb-4 rounded bg-gray-700 text-white cursor-not-allowed"
            placeholder="Token will be auto-filled"
          />

          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md">
            Fetch Data
          </button>

          {error && <div className="mt-4 text-red-500">{error}</div>}
        </form>
      </div>

      {/* Display IVR Response */}
      {response && response.accounts && (
        <div className="mt-6 w-full max-w-4xl">
          <h2 className="text-lg font-semibold mb-4 text-white">Account Details</h2>

          <div className="mt-6 w-full">
            {response.accounts.map((account: any, index: number) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-blue-400 mb-2">
                  {account.first_name} {account.last_name}
                </h3>

                <div className="max-h-80 overflow-y-auto p-4 bg-gray-700 rounded-lg">
                  {Object.entries(account).map(([key, value]) => (
                    <p key={key} className="text-gray-300 break-words">
                      <span className="font-semibold">{key.replace(/_/g, " ")}:</span>{" "}
                      {JSON.stringify(value)}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
