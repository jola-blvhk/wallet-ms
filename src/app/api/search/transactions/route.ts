import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    const response = await axios.post(
      "https://sandbox-0.blnkfinance.com/search/transactions",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error searching transactions:", error);
    return NextResponse.json(
      { error: "Failed to search transactions" },
      { status: 500 }
    );
  }
}
