import Cookies from "js-cookie"; 

// ✅ Helper function to decode JWT safely
function parseJwt(token: string) {
  try {
    if (!token) throw new Error("No token provided");
    const base64Url = token.split(".")[1];
    if (!base64Url) throw new Error("Invalid JWT format");

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(base64));
    
    console.log("✅ Decoded JWT:", decoded);
    return decoded;
  } catch (error) {
    console.error("❌ Failed to parse JWT:", error);
    return null;
  }
}

export async function signInWithNativeAuthAPI(
  username: string,
  password: string
): Promise<{ name: string; email: string; accessToken: string; refreshToken?: string; expiresIn?: number } | undefined> {
  try {
    console.log("🔄 Sending authentication request to backend:", username);

    // ✅ Ensure NEXTAUTH_URL is defined
    if (!process.env.NEXTAUTH_URL) {
      console.error("❌ Error: NEXTAUTH_URL is not defined.");
      return undefined;
    }

    console.log("🔍 BASE URL:", process.env.NEXTAUTH_URL);

    const apiUrl =
      typeof window === "undefined"
        ? `${process.env.NEXTAUTH_URL}/api/native-auth`
        : "/api/native-auth";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    // ✅ Ensure response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("❌ Expected JSON but received:", await response.text());
      return undefined;
    }

    const rawData = await response.json();
    console.log("✅ Successfully received token:", rawData);

    // ✅ Validate response fields
    if (!rawData.access_token || !rawData.id_token) {
      console.error("❌ Error: Response missing required fields.", rawData);
      return undefined;
    }

    // ✅ Extract name and email from id_token
    const decodedIdToken = parseJwt(rawData.id_token);
    if (!decodedIdToken) {
      console.error("❌ Error: Unable to decode ID token.");
      return undefined;
    }

    const name = decodedIdToken?.name || username; // Fallback to username
    const email = decodedIdToken?.email || decodedIdToken?.preferred_username || "";

    console.log(`✅ Extracted user details: Name=${name}, Email=${email}`);

    // ✅ Store tokens securely in Cookies
    Cookies.set("accessToken", rawData.access_token, { secure: true, sameSite: "Strict" });
    if (rawData.refresh_token) {
      Cookies.set("refreshToken", rawData.refresh_token, { secure: true, sameSite: "Strict" });
    }

    return {
      name,
      email,
      accessToken: rawData.access_token,
      refreshToken: rawData.refresh_token,
      expiresIn: rawData.expires_in,
    };
  } catch (error) {
    console.error("❌ Error during authentication:", error);
    return undefined;
  }
}
