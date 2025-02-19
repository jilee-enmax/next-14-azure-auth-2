import { NextResponse } from "next/server";

const RESET_START_API_URL = "https://enmaxentradev.ciamlogin.com/enmaxentradev.onmicrosoft.com/resetpassword/v1.0/start";
const RESET_CHALLENGE_API_URL = "https://enmaxentradev.ciamlogin.com/enmaxentradev.onmicrosoft.com/resetpassword/v1.0/challenge";
const RESET_CONTINUE_API_URL = "https://enmaxentradev.ciamlogin.com/enmaxentradev.onmicrosoft.com/resetpassword/v1.0/continue";
const RESET_SUBMIT_API_URL = "https://enmaxentradev.ciamlogin.com/enmaxentradev.onmicrosoft.com/resetpassword/v1.0/submit";

const CLIENT_ID = process.env.NEXT_NATIVE_USER_READ_CLIENT_ID ?? "";  //abec5fa7-5671-4523-abe1-3d4a4aa2e779;


// ✅ Fix: Use named export instead of default
export async function POST(req: Request) {
  try {
    const { username, continuation_token, oob, new_password, step } = await req.json();
    let apiUrl = "";
    let body = new URLSearchParams(); // ✅ Correct format

    if (step === 1) {
      console.log("🔹 Step 1: Initiating Password Reset for:", username);
      apiUrl = RESET_START_API_URL;
      body.append("client_id", CLIENT_ID);
      body.append("username", username);
      body.append("challenge_type", "password oob redirect");

    } else if (step === 2) {
      console.log("🔹 Step 2: Requesting OTP Challenge for Token:", continuation_token);
      apiUrl = RESET_CHALLENGE_API_URL;
      body.append("client_id", CLIENT_ID);
      body.append("continuation_token", continuation_token);
      body.append("challenge_type", "oob redirect");

    } else if (step === 3) {
      console.log("🔹 Step 3: Verifying OTP for Token:", continuation_token);
      apiUrl = RESET_CONTINUE_API_URL;
      body.append("client_id", CLIENT_ID);
      body.append("continuation_token", continuation_token);
      body.append("grant_type", "oob");
      body.append("oob", oob);

    } else if (step === 4) {
      console.log("🔹 Step 4: Submitting New Password for Token:", continuation_token);
      
      if (!continuation_token || !new_password) {
        console.error("❌ Missing required fields for password reset.");
        return NextResponse.json({ error: "Missing continuation token or new password." }, { status: 400 });
      }

      apiUrl = RESET_SUBMIT_API_URL;
      body.append("client_id", CLIENT_ID);
      body.append("continuation_token", continuation_token);
      body.append("new_password", new_password);

      console.log("📨 Sending final password reset request...");

    } else {
      console.error("❌ Invalid Step:", step);
      return NextResponse.json({ error: "Invalid step." }, { status: 400 });
    }

    // ✅ Send API Request
    console.log(`🔄 Calling API: ${apiUrl}`);
    console.log("📌 Request Body:", body.toString());

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" }, // ✅ Fix Content-Type
      body: body.toString(),
    });

    const data = await res.json();
    console.log("📌 API Response:", data);

    if (!res.ok) {
      console.error(`❌ API Error: ${res.status} - ${data.error_description || "Request failed."}`);
      return NextResponse.json({ error: `Error: ${res.status} - ${data.error_description || "Request failed."}` }, { status: res.status });
    }

    console.log(`✅ Success: Step ${step} completed.`);
    return NextResponse.json(data, { status: 200 });

  } catch (error: any) {
    console.error('❌ Error in password reset flow:', error);
    return NextResponse.json({ error: error.message || "Internal Server Error." }, { status: 500 });
  }
}
