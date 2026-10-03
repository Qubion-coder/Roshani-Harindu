import React, { useState, useEffect } from "react";

export default function WishesForm() {
  const endpoint = "https://script.google.com/macros/s/AKfycbwqRCrWEX9LDmBvjvBJ1_uK2WpxrrkHKH-Av-w75iVWbLZpdGJ190vZVnKa8RurNxItpA/exec";

  const [name, setName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Auto-detect name from URL
    const urlParams = new URLSearchParams(window.location.search);
    let guestName = urlParams.get('guest');
    if (!guestName && window.location.pathname.length > 1) {
      const rawPath = decodeURIComponent(window.location.pathname.replace(/^\//, ''));
      if (!rawPath.startsWith('admin') && !rawPath.startsWith('confirm')) {
        guestName = rawPath;
      }
    }
    if (guestName) {
      setName(guestName);
    }
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }

    if (!message.trim()) {
      setErrorMessage("Please enter your message.");
      return;
    }

    // Since we don't have a backend yet, we'll just mock the success state if no endpoint is defined.
    // If you add a real endpoint to .env, it will use that.
    if (!endpoint) {
      setSubmitting(true);
      setTimeout(() => {
        setSuccessMessage("Your wishes have been saved. Thank you!");
        setMessage(""); // Clear the message on success
        setSubmitting(false);
      }, 1000);
      return;
    }

    const payload = {
      _sheetName: "Wish",
      name: name.trim(),
      message: message.trim(),
      submittedAt: new Date().toISOString(),
    };

    setSubmitting(true);
    try {
      await fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload),
      });
      setSuccessMessage("Your wishes have been saved. Thank you!");
      setMessage(""); // Clear the message on success
    } catch {
      setErrorMessage("Could not submit wishes. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={submit} className="space-y-4 px-2">
        <div>
          <input
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            placeholder="Your Name"
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-base text-[#1A1A1A] font-serif outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
          />
        </div>

        <div>
          <textarea
            value={message}
            onChange={(ev) => setMessage(ev.target.value)}
            placeholder="Write your wishes for the couple..."
            rows={4}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-base text-[#1A1A1A] font-serif outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] resize-none"
          />
        </div>

        {errorMessage && <p className="text-[12px] text-red-600 font-semibold">{errorMessage}</p>}
        {successMessage && <p className="text-[12px] text-[#D4AF37] font-bold">{successMessage}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#1A1A1A] text-white py-3.5 rounded-xl text-[12px] uppercase tracking-widest font-bold disabled:opacity-60 shadow-md transition-colors hover:bg-black mt-2"
        >
          {submitting ? "Sending..." : "Send Wishes"}
        </button>
      </form>
    </div>
  );
}
