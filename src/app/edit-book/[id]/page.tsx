"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useGetBookByIdQuery, useUpdateBookMutation } from "@/store/api/apiSlice";
import { Genre, type Book } from "@/types";
import LoadingSpinner from "@/components/LoadingSpinner";
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

interface ApiErrorData {
  message?: string;
}

function isFetchBaseQueryErrorWithDataMessage(error: unknown): error is FetchBaseQueryError & { data: ApiErrorData } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'data' in error &&
    typeof (error as { data: unknown }).data === 'object' &&
    (error as { data: unknown }).data !== null &&
    'message' in (error as { data: ApiErrorData }).data &&
    typeof (error as { data: ApiErrorData }).data.message === 'string'
  );
}

const EditBook: React.FC = () => {
  const params = useParams<{ id?: string }>();
  const bookId = params?.id;

  const router = useRouter();

  const { data, error, isLoading } = useGetBookByIdQuery(bookId!, {
    skip: !bookId,
  });
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();

  const [formData, setFormData] = useState<Partial<Book>>({
    title: "",
    author: "",
    genre: Genre.FICTION,
    isbn: "",
    description: "",
    copies: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (data?.data) {
      const book = data.data;
      setFormData({
        title: book.title,
        author: book.author,
        genre: book.genre,
        isbn: book.isbn,
        description: book.description || "",
        copies: book.copies,
      });
    }
  }, [data]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.author?.trim()) {
      newErrors.author = "Author is required";
    }

    if (!formData.isbn?.trim()) {
      newErrors.isbn = "ISBN is required";
    }

    if (formData.copies === undefined || formData.copies < 0) {
      newErrors.copies = "Copies must be a non-negative number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // If client-side validation fails, the specific errors will be displayed
      // below the fields. No need for a generic toast here.
      return;
    }

    if (!bookId) {
      toast.error("Book ID is missing. Cannot update.");
      return;
    }

    // Additional check for all required fields being present in formData
    // before sending to the API. This complements the validation for empty strings.
    if (!formData.title || !formData.author || !formData.isbn || formData.copies === undefined || formData.genre === undefined) {
        toast.error("Please ensure all required fields are filled and valid.");
        return;
    }


    try {
      await updateBook({ id: bookId, book: formData as Book }).unwrap();
      toast.success("Book updated successfully!");
      router.push(`/books/${bookId}`);
    } catch (err: unknown) {
      let errorMessage = "Failed to update book!";
      if (isFetchBaseQueryErrorWithDataMessage(err)) {
        errorMessage = err.data.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "copies" ? Number.parseInt(value) || 0 : value,
    }));

    // Clear error for the field being changed
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  if (!bookId) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Invalid Book ID!</p>
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
    let errorMessage = "Error loading book details.";
    if (isFetchBaseQueryErrorWithDataMessage(error)) {
      errorMessage = error.data.message || errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{errorMessage}</p>
        <button
          onClick={() => router.push("/books")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Books
        </button>
      </div>
    );
  }

  const bookData = data?.data;

  if (!bookData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Book not found!</p>
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
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => router.push("/books")}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Books</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Edit Book</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <form onSubmit={handleSubmit}>
          {/* Grid container for form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Added gap-4 for spacing */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title || ""}
                onChange={handleChange}
                className={`w-full px-3 py-2 border text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter book title"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                Author *
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author || ""}
                onChange={handleChange}
                className={`w-full px-3 py-2 border text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.author ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter author name"
              />
              {errors.author && <p className="mt-1 text-sm text-red-600">{errors.author}</p>}
            </div>

            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
                Genre *
              </label>
              <select
                id="genre"
                name="genre"
                value={formData.genre || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.values(Genre).map((genre) => (
                  <option key={genre} value={genre}>
                    {genre.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-1">
                ISBN *
              </label>
              <input
                type="text"
                id="isbn"
                name="isbn"
                value={formData.isbn || ""}
                onChange={handleChange}
                className={`w-full px-3 py-2 border text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.isbn ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter ISBN"
              />
              {errors.isbn && <p className="mt-1 text-sm text-red-600">{errors.isbn}</p>}
            </div>

            {/* Description and Copies will span full width on md and up */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter book description (optional)"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="copies" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Copies *
              </label>
              <input
                type="number"
                id="copies"
                name="copies"
                value={formData.copies !== undefined ? formData.copies : ""}
                onChange={handleChange}
                min="0"
                className={`w-full px-3 py-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.copies ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.copies && <p className="mt-1 text-sm text-red-600">{errors.copies}</p>}
              <p className="mt-1 text-xs text-gray-400">Setting copies to 0 will mark the book as unavailable</p>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => router.push("/books")}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-6 py-2 text-sm font-medium text-white bg-gray-500 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isUpdating ? "Updating..." : "Update Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBook;