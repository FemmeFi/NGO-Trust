import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ address: string }> }) {
  try {
    const { address } = await params;
    const apiKey = process.env.ETHERSCAN_API_KEY || "VICUEVRX3ZUIMUDWVJMN8N1X8IR12XN7J1";

    console.log("=== API ROUTE DEBUG ===");
    console.log("Fetching transactions for address:", address);
    console.log("Address length:", address.length);
    console.log("Address starts with 0x:", address.startsWith("0x"));
    console.log("API key from env:", process.env.ETHERSCAN_API_KEY);
    console.log("Using API key:", apiKey);
    console.log("========================");

    // Validate address format
    if (!address.startsWith("0x") || address.length !== 42) {
      return NextResponse.json({
        success: false,
        error: "Invalid address format",
        transactions: [],
      });
    }

    const url = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`;
    console.log("API URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "NGO-Trust-App/1.0",
      },
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`Etherscan API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Etherscan API response:", data);

    if (data.status === "1") {
      return NextResponse.json({
        success: true,
        transactions: data.result || [],
        count: data.result?.length || 0,
      });
    } else {
      console.log("Etherscan API returned error:", data.message);

      // If no transactions found on Sepolia, try mainnet as fallback
      if (data.message === "No transactions found") {
        console.log("No transactions on Sepolia, trying mainnet...");
        try {
          const mainnetUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`;
          const mainnetResponse = await fetch(mainnetUrl);
          const mainnetData = await mainnetResponse.json();
          console.log("Mainnet response:", mainnetData);

          if (mainnetData.status === "1") {
            return NextResponse.json({
              success: true,
              transactions: mainnetData.result || [],
              count: mainnetData.result?.length || 0,
              network: "mainnet",
            });
          }
        } catch (mainnetError) {
          console.log("Mainnet check failed:", mainnetError);
        }
      }

      return NextResponse.json({
        success: false,
        error: data.message || "Unknown error from Etherscan API",
        transactions: [],
      });
    }
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        transactions: [],
      },
      { status: 500 },
    );
  }
}
