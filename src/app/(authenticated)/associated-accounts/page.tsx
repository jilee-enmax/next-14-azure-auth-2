'use server';

import { auth } from '@/auth';
import { callApiWithNewToken } from '@/utils/api';
import ClipboardButton from '@/components/ClipboardButton';
import { PageWrapper } from '@/app/layout';
import { formatTimestamp } from '@/utils/dateFormatter'; // ✅ Import timestamp formatter

export default async function AssociatedAccountsPage() {
  const session = await auth();
  const oldAccessToken = session?.user?.accessToken || 'No old access token available';
  const refreshToken = session?.user?.refreshToken || 'No refresh token available';

  const apiUrl = process.env.NEXT_PUBLIC_ASSOCIATED_ACCOUNTS_FULL_URL || 'API URL not defined';
  const provider = session?.user?.provider || 'oidc';  // Detect if it's 'native' or 'oidc'

  let newAccessToken = 'No new access token available';
  let apiResponse = null;
  let headers = {};
  let errorMessage = '';

  try {
    console.log(`Starting API call using provider: ${provider}`);
    
    if (apiUrl === 'API URL not defined') {
      throw new Error('API URL is not defined in the environment variables.');
    }

    const response = await callApiWithNewToken(refreshToken, apiUrl, provider);
    newAccessToken = response.newAccessToken;
    headers = response.headers || {};
    apiResponse = response.apiResponse;
  } catch (error) {
    console.error('Error making API call:', error);
    errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
  }

  return (
    <PageWrapper description="🔍 Test calling an AUTHORIZED API (Scope = User.Read) to an AUTHENTICATED CIAM endpoint. If you lack the proper scopes, you won't get a response. 
    Your EntraID account should match the identity document stored in Couchbase (QA), or you won’t receive a response.">
      
      <main className="p-6 max-w-4xl mx-auto">
        <h1 className="text-center text-white text-2xl mb-6">Associated Accounts API Test</h1>
        <h2 className="text-center text-blue-400 mt-4">{apiUrl}</h2>

        {/* Section: API Response */}
        <section className="mt-6 p-4 bg-gray-100 text-black rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">📜 API Response</h3>

          {apiResponse ? (
            <div>
              {/* User Info */}
              <div className="mb-4 p-3 bg-white rounded-lg border border-gray-300">
                <h4 className="font-bold text-lg text-gray-900">👤 User Information</h4>
                <p><strong>Username:</strong> {apiResponse.associated_account.username}</p>
                <p><strong>User Ref:</strong> {apiResponse.associated_account.user_ref}</p>
                <p><strong>Domain Ref:</strong> {apiResponse.associated_account.domain_ref}</p>
                <p><strong>Created At:</strong> {formatTimestamp(apiResponse.associated_account.created_t)}</p>
                <p><strong>Last Modified:</strong> {formatTimestamp(apiResponse.associated_account.modified_t)}</p>
              </div>

              {/* Accounts Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 bg-white rounded-lg">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left">Account No.</th>
                      <th className="px-4 py-2 text-left">Description</th>
                      <th className="px-4 py-2 text-left">Plan Active</th>
                      <th className="px-4 py-2 text-left">Municipal Services</th>
                      <th className="px-4 py-2 text-left">Is Default</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apiResponse.associated_account.accounts.map((acc: any, index: number) => (
                      <tr key={index} className="border-t border-gray-300">
                        <td className="px-4 py-2">{acc.account.account_no}</td>
                        <td className="px-4 py-2">{acc.account.description || "N/A"}</td>
                        <td className="px-4 py-2">{acc.account.is_plan_active ? "✅ Yes" : "❌ No"}</td>
                        <td className="px-4 py-2">{acc.account.has_municipal_services ? "✅ Yes" : "❌ No"}</td>
                        <td className="px-4 py-2">{acc.account.is_default ? "✅ Yes" : "❌ No"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No API response available.</p>
          )}

          {/* Error Message (If Any) */}
          {errorMessage && (
            <div className="text-red-500 font-bold mt-6 p-4 bg-red-100 border border-red-400 rounded-lg">
              <p>Error: {errorMessage}</p>
            </div>
          )}
        </section>
        
        {/* Section: Tokens */}
        <section className="mt-6 p-4 bg-gray-900 text-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">🔑 Tokens</h3>
          {[{ label: 'Old Access Token', value: oldAccessToken },
            { label: 'Refresh Token', value: refreshToken },
            { label: 'New Access Token', value: newAccessToken },
          ].map(({ label, value }, index) => (
            <div key={index} className="mb-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
              <p className="font-bold">{label}:</p>
              <pre className="bg-gray-700 p-2 rounded text-xs overflow-x-auto break-all max-h-40">{value || "No data available"}</pre>
              <ClipboardButton text={value || ""} />
            </div>
          ))}
        </section>

        {/* Section: Request Headers */}
        <section className="mt-6 p-4 bg-gray-900 text-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">📨 Request Headers</h3>
          <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
            <pre className="text-white bg-gray-700 p-2 rounded border border-gray-600 overflow-x-auto max-h-60 text-xs break-all">
              {JSON.stringify(headers, null, 2)}
            </pre>
            <ClipboardButton text={JSON.stringify(headers, null, 2) || ""} />
          </div>
        </section>

        {/* Section: Raw API Response */}
        <section className="mt-6 p-4 bg-gray-900 text-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">📝 Raw API Response</h3>
          <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
            <pre className="text-white bg-gray-700 p-2 rounded border border-gray-600 overflow-x-auto max-h-60 text-xs break-all">
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
            <ClipboardButton text={JSON.stringify(apiResponse, null, 2) || ""} />
          </div>
        </section>

      </main>
    </PageWrapper>
  );
}
