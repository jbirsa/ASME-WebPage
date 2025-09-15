import { Resend } from "resend"
import { type NextRequest, NextResponse } from "next/server"

const resend = new Resend(process.env.RESEND_API_KEY)

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

    // Enviar email usando Resend
    const data = await resend.emails.send({
      from: "ASME ITBA <onboarding@resend.dev>", // Dominio por defecto de Resend
      to: ["asme@itba.edu.ar"],
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
    })

    return NextResponse.json({ message: "Email enviado correctamente"}, { status: 200 })
  } catch (error) {
    console.error("Error enviando email:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
