'use server';

import { auth } from '@/auth';
import { callApiWithNewToken } from '@/utils/api';
import ClipboardButton from '@/components/ClipboardButton';
import { PageWrapper } from '@/app/layout'; // ✅ Import PageWrapper

export default async function ApiTestPage() {
  const session = await auth();
  const userName = session?.user?.name || 'Unknown user';
  const userEmail = session?.user?.email || 'Email not available';
  const oldAccessToken = session?.user?.accessToken || 'No old access token available';
  const refreshToken = session?.user?.refreshToken || 'No refresh token available';
  const apiUrl = process.env.NEXT_PUBLIC_REAL_TIME_SYSTEM_DEMAND_FULL_URL || 'API URL not defined';
  const provider = session?.user?.provider || 'oidc'; // ✅ Ensure provider is set

  let newAccessToken = 'No new access token available';
  let apiResponse = 'No API response available';
  let headers = 'No headers available';
  let errorMessage = '';

  try {
    console.log(`Starting API call using provider: ${provider}`);

    if (apiUrl === 'API URL not defined') {
      throw new Error('API URL is not defined in the environment variables.');
    }

    // ✅ Ensure provider is passed as the third argument
    const response = await callApiWithNewToken(refreshToken, apiUrl, provider);
    newAccessToken = response.newAccessToken;
    headers = JSON.stringify(response.headers, null, 2);
    apiResponse = JSON.stringify(response.apiResponse, null, 2);
  } catch (error) {
    console.error('Error making API call:', error);
    errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
  }

  return (
    <PageWrapper description="🚀 Test making an AUTHORIZED API call (Scope = User.Read) to an UNAUTHENTICATED CIAM endpoint. If you do not have the proper scopes, you will not be able to get a response.">
      <main className="p-6 max-w-3xl mx-auto">
        <h1 className="text-center text-white text-2xl mb-6">UNAUTHENTICATED API TEST</h1>
        <h2 className="text-center text-blue-400">{apiUrl}</h2>

        <section className="mt-6">
          {[
            { label: 'Old Access Token', value: oldAccessToken },
            { label: 'Refresh Token', value: refreshToken },
            { label: 'New Access Token', value: newAccessToken },
            { label: 'Request Headers', value: headers },
            { label: 'API Response', value: apiResponse },
          ].map(({ label, value }, index) => (
            <div key={index} className="mb-4 p-4 bg-gray-100 border border-gray-300 rounded-lg">
              <p className="font-bold text-black">{label}:</p> {/* ✅ Text is now black */}
              <pre className="text-black bg-gray-200 p-2 rounded border border-gray-400 overflow-x-auto max-h-40 text-sm break-all">
                {value || "No data available"}
              </pre>
              <ClipboardButton text={value || ""} />
            </div>
          ))}

          {errorMessage && (
            <div className="text-red-500 font-bold mt-6">
              <p>Error: {errorMessage}</p>
            </div>
          )}
        </section>
      </main>
    </PageWrapper>
  );
}
