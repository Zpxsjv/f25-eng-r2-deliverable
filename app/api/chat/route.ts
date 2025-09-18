import { NextResponse } from "next/server";

import {
  SPECIES_CHAT_FALLBACK_RESPONSE,
  generateResponse,
} from "@/lib/services/species-chat";

// defines shape of JSON payload the API expects (could be unknown)
type ChatRequestBody = {
  message?: unknown;
};


export async function POST(request: Request) {
  let body: ChatRequestBody;

// reads and parses the JSON (from user message), then casts for the right interface
  try {
    body = (await request.json()) as ChatRequestBody;
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

// pull out message, if string then trim, but if anything fails, default to empty string
  const message = typeof body.message === "string" ? body.message.trim() : "";

// return error if empty
  if (!message) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

// calls API server
  const response = await generateResponse(message);
// if chat fails send 502 error (bad gateway)
  if (response === SPECIES_CHAT_FALLBACK_RESPONSE) {
    return NextResponse.json({ response }, { status: 502 });
  }

  return NextResponse.json({ response }, { status: 200 });
}
