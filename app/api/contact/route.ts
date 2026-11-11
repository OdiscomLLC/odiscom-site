import { NextResponse } from "next/server";
import { Resend } from "resend";

type ContactPayload = {
  name?: string;
  email?: string;
  company?: string;
  details?: string;
  projectDetails?: string;
  contactPerson?: string;
  website?: string;
  phone?: string;
  location?: string;
  service?: string;
  timeline?: string;
};

function clean(value: unknown, maxLength = 12000) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(req: Request) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      return NextResponse.json(
        { error: "Email service is not configured on the server." },
        { status: 500 }
      );
    }

    let body: ContactPayload;
    try {
      const parsed = await req.json();
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Invalid payload");
      body = parsed as ContactPayload;
    } catch {
      return NextResponse.json({ error: "Please submit a valid inquiry." }, { status: 400 });
    }

    const name = clean(body.name, 200);
    const email = clean(body.email, 320);
    const company = clean(body.company, 300);
    const contactPerson = clean(body.contactPerson, 100) || "Bret";
    const projectDetails = clean(body.details) || clean(body.projectDetails);
    const website = clean(body.website, 500);

    const phone = clean(body.phone, 80);
    const location = clean(body.location, 200);
    const service = clean(body.service, 200);
    const timeline = clean(body.timeline, 200);

    if (website) {
      return NextResponse.json({ success: true });
    }

    if (!name || !email || !projectDetails) {
      return NextResponse.json(
        { error: "Name, email, and project details are required." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const resend = new Resend(resendApiKey);
    const fallbackTo = process.env.CONTACT_TO || "owners@odiscom.com";

    const contactMap: Record<string, string> = {
      Bret: process.env.CONTACT_TO_BRET || "bret.bachert@odiscom.com",
      Jeff: process.env.CONTACT_TO_JEFF || fallbackTo,
      Jacob: process.env.CONTACT_TO_JACOB || fallbackTo,
      Royce: process.env.CONTACT_TO_ROYCE || fallbackTo,
      Carolyn: process.env.CONTACT_TO_CAROLYN || fallbackTo,
      "General Team": fallbackTo,
    };

    const contactTo = Object.prototype.hasOwnProperty.call(contactMap, contactPerson) ? contactMap[contactPerson] : fallbackTo;
    const from = process.env.CONTACT_FROM || "Odiscom Website <admin@odiscom.com>";
    const subject = `New Odiscom Project Inquiry from ${name}`;

    const text = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Company: ${company || "Not provided"}`,
      `Phone: ${phone || "Not provided"}`,
      `Project Location: ${location || "Not provided"}`,
      `Service: ${service || "Not specified"}`,
      `Target Schedule: ${timeline || "Not provided"}`,
      `Requested Contact: ${contactPerson}`,
      `Deliver To: ${contactTo}`,
      "",
      "Project Details:",
      projectDetails,
    ].join("\n");

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
        <h2 style="margin-bottom: 16px;">New Odiscom Project Inquiry</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Company:</strong> ${escapeHtml(company || "Not provided")}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone || "Not provided")}</p>
        <p><strong>Project Location:</strong> ${escapeHtml(location || "Not provided")}</p>
        <p><strong>Service:</strong> ${escapeHtml(service || "Not specified")}</p>
        <p><strong>Target Schedule:</strong> ${escapeHtml(timeline || "Not provided")}</p>
        <p><strong>Requested Contact:</strong> ${escapeHtml(contactPerson)}</p>
        <p><strong>Deliver To:</strong> ${escapeHtml(contactTo)}</p>
        <p><strong>Project Details:</strong></p>
        <div style="white-space: pre-wrap; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px; background: #f8fafc;">
          ${escapeHtml(projectDetails)}
        </div>
      </div>
    `;

    const sendResult = await resend.emails.send({
      from,
      to: [contactTo],
      replyTo: email,
      subject,
      text,
      html,
    });

    if (sendResult.error) {
      console.error("Resend send error:", sendResult.error);
      return NextResponse.json(
        { error: "Something went wrong while sending your inquiry." },
        { status: 500 }
      );
    }

    const confirmationResult = await resend.emails.send({
      from,
      to: [email],
      subject: "We received your inquiry - Odiscom",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
          <h2 style="margin-bottom: 16px;">Thank you for contacting Odiscom</h2>
          <p>Hi ${escapeHtml(name)},</p>
          <p>We received your inquiry and our team will review it shortly.</p>
          <p><strong>Requested Contact:</strong> ${escapeHtml(contactPerson)}</p>
          <p><strong>Submitted Company:</strong> ${escapeHtml(company || "Not provided")}</p>
          <p style="margin-top: 20px;">Thank you,<br />Odiscom</p>
        </div>
      `,
      text: [
        `Hi ${name},`,
        "",
        "We received your inquiry and our team will review it shortly.",
        `Requested Contact: ${contactPerson}`,
        `Submitted Company: ${company || "Not provided"}`,
        "",
        "Thank you,",
        "Odiscom",
      ].join("\n"),
    });

    if (confirmationResult.error) {
      console.error("Resend confirmation send error:", confirmationResult.error);
    }

    return NextResponse.json({ success: true, confirmationSent: !confirmationResult.error });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Something went wrong while sending your inquiry." },
      { status: 500 }
    );
  }
}
