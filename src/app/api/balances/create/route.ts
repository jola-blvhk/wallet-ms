import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identityId, walletType = "main" } = body;

    if (!identityId) {
      return NextResponse.json(
        { error: "Identity ID is required" },
        { status: 400 }
      );
    }

    const ledgerId =
      walletType === "main"
        ? "ldg_890570ab-132a-40ea-9e68-04638595b6de" // Main wallet ledger ID
        : "ldg_ee91f684-e566-41b2-b3e6-9aa6b4e68398"; // Card wallet ledger ID

    const payload = {
      ledger_id: ledgerId,
      identity_id: identityId,
      currency: "USD",
    };

    // Create balance
    const response = await axios.post(
      "https://sandbox-0.blnkfinance.com/balances",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error creating wallet:", error);
    return NextResponse.json(
      { error: "Failed to create wallet" },
      { status: 500 }
    );
  }
}
