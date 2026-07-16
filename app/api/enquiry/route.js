import { NextResponse } from "next/server";

const contactNumber = "971549957255";
const allowedDurations = new Set(["Daily rental", "Weekly rental", "Monthly rental", "Long-term fleet plan"]);
const allowedDeliveryPoints = new Set([
  "Dubai hotel or residence",
  "DXB airport terminal",
  "Private villa",
  "Office or event venue",
  "Collection from POF Rental"
]);

function clean(value, maxLength) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch (_) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const vehicle = clean(body.vehicle, 100);
  const duration = clean(body.duration, 40);
  const delivery = clean(body.delivery, 80);
  const date = clean(body.date, 10);
  const note = clean(body.note, 320);

  if (!vehicle || !allowedDurations.has(duration) || !allowedDeliveryPoints.has(delivery)) {
    return NextResponse.json({ error: "Please complete the required enquiry fields" }, { status: 400 });
  }
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid preferred date" }, { status: 400 });
  }

  const lines = [
    "Hello POF Rental, I would like to prepare a private rental enquiry.",
    "",
    `Vehicle: ${vehicle}`,
    `Plan: ${duration}`,
    `Delivery: ${delivery}`,
    `Preferred date: ${date || "To be confirmed"}`
  ];
  if (note) lines.push(`Additional detail: ${note}`);
  lines.push("", "Please confirm availability and the final rate.");

  const whatsappUrl = `https://wa.me/${contactNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
  return NextResponse.json({ whatsappUrl }, { headers: { "Cache-Control": "no-store" } });
}
