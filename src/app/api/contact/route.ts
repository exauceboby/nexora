import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

function requiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

type Payload = {
  lang: "fr" | "en";
  name: string;
  phone?: string;
  email?: string;
  subject: string;
  message: string;
  company?: string; // honeypot
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Payload;

    // honeypot anti-bot
    if ((body.company || "").trim()) {
      return NextResponse.json({ ok: false, message: "Blocked." }, { status: 400 });
    }

    const lang: "fr" | "en" = body.lang === "en" ? "en" : "fr";
    const name = String(body.name ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const email = String(body.email ?? "").trim();
    const subject = String(body.subject ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (!name || !subject || !message) {
      return NextResponse.json(
        {
          ok: false,
          message: lang === "en" ? "Please fill the required fields." : "Veuillez remplir les champs obligatoires.",
        },
        { status: 400 }
      );
    }

    if (email && !isEmail(email)) {
      return NextResponse.json(
        { ok: false, message: lang === "en" ? "Invalid email address." : "Adresse email invalide." },
        { status: 400 }
      );
    }

    // SMTP (Gmail SMTP OK)
    const SMTP_HOST = requiredEnv("SMTP_HOST");
    const SMTP_PORT = Number(requiredEnv("SMTP_PORT"));
    const SMTP_USER = requiredEnv("SMTP_USER");
    const SMTP_PASS = requiredEnv("SMTP_PASS");
    const MAIL_TO = requiredEnv("MAIL_TO");
    const MAIL_FROM = process.env.MAIL_FROM || SMTP_USER;

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const safeFromName = name.replace(/[\r\n]/g, " ").slice(0, 80);
    const safeSubject = subject.replace(/[\r\n]/g, " ").slice(0, 120);

    const text = [
      `NEXORA Contact Form (${lang.toUpperCase()})`,
      "",
      `Name: ${name}`,
      `Phone: ${phone || "-"}`,
      `Email: ${email || "-"}`,
      `Subject: ${subject}`,
      "",
      "Message:",
      message,
    ].join("\n");

    await transporter.sendMail({
      from: `"${safeFromName}" <${MAIL_FROM}>`,
      to: MAIL_TO,
      replyTo: email || undefined,
      subject: `[NEXORA] ${safeSubject}`,
      text,
    });

    return NextResponse.json(
      {
        ok: true,
        message: lang === "en" ? "Message sent. We’ll reply quickly." : "Message envoyé. Nous vous répondrons rapidement.",
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Erreur serveur. Réessaie ou contacte-nous par téléphone/WhatsApp.",
      },
      { status: 500 }
    );
  }
}
