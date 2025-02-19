"use server";

import { auth } from "@/auth";

export default async function TokenInfo() {
  const session = await auth();

  console.log("🔍 UI - TokenInfo Session Data:", session);

  if (!session) {
    return <p className="text-center text-gray-500">No active session.</p>;
  }

  const { accessToken, refreshToken, scopes } = session.user;

  return (
    <div className="w-full max-w-xs bg-gray-100 shadow-md rounded-lg p-3 border border-gray-300 text-sm flex flex-col space-y-2">
      <h2 className="text-md font-semibold text-gray-800">🔑 Tokens</h2>

      <p className="text-gray-700"><strong>Access:</strong></p>
      <textarea 
        className="w-full p-1 bg-gray-200 text-gray-800 rounded border border-gray-300 text-xs"
        rows={2}
        readOnly
        value={accessToken || "No Token"}
      />

      <p className="text-gray-700"><strong>Refresh:</strong></p>
      <textarea 
        className="w-full p-1 bg-gray-200 text-gray-800 rounded border border-gray-300 text-xs"
        rows={1}
        readOnly
        value={refreshToken || "No Token"}
      />

      <p className="text-gray-700"><strong>Scopes:</strong></p>
      <div className="w-full p-1 bg-gray-200 text-gray-800 rounded border border-gray-300 text-xs">
        {scopes?.length ? scopes.join(", ") : "No Scopes"}
      </div>
    </div>
  );
}
