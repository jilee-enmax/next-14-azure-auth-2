"use server";

import { auth } from "@/auth";
import { PageWrapper } from "@/app/layout";
import { getUserDetails } from "@/services/msGraph";
import { formatTimestamp } from "@/utils/dateFormatter"; // ✅ Import timestamp formatter
import ClipboardButton from "@/components/ClipboardButton";

export default async function HomePage() {
  const session = await auth();
  const accessToken = session?.user?.accessToken || "No access token available";

  if (!session || !session.user) {
    return (
      <PageWrapper description="🚀 Welcome to your dashboard.">
        <main aria-label="Account page">
          <h1 className="text-xl font-bold text-white">Home Dashboard</h1>
          <p className="text-gray-300">You are not authenticated. Please log in.</p>
        </main>
      </PageWrapper>
    );
  }

  // Fetch user details using Microsoft Graph Client
  const user = await getUserDetails(accessToken);

  return (
    <PageWrapper description={`🚀 Landing Page \nProfile Information from EntraID retrieved by MS Graph \nsrc\\services\\msGraph.ts`}>
      <main className="p-6 max-w-4xl mx-auto">
        <h1 className="text-center text-white text-2xl mb-6">Your Microsoft Entra ID from https://graph.microsoft.com/v1.0/me</h1>

        {/* User Profile Details */}
        <section className="mt-6 p-4 bg-gray-100 text-black rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">👤 EntraID Profile Information</h3>
          {user ? (
            <div className="p-3 bg-white rounded-lg border border-gray-300">
              <p><strong>Name:</strong> {user.displayName || "N/A"}</p>
              <p><strong>Email:</strong> {user.mail || user.userPrincipalName || "N/A"}</p>
              <p><strong>Last Password Change:</strong> {formatTimestamp(user.lastPasswordChangeDateTime) || "N/A"}</p>
              <p><strong>Account Enabled:</strong> {user.accountEnabled ? "✅ Active" : "❌ Disabled"}</p>
              <p><strong>Mobile Phone:</strong> {user.mobilePhone || "N/A"}</p>
              <p><strong>Password Policies:</strong> {user.passwordPolicies || "N/A"}</p>
              <p><strong>Object ID (oid):</strong> {user.id || "N/A"}</p> {/* Display user.id (oid) */}
            </div>
          ) : (
            <p className="text-gray-500">No user information available.</p>
          )}
        </section>

        {/* Section: Raw API Response */}
        <section className="mt-6 p-4 bg-gray-900 text-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">📝 Raw User Data from https://graph.microsoft.com/v1.0/me</h3>
          <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
            <pre className="text-white bg-gray-700 p-2 rounded border border-gray-600 overflow-x-auto max-h-60 text-xs break-all">
              {JSON.stringify(user, null, 2)}
            </pre>
            <ClipboardButton text={JSON.stringify(user, null, 2) || ""} />
          </div>
        </section>
      </main>
    </PageWrapper>
  );
}
