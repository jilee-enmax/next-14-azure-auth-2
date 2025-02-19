"use client";

export default function PageDescription({ description }: { description: string }) {
  return (
    <div className="bg-gray-700 text-gray-200 p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-bold">📄 Page Information</h2>
      <p className="mt-2 text-sm whitespace-pre-line">{description}</p>
    </div>
  );
}
