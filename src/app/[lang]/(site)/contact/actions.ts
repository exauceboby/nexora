"use server";

import nodemailer from "nodemailer";
import { headers } from "next/headers";
import { rateLimit } from "@/lib/rate-limit";
import { storeMessage } from "@/lib/message-store";

type ActionState =
  | { ok: true; message: string }
  | { ok: false; message: string };

function requiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getClientIp(): string | undefined {
  const h = headers();
  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim();
  return h.get("x-real-ip") ?? undefined;
}

export async function sendContact(
  lang: "fr" | "en",
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    // Honeypot (anti-bot) — champ caché
    const hp = String(formData.get("company") ?? "");
    if (hp.trim()) return { ok: false, message: "Blocked." };

    // Anti-burst: petit délai minimum implicite (si besoin plus tard)
    const ip = getClientIp();
    const ua = headers().get("user-agent") ?? undefined;

    // Rate-limit (IP + email) : 5 requêtes / 30 minutes
    const windowMs = 30 * 60 * 1000;
    const max = 5;

    if (ip) {
      const r1 = rateLimit({ key: `ip:${ip}`, windowMs, max });
      if (!r1.ok) {
        return {
          ok: false,
          message:
            lang === "en"
              ? "Too many requests. Please try again later."
              : "Trop de tentatives. Réessaie plus tard.",
        };
      }
    }

    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const subject = String(formData.get("subject") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name || !subject || !message) {
      return {
        ok: false,
        message:
          lang === "en"
            ? "Please fill the required fields."
            : "Veuillez remplir les champs obligatoires.",
      };
    }

    if (email && !isEmail(email)) {
      return {
        ok: false,
        message:
          lang === "en" ? "Invalid email address." : "Adresse email invalide.",
      };
    }

    if (email) {
      const r2 = rateLimit({ key: `email:${email.toLowerCase()}`, windowMs, max });
      if (!r2.ok) {
        return {
          ok: false,
          message:
            lang === "en"
              ? "Too many requests. Please try again later."
              : "Trop de tentatives. Réessaie plus tard.",
        };
      }
    }

    // Stockage (append-only)
    await storeMessage({
      lang,
      ip,
      ua,
      name,
      phone: phone || undefined,
      email: email || undefined,
      subject,
      message,
    });

    // SMTP env
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

    const adminText = [
      `NEXORA Contact Form (${lang.toUpperCase()})`,
      "",
      `Name: ${name}`,
      `Phone: ${phone || "-"}`,
      `Email: ${email || "-"}`,
      `Subject: ${subject}`,
      `IP: ${ip || "-"}`,
      "",
      "Message:",
      message,
    ].join("\n");

    // 1) Email vers NEXORA (admin)
    await transporter.sendMail({
      from: `"${safeFromName}" <${MAIL_FROM}>`,
      to: MAIL_TO,
      replyTo: email || undefined,
      subject: `[NEXORA] ${safeSubject}`,
      text: adminText,
    });

    // 2) Auto-réponse client (si email fourni)
    if (email) {
      const clientSubject =
        lang === "en"
          ? "We received your message — NEXORA"
          : "Nous avons bien reçu votre message — NEXORA";

      const clientText =
        lang === "en"
          ? [
              `Hello ${name},`,
              "",
              "Thanks for contacting NEXORA TECHNOLOGIES & NETWORKS.",
              "We have received your message and will reply as soon as possible.",
              "",
              "Summary:",
              `Subject: ${subject}`,
              "",
              "— NEXORA",
            ].join("\n")
          : [
              `Bonjour ${name},`,
              "",
              "Merci d’avoir contacté NEXORA TECHNOLOGIES & NETWORKS.",
              "Nous avons bien reçu votre message et nous vous répondrons rapidement.",
              "",
              "Récapitulatif :",
              `Sujet : ${subject}`,
              "",
              "— NEXORA",
            ].join("\n");

      await transporter.sendMail({
        from: `"NEXORA TECHNOLOGIES & NETWORKS" <${MAIL_FROM}>`,
        to: email,
        subject: clientSubject,
        text: clientText,
      });
    }

    return {
      ok: true,
      message:
        lang === "en"
          ? "Message sent. We’ll reply quickly."
          : "Message envoyé. Nous vous répondrons rapidement.",
    };
  } catch {
    return {
      ok: false,
      message:
        lang === "en"
          ? "Send failed. Please retry or contact us by phone/WhatsApp."
          : "Échec d’envoi. Réessaie ou contacte-nous par téléphone/WhatsApp.",
    };
  }
}
