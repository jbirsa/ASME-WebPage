import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
})

const playfairDisplay = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700"],
})

export const metadata: Metadata = {
  title: "ASME ITBA",
  description: "Promoviendo la excelencia en ingeniería mecánica",
  icons: {
    icon: [
      {
        url: "@/public/asme_logo.png",
        type: "image/png",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${inter.variable} ${playfairDisplay.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
