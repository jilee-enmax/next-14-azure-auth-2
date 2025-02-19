export async function callApiWithNewToken(refreshToken: string, apiUrl: string, provider: string) {
    const tokenUrl = `https://${process.env.NEXT_AUTH_MICROSOFT_ENTRA_ID_ISSUER}.ciamlogin.com/${process.env.NEXT_AUTH_MICROSOFT_ENTRA_ID_ISSUER}/oauth2/v2.0/token`;

    let clientId, clientSecret, formData;

    if (provider === "credentials") {
        // 🔄 Public clients should NOT send client_secret
        clientId = process.env.NEXT_NATIVE_USER_READ_CLIENT_ID || '';
        formData = new URLSearchParams({
            client_id: clientId,
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            scope: process.env.NEXT_AUTH_MICROSOFT_ENTRA_ID_USER_READ_SCOPE || '',
        });
    } else {
        // 🔄 Confidential clients must send client_secret
        clientId = process.env.NEXT_AUTH_MICROSOFT_ENTRA_ID_ID || '';
        clientSecret = process.env.NEXT_AUTH_MICROSOFT_ENTRA_ID_SECRET || '';

        formData = new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            scope: process.env.NEXT_AUTH_MICROSOFT_ENTRA_ID_USER_READ_SCOPE || '',
        });
    }

    try {
        console.log(`Requesting new token for provider: ${provider}...`);

        const tokenResponse = await fetch(tokenUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData,
        });

        const tokenData = await tokenResponse.json();
        if (!tokenResponse.ok) {
            console.error('Failed to fetch new token:', tokenData);
            throw new Error(`Failed to get new access token: ${tokenData.error_description || tokenResponse.statusText}`);
        }

        const newAccessToken = tokenData.access_token;
        console.log('New Access Token:', newAccessToken);

        const headers = {
            Authorization: `Bearer ${newAccessToken}`,
        };

        console.log('Making API request with headers:', headers);

        const apiResponse = await fetch(apiUrl, {
            method: 'GET',
            headers,
        });

        const apiData = await apiResponse.json();
        if (!apiResponse.ok) {
            console.error('API Error:', apiData);
            throw new Error(`API call failed: ${apiResponse.statusText}`);
        }

        console.log('API Response:', apiData);

        return {
            newAccessToken,
            headers,
            apiResponse: apiData,
        };
    } catch (error) {
        console.error('Error in callApiWithNewToken:', error);
        throw error;
    }
}
