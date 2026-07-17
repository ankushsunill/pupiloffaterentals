import test from "node:test";
import assert from "node:assert/strict";
import { POST } from "../app/api/enquiry/route.js";

const endpoint = "http://localhost/api/enquiry";
const validBody = {
  vehicle: "ferrari-purosangue",
  duration: "Daily rental",
  delivery: "Dubai hotel or residence",
  date: "2026-08-20",
  note: "Two passengers"
};

function request(body, headers = { "Content-Type": "application/json" }) {
  return new Request(endpoint, { method: "POST", headers, body });
}

test("enquiry route returns a non-cacheable WhatsApp handoff", async () => {
  const response = await POST(request(JSON.stringify(validBody)));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  const result = await response.json();
  assert.match(result.whatsappUrl, /^https:\/\/wa\.me\/971549957255/);
  assert.match(new URL(result.whatsappUrl).searchParams.get("text"), /Ferrari Purosangue/);
});

test("enquiry route rejects unsupported content types", async () => {
  const response = await POST(request(JSON.stringify(validBody), { "Content-Type": "text/plain" }));
  assert.equal(response.status, 415);
});

test("enquiry route rejects malformed JSON", async () => {
  const response = await POST(request("{broken"));
  assert.equal(response.status, 400);
});

test("enquiry route rejects unknown vehicles and invalid dates", async () => {
  const unknown = await POST(request(JSON.stringify({ ...validBody, vehicle: "invented-supercar" })));
  assert.equal(unknown.status, 400);
  const invalidDate = await POST(request(JSON.stringify({ ...validBody, date: "2026-02-30" })));
  assert.equal(invalidDate.status, 400);
});

test("enquiry route rejects declared oversized bodies", async () => {
  const response = await POST(request(JSON.stringify(validBody), {
    "Content-Type": "application/json",
    "Content-Length": "2049"
  }));
  assert.equal(response.status, 413);
});
