"use server";

import { auth } from "@/auth"; // ✅ Fetch user session
import { redirect } from "next/navigation"; // ✅ Server redirect
import { PageWrapper } from "@/app/layout";

export default async function ProfileSettingsPage() {
  const session = await auth(); // ✅ Fetch session on the server
  if (!session) return redirect("/auth/signin"); // ✅ Redirect if not authenticated

  return (
    <PageWrapper description="Update your display name.">
      <main className="max-w-lg mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-md">
        <h1 className="text-xl font-bold">Update Display Name</h1>
        <p className="text-gray-300 mb-4">Change how your name appears on your account.</p>

        {/* ✅ Server-side form submission */}
        <form action="/api/update-display-name" method="POST" className="space-y-4">
          {/* Display Current Name */}
          <label className="block">
            <span className="text-sm text-gray-400">Current Display Name</span>
            <input
              type="text"
              name="current_display_name"
              value={session.user.name ?? ""}
              className="w-full p-2 rounded bg-gray-700 text-gray-400 cursor-not-allowed"
              readOnly
            />
          </label>

          {/* New Display Name Input */}
          <label className="block">
            <span className="text-sm text-gray-400">New Display Name</span>
            <input
              type="text"
              name="new_display_name"
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
              minLength={3}
            />
          </label>

          {/* Submit Button */}
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md">
            Update Display Name
          </button>
        </form>
      </main>
    </PageWrapper>
  );
}
