"use client";

import { useRouter } from "next/navigation";

export function LinksPanel() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center space-y-6 bg-gray-800 p-6 rounded-md shadow-lg w-full max-w-xl">
      <h2 className="text-lg font-semibold text-white mb-4 self-start">Quick Links</h2>
      <ul className="space-y-3 w-full">
        <li>
          <a
            href="https://github.com/jilee-enmax/next-14-azure-auth-2"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-400 hover:underline"
          >
            Github Repository
          </a>
        </li>
        <li>
          <a
            href="https://vercel.com/enmax-next/next-14-azure-auth-2"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-400 hover:underline"
          >
            Vercel Deployment
          </a>
        </li>

        {/* Divider */}
        <div className="flex items-center w-full">
          <div className="border-t border-gray-600 flex-grow"></div>
          <span className="px-3 text-gray-400 text-sm">Unauthenticated Pages</span>
          <div className="border-t border-gray-600 flex-grow"></div>
        </div>
        <li>
          <button
            onClick={() => router.push("/signup")}
            className="block text-left text-blue-400 hover:underline w-full"
          >
            Sign Up
          </button>
        </li>

        <li>
          <button
            onClick={() => router.push("/forgot-password")}
            className="block text-left text-blue-400 hover:underline w-full"
          >
            Forgot Password
          </button>
        </li>

        <li>
          <button
            onClick={() => router.push("/ivr")}
            className="block text-left text-blue-400 hover:underline w-full"
          >
            IVR Get Accounts
          </button>
        </li>
      </ul>
    </div>
  );
}
