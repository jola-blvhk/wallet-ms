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
        ? process.env.MAIN_WALLET_LEDGER_ID // Main wallet ledger ID from env
        : process.env.CARD_WALLET_LEDGER_ID; // Card wallet ledger ID from env

    if (!ledgerId) {
      console.error(
        `Missing environment variable for ${walletType} wallet ledger ID`
      );
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

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
