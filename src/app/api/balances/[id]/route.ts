// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const balanceId = context.params.id;

    if (!balanceId) {
      return NextResponse.json(
        { error: "Balance ID is required" },
        { status: 400 }
      );
    }

    const response = await axios.get(
      `https://sandbox-0.blnkfinance.com/balances/${balanceId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching wallet balance:", error);
    return NextResponse.json(
      { error: "Failed to fetch wallet balance" },
      { status: 500 }
    );
  }
}
