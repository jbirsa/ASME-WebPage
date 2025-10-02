import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const stripControlChars = (value: string) => value.replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, "")

const sanitizePlainText = (value: string) => stripControlChars(value).replace(/[\r\n]+/g, " ").trim()

const sanitizeMultilineText = (value: string) => stripControlChars(value).trim()

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")

const sanitizeEmail = (value: string) => {
  const normalizedEmail = stripControlChars(value).trim()

  if (/\s/.test(normalizedEmail)) {
    throw new Error("Email inválido")
  }

  if (!emailRegex.test(normalizedEmail.toLowerCase())) {
    throw new Error("Email inválido")
  }

  return normalizedEmail
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()

    if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string") {
      return NextResponse.json({ error: "Formato inválido" }, { status: 400 })
    }

    if (!name.trim() || !email.trim() || !message.trim()) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 })
    }

    const safeNamePlain = sanitizePlainText(name)
    const safeEmail = sanitizeEmail(email)
    const safeMessagePlain = sanitizeMultilineText(message)

    if (!safeNamePlain || !safeEmail || !safeMessagePlain) {
      return NextResponse.json({ error: "Entrada inválida" }, { status: 400 })
    }

    if (safeMessagePlain.length > 5000) {
      return NextResponse.json({ error: "El mensaje supera el límite de caracteres" }, { status: 400 })
    }

    const safeNameHtml = escapeHtml(safeNamePlain)
    const safeMessageHtml = escapeHtml(safeMessagePlain).replace(/\r?\n/g, "<br>")

    // Configurar transporter de Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // Tu email de Gmail
        pass: process.env.GMAIL_APP_PASSWORD, // Contraseña de aplicación de Gmail
      },
    })

    // Configurar el email
    const mailOptions = {
      from: `"MecHub ASME" <${process.env.GMAIL_USER}>`,
      to: "jbirsa@itba.edu.ar",
      subject: `[Contacto Web] Patrocinación - ${safeNamePlain}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">
            Nuevo mensaje desde el sitio web de ASME
          </h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Nombre:</strong> ${safeNameHtml}</p>
            <p><strong>Email:</strong> ${escapeHtml(safeEmail)}</p>
            <p><strong>Asunto:</strong> [Contacto Web] Patrocinación - ${safeNameHtml}</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #f59e0b; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Mensaje:</h3>
            <p style="line-height: 1.6; color: #4b5563;">${safeMessageHtml}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
            <p>Este mensaje fue enviado desde el formulario de contacto del sitio web de ASME ITBA.</p>
            <p>Para responder, utiliza la dirección: ${escapeHtml(safeEmail)}</p>
          </div>
        </div>
      `,
      replyTo: safeEmail, // Para que puedas responder directamente al remitente
    }

    // Enviar el email
    const info = await transporter.sendMail(mailOptions)

    console.log("Email sent successfully:", info.messageId)
    return NextResponse.json({ message: "Email enviado correctamente", messageId: info.messageId }, { status: 200 })
  } catch (error) {
    console.error("Error enviando email:", error)
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
