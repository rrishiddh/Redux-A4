"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import {
  useBorrowBookMutation,
  useGetBookByIdQuery,
} from "@/store/api/apiSlice";
import LoadingSpinner from "@/components/LoadingSpinner";
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { Book } from "@/types";

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

const BorrowBook: React.FC = () => {
  const params = useParams<{ bookId?: string }>();
  const bookId = params?.bookId;

  const router = useRouter();

  const { data, error, isLoading } = useGetBookByIdQuery(bookId!, {
    skip: !bookId,
  });
  const [borrowBook, { isLoading: isBorrowing }] = useBorrowBookMutation();

  const [formData, setFormData] = useState({
    quantity: 1,
    dueDate: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
    setFormData((prev) => ({
      ...prev,
      dueDate: twoWeeksFromNow.toISOString().split("T")[0],
    }));
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const book = data?.data;

    if (!formData.quantity || formData.quantity < 1) {
      newErrors.quantity = "Quantity must be at least 1";
    }

    if (book && formData.quantity > book.copies) {
      newErrors.quantity = `Only ${book.copies} copies available`;
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    } else {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate <= today) {
        newErrors.dueDate = "Due date must be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!bookId) {
      toast.error("Book ID is missing. Cannot borrow book.");
      return;
    }

    try {
      await borrowBook({
        book: bookId,
        quantity: formData.quantity,
        dueDate: formData.dueDate,
      }).unwrap();

      toast.success("Book borrowed successfully!");
      router.push("/borrow-summary");
    } catch (err: unknown) {
      let errorMessage = "Failed to borrow book";
      if (isFetchBaseQueryErrorWithDataMessage(err)) {
        errorMessage = err.data.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number.parseInt(value) || 0 : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  if (!bookId) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Invalid Book ID provided!</p>
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
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md "
        >
          Back to Books
        </button>
      </div>
    );
  }

  const book: Book | undefined = data?.data;

  if (!book) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Book not found</p>
        <button
          onClick={() => router.push("/books")}
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md "
        >
          Back to Books
        </button>
      </div>
    );
  }

  if (!book.available || book.copies === 0) {
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
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Book Unavailable
          </h2>
          <p className="text-gray-600 mb-4">
            {book.title} is currently unavailable for borrowing.
          </p>
          <button
            onClick={() => router.push("/books")}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Browse Other Books
          </button>
        </div>
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
        <h1 className="text-3xl font-bold text-gray-900">Borrow Book</h1>
      </div>
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex items-start space-x-4">
          
          <div className="flex-grow">
            <h2 className="text-xl font-semibold text-gray-900">
              {book.title}
            </h2>
            <p className="text-gray-600">by {book.author}</p>
            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
              <span>ISBN: {book.isbn}</span>
              <span>•</span>
              <span>{book.copies} copies available</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Quantity *
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              max={book.copies}
              className={`w-full px-3 py-2 border text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.quantity ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.quantity && (
              <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Maximum {book.copies} copies available
            </p>
          </div>
          <div>
            <label
              htmlFor="dueDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Due Date *
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              className={`w-full px-3 py-2 border text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.dueDate ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.dueDate && (
              <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
            )}
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-black mb-2">
              Borrowing Summary
            </h3>
            <div className="text-sm text-black space-y-1">
              <p>Book: {book.title}</p>
              <p>
                Quantity: {formData.quantity}{" "}
                {formData.quantity === 1 ? "copy" : "copies"}
              </p>
              <p>
                Due Date:{" "}
                {formData.dueDate
                  ? new Date(formData.dueDate).toLocaleDateString()
                  : "Not selected"}
              </p>
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push("/books")}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isBorrowing}
              className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isBorrowing ? "Borrowing..." : "Borrow Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BorrowBook;