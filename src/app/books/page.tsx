"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useGetBooksQuery, useDeleteBookMutation } from "@/store/api/apiSlice";
import { type Book, Genre } from "@/types";
import LoadingSpinner from "@/components/LoadingSpinner";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Edit, Trash2, Eye, BookOpen } from "lucide-react";
import toast from "react-hot-toast";

interface ApiError {
  data?: {
    message?: string; 
    statusCode?: number; 
  };
  status?: number; 
  error?: string; 
}

const BookList: React.FC = () => {
  const [filter, setFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sort, setSort] = useState<string>("desc");
  const [deleteBookId, setDeleteBookId] = useState<string | null>(null);

  const { data, error, isLoading, refetch } = useGetBooksQuery({
    filter: filter || undefined,
    sortBy,
    sort,
    limit: 50,
  });

  const [deleteBook, { isLoading: isDeleting }] = useDeleteBookMutation();

  const handleDelete = async () => {
    if (!deleteBookId) return;

    try {
      await deleteBook(deleteBookId).unwrap();
      toast.success("Book deleted successfully");
      setDeleteBookId(null);
      refetch();
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "data" in error) {
        const apiError = error as ApiError;
        toast.error(apiError?.data?.message || "Failed to delete book");
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred.");
      }
    }
  };

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading books. Please try again.</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const books = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-black">Welcome to Library!</h1>
        <Link
          href="/create-book"
          className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
        >
          <span>Add New Book</span>
        </Link>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Filter by Genre
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Genres</option>
              {Object.values(Genre).map((genre) => (
                <option key={genre} value={genre}>
                  {genre.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value="createdAt">Date Created</option>
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="copies">Copies</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Order
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-dashed border-gray-300 overflow-hidden">
        {books.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No books found</p>
            <Link
              href="/create-book"
              className="mt-4 inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700"
            >
              <span>Add your first book</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Genre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ISBN
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Copies
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Availability
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {books.map((book: Book) => (
                  <tr key={book._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-black">
                        {book.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">
                        {book.author}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-500 text-white">
                        {book.genre.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">{book.isbn}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">
                        {book.copies}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          book.available
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {book.available ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          href={`/books/${book._id}`}
                          className="text-gray-500 hover:text-gray-900"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/edit-book/${book._id}`}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Edit Book"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteBookId(book._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Book"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        {book.available && book.copies > 0 && (
                          <Link
                            href={`/borrow/${book._id}`}
                            className="text-green-600 hover:text-green-900"
                            title="Borrow Book"
                          >
                            <BookOpen className="h-4 w-4" />
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteBookId}
        onClose={() => setDeleteBookId(null)}
        onConfirm={handleDelete}
        title="Delete Book"
        message="Are you sure you want to delete this book?"
        confirmText={isDeleting ? "Deleting..." : "Delete"}
      />
    </div>
  );
};

export default BookList;