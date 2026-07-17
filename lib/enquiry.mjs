export const CONTACT_NUMBER = "971549957255";

export const ALLOWED_DURATIONS = new Set([
  "Daily rental",
  "Weekly rental",
  "Monthly rental",
  "Long-term fleet plan"
]);

export const ALLOWED_DELIVERY_POINTS = new Set([
  "Dubai hotel or residence",
  "DXB airport terminal",
  "Private villa",
  "Office or event venue",
  "Collection from POF Rental"
]);

export function clean(value, maxLength) {
  return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

export function isCalendarDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day;
}

export function parseEnquiry(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Invalid request body" };
  }

  const enquiry = {
    vehicle: clean(body.vehicle, 100),
    duration: clean(body.duration, 40),
    delivery: clean(body.delivery, 80),
    date: clean(body.date, 10),
    note: clean(body.note, 320)
  };

  if (!enquiry.vehicle || !ALLOWED_DURATIONS.has(enquiry.duration) || !ALLOWED_DELIVERY_POINTS.has(enquiry.delivery)) {
    return { error: "Please complete the required enquiry fields" };
  }
  if (enquiry.date && !isCalendarDate(enquiry.date)) {
    return { error: "Invalid preferred date" };
  }
  return { enquiry };
}

export function createWhatsAppUrl(enquiry) {
  const lines = [
    "Hello POF Rental, I would like to prepare a private rental enquiry.",
    "",
    `Vehicle: ${enquiry.vehicle}`,
    `Plan: ${enquiry.duration}`,
    `Delivery: ${enquiry.delivery}`,
    `Preferred date: ${enquiry.date || "To be confirmed"}`
  ];
  if (enquiry.note) lines.push(`Additional detail: ${enquiry.note}`);
  lines.push("", "Please confirm availability and the final rate.");
  return `https://wa.me/${CONTACT_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}
