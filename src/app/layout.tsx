import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import { Toaster } from "react-hot-toast"
import { Providers } from "../lib/providers"
import Footer from "@/components/Footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Library Management System",
  description: "Manage your books efficiently",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gray-100 flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-5 py-8">{children}</main>
            <Footer />
            <Toaster position="top-right" />
          </div>
        </Providers>
      </body>
    </html>
  )
}
