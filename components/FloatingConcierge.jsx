"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { contactPhone, wa } from "../lib/site-data";

const welcomeMessage = {
  id: "welcome",
  role: "bot",
  text: "Welcome to POF Rental. I can help with vehicles, current rates, Dubai delivery, and longer rental plans."
};

const topics = [
  {
    id: "fleet",
    label: "Choose a car",
    prompt: "Which cars can I rent?",
    reply: "The current edit includes the Porsche 911 GT3 RS, Ferrari Purosangue, Ferrari 12 Cilindri, Range Rover Autobiography, and Mercedes-AMG G63. Availability is confirmed for your dates."
  },
  {
    id: "rates",
    label: "Daily rates",
    prompt: "What are the current daily rates?",
    reply: "Featured daily rates currently start from AED 1,899. The final rate depends on the vehicle, rental dates, duration, and delivery point."
  },
  {
    id: "delivery",
    label: "DXB delivery",
    prompt: "Can you deliver to DXB?",
    reply: "Yes. POF Rental supports DXB, hotel, residence, and office delivery with a prepared concierge handover."
  },
  {
    id: "plans",
    label: "Monthly rental",
    prompt: "Do you offer monthly rentals?",
    reply: "Yes. Weekly, monthly, and long-term plans are available. The concierge will match the vehicle and rate to your stay."
  }
];

function ChatIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M5.5 5.5h13v9h-7.2L7 18v-3.5H5.5z" />
      <path d="M8.5 9h7M8.5 12h4.5" />
    </svg>
  );
}

export default function FloatingConcierge() {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState([welcomeMessage]);
  const [handoff, setHandoff] = useState("I would like help choosing and booking a luxury car in Dubai.");
  const messageIndex = useRef(0);
  const triggerRef = useRef(null);
  const closeRef = useRef(null);
  const messagesRef = useRef(null);

  const whatsappUrl = useMemo(
    () => wa(`Hello POF Rental, I am contacting you from the website concierge. ${handoff}`),
    [handoff]
  );

  useEffect(() => {
    if (!open) return undefined;
    closeRef.current?.focus();

    const closeOnEscape = (event) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  useEffect(() => {
    if (!open || !messagesRef.current) return;
    messagesRef.current.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const addExchange = (prompt, reply) => {
    messageIndex.current += 1;
    const index = messageIndex.current;
    setMessages((current) => [
      ...current,
      { id: `user-${index}`, role: "user", text: prompt },
      { id: `bot-${index}`, role: "bot", text: reply }
    ]);
    setHandoff(prompt);
  };

  const chooseTopic = (topic) => {
    addExchange(topic.prompt, topic.reply);
  };

  const submitMessage = (event) => {
    event.preventDefault();
    const message = draft.trim();
    if (!message) return;
    addExchange(
      message,
      "Your request is ready. Continue on WhatsApp and the POF concierge team can confirm the exact vehicle, rate, and timing."
    );
    setDraft("");
  };

  const togglePanel = () => {
    setOpen((current) => !current);
  };

  const closePanel = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <>
      <button
        aria-controls={panelId}
        aria-expanded={open}
        aria-label={open ? "Close POF digital concierge" : "Open POF digital concierge"}
        className={`floating-concierge-launcher${open ? " is-open" : ""}`}
        onClick={togglePanel}
        ref={triggerRef}
        type="button"
      >
        <span className="floating-concierge-icon"><ChatIcon /><i /></span>
        <span className="floating-concierge-label"><strong>{open ? "Close chat" : "Ask POF"}</strong><small>Digital concierge</small></span>
      </button>

      <section
        aria-hidden={!open}
        aria-label="POF digital concierge"
        className={`floating-concierge-panel${open ? " is-open" : ""}`}
        id={panelId}
        role="dialog"
      >
        <header className="floating-concierge-header">
          <span className="floating-concierge-monogram" aria-hidden="true">POF</span>
          <div><strong>Digital concierge</strong><small><i /> Instant guidance</small></div>
          <button aria-label="Close concierge" onClick={closePanel} ref={closeRef} tabIndex={open ? 0 : -1} type="button">x</button>
        </header>

        <div className="floating-concierge-context">
          <span>Dubai / Private mobility</span>
          <strong>How would you like to arrive?</strong>
        </div>

        <div aria-live="polite" className="floating-concierge-messages" ref={messagesRef}>
          {messages.map((message) => (
            <div className={`floating-concierge-message is-${message.role}`} key={message.id}>
              <span>{message.role === "bot" ? "POF" : "You"}</span>
              <p>{message.text}</p>
            </div>
          ))}
        </div>

        <div className="floating-concierge-topics">
          <span>Quick topics</span>
          <div>
            {topics.map((topic) => (
              <button key={topic.id} onClick={() => chooseTopic(topic)} tabIndex={open ? 0 : -1} type="button">{topic.label}</button>
            ))}
          </div>
        </div>

        <a className="floating-concierge-handoff" href={whatsappUrl} rel="noreferrer" tabIndex={open ? 0 : -1} target="_blank">
          <span>Continue on WhatsApp</span><b aria-hidden="true">Open</b>
        </a>

        <form className="floating-concierge-form" onSubmit={submitMessage}>
          <label className="sr-only" htmlFor={`${panelId}-message`}>Your rental request</label>
          <input
            id={`${panelId}-message`}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Ask about a car or arrival..."
            tabIndex={open ? 0 : -1}
            value={draft}
          />
          <button aria-label="Prepare message" disabled={!draft.trim()} tabIndex={open ? 0 : -1} type="submit">Send</button>
        </form>

        <a className="floating-concierge-call" href={`tel:${contactPhone}`} tabIndex={open ? 0 : -1}>Prefer to speak? Call POF Rental</a>
      </section>
    </>
  );
}
