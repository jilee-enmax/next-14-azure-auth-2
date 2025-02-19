export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    console.log("🔄 Backend received authentication request for:", username);

    if (!username || !password) {
      return new Response(
        JSON.stringify({ error: "Missing username or password" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const clientId = "abec5fa7-5671-4523-abe1-3d4a4aa2e779"; // Ensure this is correct

    // 🔹 Step 1: Initiate Authentication
    console.log("🔄 Step 1: Initiating Authentication with client_id:", clientId);

    const initiateResponse = await fetch(
      "https://enmaxentradev.ciamlogin.com/enmaxentradev.onmicrosoft.com/oauth2/v2.0/initiate",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: clientId,
          username: username,
          challenge_type: "password redirect",
        }).toString(),
      }
    );

    if (!initiateResponse.ok) {
      console.error("❌ Step 1 Failed:", initiateResponse.status, await initiateResponse.text());
      return new Response(
        JSON.stringify({ error: "Step 1: Initiation failed", status: initiateResponse.status }),
        { status: initiateResponse.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const initiateData = await initiateResponse.json();
    console.log("✅ Step 1 Response:", initiateData);

    if (!initiateData.continuation_token) {
      console.error("❌ Step 1: Missing continuation token");
      return new Response(
        JSON.stringify({ error: "Step 1: Missing continuation token" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 🔹 Step 2: Request Challenge
    console.log("🔄 Step 2: Requesting Challenge...");

    const challengeResponse = await fetch(
      "https://enmaxentradev.ciamlogin.com/enmaxentradev.onmicrosoft.com/oauth2/v2.0/challenge",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: clientId,
          continuation_token: initiateData.continuation_token,
          challenge_type: "password redirect",
        }).toString(),
      }
    );

    if (!challengeResponse.ok) {
      console.error("❌ Step 2 Failed:", challengeResponse.status, await challengeResponse.text());
      return new Response(
        JSON.stringify({ error: "Step 2: Challenge request failed", status: challengeResponse.status }),
        { status: challengeResponse.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const challengeData = await challengeResponse.json();
    console.log("✅ Step 2 Response:", challengeData);

    if (!challengeData.continuation_token) {
      console.error("❌ Step 2: Missing continuation token");
      return new Response(
        JSON.stringify({ error: "Step 2: Missing continuation token" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 🔹 Step 3: Get Access Token
    console.log("🔄 Step 3: Getting Access Token...");

    const tokenResponse = await fetch(
      "https://enmaxentradev.ciamlogin.com/enmaxentradev.onmicrosoft.com/oauth2/v2.0/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: clientId,
          password: password,
          continuation_token: challengeData.continuation_token,
          grant_type: "password",
          scope: "openid profile email offline_access User.Read", // ✅ Ensure `email` is requested
        }).toString(),
      }
    );

    if (!tokenResponse.ok) {
      console.error("❌ Step 3 Failed:", tokenResponse.status, await tokenResponse.text());
      return new Response(
        JSON.stringify({ error: "Step 3: Token request failed", status: tokenResponse.status }),
        { status: tokenResponse.status, headers: { "Content-Type": "application/json" } }
      );
    }

    let tokenData;
    try {
      tokenData = await tokenResponse.json();
    } catch (parseError) {
      console.error("❌ Step 3: Failed to parse token response", parseError);
      return new Response(
        JSON.stringify({ error: "Step 3: Invalid JSON response from token endpoint" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("✅ Step 3 Response:", tokenData);

    if (!tokenData.access_token) {
      console.error("❌ Step 3: Missing access token");
      return new Response(
        JSON.stringify({ error: "Step 3: Missing access token" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // ✅ Check for id_token (Extract User Details)
    if (!tokenData.id_token) {
      console.warn("⚠️ Warning: No id_token received.");
    }

    return new Response(
      JSON.stringify({
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token ?? null, // Ensure null if missing
        id_token: tokenData.id_token ?? null,
        expires_in: tokenData.expires_in ?? 3600,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("❌ Error in API Route:", error);

    let errorMessage = "Internal server error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
