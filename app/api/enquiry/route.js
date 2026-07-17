import { NextResponse } from "next/server.js";
import { createWhatsAppUrl, parseEnquiry } from "../../../lib/enquiry.mjs";

const MAX_BODY_BYTES = 2048;

export async function POST(request) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return NextResponse.json({ error: "Content-Type must be application/json" }, { status: 415 });
  }
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request body is too large" }, { status: 413 });
  }

  let body;
  try {
    body = await request.json();
  } catch (_) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const result = parseEnquiry(body);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
  const whatsappUrl = createWhatsAppUrl(result.enquiry);
  return NextResponse.json({ whatsappUrl }, { headers: { "Cache-Control": "no-store" } });
}
