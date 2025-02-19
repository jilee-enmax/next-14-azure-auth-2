"use client";

import { useState, useEffect } from "react";

export function ProductFeatures() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const baseUrl = process.env.NEXT_PUBLIC_API_CIAM_BASE_QA_URL;
  const endpoint = process.env.NEXT_PUBLIC_RESIDENTIAL_WEBRATES_URL;

  useEffect(() => {
    const fetchData = async () => {
      if (!baseUrl || !endpoint) {
        setError("API configuration is missing.");
        setLoading(false);
        return;
      }

      const apiUrl = `${baseUrl}${endpoint}`;

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? `Error: ${err.message}` : "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [baseUrl, endpoint]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500 font-bold">{error}</p>;

  const { featured_products } = data || {};

  // Function to extract and display products dynamically
  const renderProducts = (categoryName: string, categoryData: any) => {
    if (!categoryData) return null;

    return (
      <div className="mt-6">
        <h3 className="text-xl font-bold text-gray-700">{categoryName}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {["electricity", "natural_gas"].map((commodity) =>
            categoryData[commodity] ? (
              <div key={commodity} className="bg-gray-100 p-4 rounded-lg shadow-md border border-gray-300">
                <h4 className="text-md font-semibold text-[#111827]">{commodity.replace("_", " ").toUpperCase()}</h4>
                {categoryData[commodity].map((product: any, index: number) => (
                  <div key={index} className="p-3 mt-2 bg-white rounded-lg border border-gray-200">
                    <p className="text-sm text-[#111827]"><strong>Rate Type:</strong> {product.rate_type}</p>
                    <p className="text-sm text-[#111827]"><strong>Rate:</strong> {product.rate || "N/A"}</p>
                    <p className="text-sm text-[#111827]"><strong>Term:</strong> {product.term ? `${product.term} years` : "N/A"}</p>
                    <p className="text-sm text-[#111827]"><strong>Transaction Fee:</strong> {product.transaction_fee || "N/A"}</p>
                  </div>
                ))}
              </div>
            ) : null
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg border border-gray-200">
      <h2 className="text-2xl font-semibold text-center text-gray-800">Unauthenticated API Data</h2>
      <h3 className="text-lg text-center text-blue-600 mt-2">{baseUrl}{endpoint}</h3>

      {renderProducts("🔗 Bundled Products", featured_products?.bundled_products)}
      {renderProducts("⚡ Non-Bundled Electricity", featured_products?.non_bundled_electricity)}
      {renderProducts("🔥 Non-Bundled Natural Gas", featured_products?.non_bundled_natural_gas)}
      {renderProducts("🌞 Seasonal Solar", featured_products?.seasonal_solar)}

      {/* Green Add-ons */}
      {featured_products?.green_add_ons && (
        <div className="mt-6">
          <h3 className="text-xl font-bold text-green-600">🌱 Green Add-Ons</h3>
          <ul className="mt-2 space-y-2">
            {featured_products.green_add_ons.map((addon: any, index: number) => (
              <li key={index} className="p-3 bg-green-100 rounded-lg shadow-md">
                <p className="text-sm font-semibold text-[#111827]">Price: {addon.price}</p>
                {addon.electricity && (
                  <p className="text-sm text-[#111827]">
                    ⚡ Electricity Offset: {addon.electricity.carbon_offset} ({addon.electricity.price})
                  </p>
                )}
                {addon.natural_gas && (
                  <p className="text-sm text-[#111827]">
                    🔥 Natural Gas Offset: {addon.natural_gas.carbon_offset} ({addon.natural_gas.price})
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Dynamic Disclaimer from API */}
      <div className="mt-6 text-gray-600 text-sm border-t pt-4">
        <p><strong>Disclaimer:</strong> {featured_products?.bundled_products?.disclaimer || "No disclaimer available."}</p>
      </div>
    </div>
  );
}
