import { NextRequest, NextResponse } from "next/server";
import { config } from "@/config/config";

export async function POST(req: NextRequest) {
  const { system_message } = await req.json();

  try {
    const res = await fetch(`${config.API_URL}/chat/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ system_message }),
    });

    if (!res.ok) {
      console.error("FastAPI error:", await res.text());
      return NextResponse.json(
        { error: "FastAPI call failed" },
        { status: res.status },
      );
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
