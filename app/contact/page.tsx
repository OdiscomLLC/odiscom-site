"use client";

import { FormEvent, useState } from "react";
import { serviceLinks } from "@/lib/service-navigation";

type FormState = {
  name: string;
  email: string;
  company: string;
  contactPerson: string;
  details: string;
  website: string;
  phone: string;
  location: string;
  service: string;
  timeline: string;
};

const initialForm: FormState = {
  name: "",
  email: "",
  company: "",
  contactPerson: "General Team",
  details: "",
  website: "",
  phone: "",
  location: "",
  service: "",
  timeline: "",
};

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setStatus("success");
      setMessage(data.confirmationSent ? "Your inquiry has been sent. A confirmation email is on the way." : "Your inquiry has been sent. Our team will follow up using the email address you provided.");
      setForm(initialForm);
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof Error ? err.message : "Failed to send your message."
      );
    }
  };

  return (
    <main className="bg-white py-16">
      <div className="mx-auto max-w-3xl px-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <h1 className="text-3xl font-semibold text-slate-900">Project Inquiry</h1>
          <p className="mt-3 text-lg text-slate-600">
            Tell us about your project, location, timeline and required deliverables.
          </p>

          <div className="mt-6 rounded-2xl bg-[#f0f7f7] p-5 leading-7 text-slate-700">
            <p className="font-semibold">Odiscom project inquiries</p>
            <p>Business development & project inquiries</p>
            <a href="mailto:info@odiscom.com" className="block break-words font-medium text-[#166e68]">info@odiscom.com</a>
            <a href="tel:+12814092686" className="block text-[#166e68]">(281) 409-2686</a>
            <p className="mt-3 text-sm">A&E: Odiscom LLC · Construction: Odiscom Construction LLC</p>
          </div>

          {status === "success" && (
            <div role="status" className="mt-8 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-green-800">
              <p className="text-base font-semibold">Inquiry sent successfully.</p>
              <p className="mt-1 text-sm">{message}</p>
            </div>
          )}

          {status === "error" && message && (
            <div role="alert" className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <input
              type="text"
              name="website"
              value={form.website}
              onChange={handleChange}
              autoComplete="off"
              tabIndex={-1}
              className="hidden"
              aria-hidden="true"
            />

            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-800">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                maxLength={200}
                required
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-600"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-800">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                maxLength={320}
                required
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-600"
              />
            </div>

            <div>
              <label htmlFor="company" className="mb-2 block text-sm font-medium text-slate-800">
                Company
              </label>
              <input
                autoComplete="organization"
                maxLength={300}
                id="company"
                name="company"
                type="text"
                value={form.company}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-600"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-medium text-slate-800">Phone (optional)</label>
                <input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={80} value={form.phone} onChange={handleChange} className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-teal-600" />
              </div>
              <div>
                <label htmlFor="location" className="mb-2 block text-sm font-medium text-slate-800">Project location / state</label>
                <input id="location" name="location" maxLength={200} value={form.location} onChange={handleChange} className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-teal-600" />
              </div>
              <div>
                <label htmlFor="service" className="mb-2 block text-sm font-medium text-slate-800">Service needed</label>
                <select id="service" name="service" value={form.service} onChange={handleChange} className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-teal-600">
                  <option value="">Select a service</option>
                  {serviceLinks.map(item => <option key={item.slug} value={item.name}>{item.name}</option>)}
                  <option value="Multiple services / other">Multiple services / other</option>
                </select>
              </div>
              <div>
                <label htmlFor="timeline" className="mb-2 block text-sm font-medium text-slate-800">Target schedule</label>
                <input id="timeline" name="timeline" maxLength={200} placeholder="Bid due date or delivery milestone" value={form.timeline} onChange={handleChange} className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-teal-600" />
              </div>
            </div>

            <div>
              <label
                htmlFor="contactPerson"
                className="mb-2 block text-sm font-medium text-slate-800"
              >
                Who should we connect you with?
              </label>
              <select
                id="contactPerson"
                name="contactPerson"
                value={form.contactPerson}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-600"
              >
                <option value="General Team">General Team — Project inquiries</option>
                <option value="Bret">Bret — Chief Operating Officer</option>
                <option value="Jeff">Jeff — Founder & CEO</option>
                <option value="Jacob">Jacob — President / Engineering</option>
                <option value="Carolyn">Carolyn</option>
              </select>
            </div>

            <div>
              <label htmlFor="details" className="mb-2 block text-sm font-medium text-slate-800">
                Project Details
              </label>
              <textarea
                id="details"
                name="details"
                required
                rows={6}
                maxLength={12000}
                placeholder="Scope, route or site information, required deliverables and any owner standards."
                value={form.details}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-600"
              />
            </div>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="inline-flex w-full items-center justify-center rounded-full bg-teal-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "submitting" ? "Sending..." : "Submit Inquiry"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
