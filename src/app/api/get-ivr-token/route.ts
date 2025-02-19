export async function POST(req: Request) {
    try {
      // Load environment variables
      const clientId = process.env.NEXT_APPLICATION_READ_CLIENT_ID; //8bd8d04c
      const clientSecret = process.env.NEXT_APPLICATION_READ_CLIENT_SECRET; //bO_8Q
      const tokenUrl = process.env.NEXT_AUTH_MICROSOFT_ENTRA_TOKEN_URL; //https://login.microsoftonline.com/0267b868-ac0c-495f-85ad-ef765bc3830a/oauth2/v2.0/token
      const scope = process.env.NEXT_AUTH_MICROSOFT_ENTRA_ID_APP_IVR_READ_SCOPE; //api://8bd8d04c-2835-4ace-b8be-d0e575597b4c/.default
  
      // Ensure all required env variables are set
      if (!clientId || !clientSecret || !tokenUrl || !scope) {
        return new Response(JSON.stringify({ error: "Missing environment variables" }), { status: 500 });
      }
  
      // Fetch token
      const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          scope: scope,
          client_id: clientId,
          client_secret: clientSecret,
        }),
      });
  
      if (!response.ok) {
        return new Response(JSON.stringify({ error: "Failed to fetch token" }), { status: response.status });
      }
  
      const data = await response.json();
      return new Response(JSON.stringify(data), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
  }
  