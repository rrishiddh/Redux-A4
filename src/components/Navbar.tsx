"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Plus, BarChart3 } from "lucide-react"

const Navbar: React.FC = () => {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <nav className="bg-white border-green-400 border-b px-5">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-gray-800">
            <BookOpen className="h-8 w-8 text-green-400" />
            <span>Library Management</span>
          </Link>

          <div className="flex space-x-6">
            <Link
              href="/books"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/books") || isActive("/")
                  ? "bg-gray-500 text-white"
                  : "text-black  hover:bg-gray-100"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>All Books</span>
            </Link>

            <Link
              href="/create-book"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/create-book")
                  ? "bg-gray-500 text-white"
                  : "text-black  hover:bg-gray-100"
              }`}
            >
              <Plus className="h-4 w-4" />
              <span>Add Book</span>
            </Link>

            <Link
              href="/borrow-summary"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/borrow-summary")
                ? "bg-gray-500 text-white"
                  : "text-black  hover:bg-gray-100"
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Borrow Summary</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
