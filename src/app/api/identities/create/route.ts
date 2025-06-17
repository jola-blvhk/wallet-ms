import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, country } = body;

    // Create identity in Blnk
    const response = await axios.post(
      "https://sandbox-0.blnkfinance.com/identities",
      {
        first_name: firstName,
        last_name: lastName,
        email,
        country,
        phone,
        type: "individual",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error creating identity:", error);
    return NextResponse.json(
      { error: "Failed to create identity" },
      { status: 500 }
    );
  }
}
