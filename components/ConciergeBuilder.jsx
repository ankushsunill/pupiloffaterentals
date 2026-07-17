"use client";

import { useState } from "react";

const initialForm = {
  vehicle: "",
  duration: "Daily rental",
  delivery: "Dubai hotel or residence",
  date: "",
  note: ""
};

export default function ConciergeBuilder({ fleet }) {
  const [form, setForm] = useState(initialForm);
  const [state, setState] = useState("idle");
  const [whatsappUrl, setWhatsappUrl] = useState("");

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setWhatsappUrl("");
    setState("idle");
  };

  const prepareRequest = async (event) => {
    event.preventDefault();
    setState("loading");

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const result = await response.json();
      if (!response.ok || !result.whatsappUrl) throw new Error(result.error || "Unable to prepare request");
      setWhatsappUrl(result.whatsappUrl);
      setState("ready");
    } catch (_) {
      setState("error");
    }
  };

  return (
    <section className="concierge-builder" id="enquire">
      <div className="concierge-builder-intro">
        <p className="kicker">Private enquiry</p>
        <h2>Prepare the arrival before opening WhatsApp.</h2>
        <p>Select the essentials once. Your concierge receives a clear brief with the vehicle, timing, duration, and delivery point already aligned.</p>
        <div className="concierge-builder-index" aria-hidden="true"><span>01</span><span>Brief</span><span>02</span><span>Connect</span></div>
      </div>

      <form className="concierge-builder-form" onSubmit={prepareRequest}>
        <div className="concierge-field concierge-field-wide">
          <label htmlFor="enquiry-vehicle">Preferred vehicle</label>
          <select id="enquiry-vehicle" name="vehicle" onChange={updateField} required value={form.vehicle}>
            <option value="">Choose a model or ask for guidance</option>
            <option value="concierge-recommendation">Concierge recommendation</option>
            {fleet.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.label}</option>)}
          </select>
        </div>

        <div className="concierge-field">
          <label htmlFor="enquiry-duration">Rental plan</label>
          <select id="enquiry-duration" name="duration" onChange={updateField} value={form.duration}>
            <option>Daily rental</option>
            <option>Weekly rental</option>
            <option>Monthly rental</option>
            <option>Long-term fleet plan</option>
          </select>
        </div>

        <div className="concierge-field">
          <label htmlFor="enquiry-date">Preferred date</label>
          <input id="enquiry-date" name="date" onChange={updateField} type="date" value={form.date} />
        </div>

        <div className="concierge-field concierge-field-wide">
          <label htmlFor="enquiry-delivery">Delivery point</label>
          <select id="enquiry-delivery" name="delivery" onChange={updateField} value={form.delivery}>
            <option>Dubai hotel or residence</option>
            <option>DXB airport terminal</option>
            <option>Private villa</option>
            <option>Office or event venue</option>
            <option>Collection from POF Rental</option>
          </select>
        </div>

        <div className="concierge-field concierge-field-wide">
          <label htmlFor="enquiry-note">Additional detail <span>Optional</span></label>
          <textarea id="enquiry-note" maxLength="320" name="note" onChange={updateField} placeholder="Passengers, luggage, chauffeur, airport arrival time, or another request." rows="3" value={form.note} />
        </div>

        <div className="concierge-builder-submit">
          <button className="action action-primary" disabled={state === "loading"} type="submit">
            <span>{state === "loading" ? "Preparing request" : "Prepare request"}</span>
          </button>
          <p aria-live="polite">
            {state === "idle" && "No information is stored on this website."}
            {state === "loading" && "Preparing your private enquiry."}
            {state === "ready" && "Your request is ready to send."}
            {state === "error" && "The request could not be prepared. Please use the WhatsApp button below."}
          </p>
        </div>

        {whatsappUrl && (
          <a className="concierge-builder-whatsapp" href={whatsappUrl} rel="noreferrer" target="_blank">
            <span>Continue on WhatsApp</span><b aria-hidden="true">{"\u2197"}</b>
          </a>
        )}
      </form>
    </section>
  );
}
