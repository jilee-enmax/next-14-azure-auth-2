import { NextRequest, NextResponse } from "next/server";
import validator from "validator";

type RegisterRequestBody = {
  associated_account: {
    accounts: [
      {
        account: {
          account_no: string;
          phone_number?: string;
          site_id?: string;
        };
      }
    ];
  };
  password: string;
  username: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { account_no, site_id, phone_number, username, password } = body;

    // Validate required fields
    if (!account_no || !validator.isNumeric(account_no)) {
      return NextResponse.json(
        { success: false, error: { message: "Invalid account number." } },
        { status: 400 }
      );
    }

    if (
      (!phone_number || !validator.isMobilePhone(phone_number)) &&
      (!site_id || !validator.isNumeric(site_id))
    ) {
      return NextResponse.json(
        { success: false, error: { message: "Invalid phone number or site ID." } },
        { status: 400 }
      );
    }

    if (!username || username.length < 6) {
      return NextResponse.json(
        { success: false, error: { message: "Username must be at least 6 characters." } },
        { status: 400 }
      );
    }

    if (!password || password.length < 8) {
      return NextResponse.json(
        { success: false, error: { message: "Password must be at least 8 characters." } },
        { status: 400 }
      );
    }

    // https://ciamexternalqa.cloudenmax.com/enmax/entraid/api/v1.3/user/register/entraid
    const fullRegisterUrl = process.env.NEXT_PUBLIC_REGISTER_ACCOUNT_FULL_URL;

    if (!fullRegisterUrl) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message:
              "Missing required environment variable: NEXT_PUBLIC_REGISTER_ACCOUNT_FULL_URL.",
          },
        },
        { status: 500 }
      );
    }

    const headers = {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    };

    const registerBody: RegisterRequestBody = {
      associated_account: {
        accounts: [
          {
            account: {
              account_no,
              phone_number: phone_number || "",
              site_id: site_id || "",
            },
          },
        ],
      },
      password,
      username,
    };

    console.log("Payload:", JSON.stringify(registerBody, null, 2));

    // Pass the validated URL to fetch
    const response = await fetch(fullRegisterUrl as string, {
      method: "POST",
      headers,
      body: JSON.stringify(registerBody),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: { message: data.message || "Registration failed." } },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    console.error("Error in registration handler:", error?.message || error);
    return NextResponse.json(
      { success: false, error: { message: "An unexpected error occurred." } },
      { status: 500 }
    );
  }
}

