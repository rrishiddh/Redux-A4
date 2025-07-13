"use client"

import type React from "react"
import { ArrowLeft, Calendar } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useGetBookByIdQuery } from "@/store/api/apiSlice"
import LoadingSpinner from "@/components/LoadingSpinner"
import Link from "next/link"
import { skipToken } from "@reduxjs/toolkit/query/react"

const BookDetails: React.FC = () => {
  const params = useParams();
  const router = useRouter();

  const id = typeof params?.id === 'string' ? params.id : null;

  const { data, error, isLoading } = useGetBookByIdQuery(id ?? skipToken);

  if (id === null) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Invalid book ID provided in URL.</p>
        <button
          onClick={() => router.push("/books")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Books
        </button>
      </div>
    );
  }

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading book details.</p>
        <button
          onClick={() => router.push("/books")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Books
        </button>
      </div>
    );
  }

  const book = data?.data;

  if (!book) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Book not found.</p>
        <button
          onClick={() => router.push("/books")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Books
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => router.push("/books")}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Books</span>
        </button>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
          <div className="flex space-x-3">
            <Link
              href={`/edit-book/${book._id}`}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors"
            >
              <span>Edit Book</span>
            </Link>
            {book.available && book.copies > 0 && (
              <Link
                href={`/borrow/${book._id}`}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                <span>Borrow Book</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Author</h3>
                <p className="mt-1 text-lg text-gray-900">{book.author}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Genre</h3>
                <span className="mt-1 inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-gray-500 text-white">
                  {book.genre.replace("_", " ")}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">ISBN</h3>
                <p className="mt-1 text-lg text-gray-900 font-mono">{book.isbn}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Copies Available</h3>
                <p className="mt-1 text-lg text-gray-900">{book.copies}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Availability Status</h3>
                <span
                  className={`mt-1 inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    book.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {book.available ? "Available" : "Unavailable"}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Date Added</h3>
                <div className="mt-1 flex items-center space-x-2 text-gray-900">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(book.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {book.description && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Description</h3>
              <p className="text-gray-900 leading-relaxed">{book.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;