"use client";

import type React from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useGetBorrowSummaryQuery } from "@/store/api/apiSlice";

const BorrowSummary: React.FC = () => {
  const { data, error, isLoading, refetch } = useGetBorrowSummaryQuery();

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">
          Error loading borrow summary. Please try again.
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }

  const borrowSummary = data?.data || [];
  const totalBorrowedBooks = borrowSummary.reduce(
    (sum, item) => sum + item.totalQuantity,
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <h1 className="text-3xl font-bold text-gray-900">Borrow Summary</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <p className="text-xl font-semibold text-black">
              Total Books Borrowed : {totalBorrowedBooks}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <p className="text-xl font-semibold text-black">
              Unique Titles : {borrowSummary.length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <p className="text-xl font-semibold text-black">
              Average per Book :{" "}
              {borrowSummary.length > 0
                ? Math.round((totalBorrowedBooks / borrowSummary.length) * 10) /
                  10
                : 0}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {borrowSummary.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No books have been borrowed yet
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Start borrowing books to see the summary here
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Book Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ISBN
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Quantity Borrowed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {borrowSummary.map((item, index) => {
                  const percentage =
                    totalBorrowedBooks > 0
                      ? (item.totalQuantity / totalBorrowedBooks) * 100
                      : 0;
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item.book.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-mono">
                          {item.book.isbn}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-semibold">
                          {item.totalQuantity}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                            <div
                              className="bg-green-400 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BorrowSummary;
