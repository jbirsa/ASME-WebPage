import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()

    // Validación básica
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 })
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 })
    }

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
      subject: `[Contacto Web] Patrocinación - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">
            Nuevo mensaje desde el sitio web de ASME
          </h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Asunto:</strong> [Contacto Web] Patrocinación - ${name}</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #f59e0b; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Mensaje:</h3>
            <p style="line-height: 1.6; color: #4b5563;">${message.replace(/\n/g, "<br>")}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
            <p>Este mensaje fue enviado desde el formulario de contacto del sitio web de ASME ITBA.</p>
            <p>Para responder, utiliza la dirección: ${email}</p>
          </div>
        </div>
      `,
      replyTo: email, // Para que puedas responder directamente al remitente
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
