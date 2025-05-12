import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(
  req,
  context
) {
  try {
    const identityId = context.params.id;

    if (!identityId) {
      return NextResponse.json(
        { error: "Identity ID is required" },
        { status: 400 }
      );
    }

    // Get identity from Blnk API
    const response = await axios.get(
      `https://sandbox-0.blnkfinance.com/identities/${identityId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Return the identity data
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching identity:", error);

    // Handle different error types
    if (error.response?.status === 404) {
      return NextResponse.json(
        { error: "Identity not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch identity" },
      { status: 500 }
    );
  }
}
