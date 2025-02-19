"use client";

import React, { useState } from "react";

type ClipboardButtonProps = {
  text: string;
};

export default function ClipboardButton({ text }: ClipboardButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2s
    } catch (error) {
      alert("❌ Failed to copy to clipboard.");
    }
  };

  return (
    <button
      onClick={copyToClipboard}
      className="ml-2 px-3 py-1 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition duration-200"
    >
      {copied ? "✅ Copied!" : "📋 Copy"}
    </button>
  );
}
