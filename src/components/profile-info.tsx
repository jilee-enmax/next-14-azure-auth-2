"use server";

import { auth } from "@/auth";
import { SignOutForm } from "@/components/sign-out-form";

export default async function ProfileInfo() {
  const session = await auth(); 

  if (!session) {
    return <p className="text-center text-gray-500">You are not signed in.</p>;
  }

  const { name, email, provider } = session.user;

  return (
    <div className="w-full max-w-xs bg-white shadow-md rounded-lg p-3 border border-gray-300 text-sm flex flex-col space-y-2">
      <h2 className="text-md font-semibold text-gray-800">👤 Profile</h2>
      <p className="text-gray-700"><strong>Name:</strong> {name || "Unknown"}</p>
      <p className="text-gray-700"><strong>Email:</strong> {email || "N/A"}</p>
      <p className="text-gray-700"><strong>Auth Method Provider:</strong> {provider || "Unknown"}</p>
      <SignOutForm />
    </div>
  );
}
