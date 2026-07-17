import test from "node:test";
import assert from "node:assert/strict";
import { clean, createWhatsAppUrl, isCalendarDate, parseEnquiry } from "../lib/enquiry.mjs";

const validBody = { vehicle: "Ferrari Purosangue", duration: "Daily rental", delivery: "Dubai hotel or residence", date: "2026-08-20", note: "Two passengers" };

test("clean normalizes whitespace and limits length", () => {
  assert.equal(clean("  hello\n  Dubai  ", 20), "hello Dubai");
  assert.equal(clean("abcdef", 3), "abc");
});

test("calendar date validation rejects impossible dates", () => {
  assert.equal(isCalendarDate("2026-02-28"), true);
  assert.equal(isCalendarDate("2026-02-30"), false);
  assert.equal(isCalendarDate("not-a-date"), false);
});

test("parseEnquiry accepts and normalizes valid input", () => {
  const result = parseEnquiry({ ...validBody, note: "  Two\n passengers " });
  assert.equal(result.error, undefined);
  assert.equal(result.enquiry.note, "Two passengers");
});

test("parseEnquiry rejects invalid input", () => {
  assert.match(parseEnquiry(null).error, /Invalid/);
  assert.match(parseEnquiry({ ...validBody, duration: "Forever" }).error, /required/);
  assert.match(parseEnquiry({ ...validBody, date: "2026-02-30" }).error, /date/);
});

test("WhatsApp URL contains the encoded brief", () => {
  const { enquiry } = parseEnquiry(validBody);
  const url = createWhatsAppUrl(enquiry);
  assert.match(url, /^https:\/\/wa\.me\/971549957255\?text=/);
  const message = new URL(url).searchParams.get("text");
  assert.match(message, /Ferrari Purosangue/);
  assert.match(message, /Two passengers/);
});
