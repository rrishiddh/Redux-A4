import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { Book, BorrowRequest, BorrowSummary, ApiResponse } from "../../types"

const API_BASE_URL = "https://library-management-api-rrishiddh.vercel.app/api"

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
  }),
  tagTypes: ["Book", "Borrow"],
  endpoints: (builder) => ({
    getBooks: builder.query<ApiResponse<Book[]>, { filter?: string; sortBy?: string; sort?: string; limit?: number }>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        if (params.filter) searchParams.append("filter", params.filter)
        if (params.sortBy) searchParams.append("sortBy", params.sortBy)
        if (params.sort) searchParams.append("sort", params.sort)
        if (params.limit) searchParams.append("limit", params.limit.toString())

        return `/books?${searchParams.toString()}`
      },
      providesTags: ["Book"],
    }),

    getBookById: builder.query<ApiResponse<Book>, string>({
      query: (id) => `/books/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Book", id }],
    }),

    createBook: builder.mutation<ApiResponse<Book>, Partial<Book>>({
      query: (book) => ({
        url: "/books",
        method: "POST",
        body: book,
      }),
      invalidatesTags: ["Book"],
    }),

    updateBook: builder.mutation<ApiResponse<Book>, { id: string; book: Partial<Book> }>({
      query: ({ id, book }) => ({
        url: `/books/${id}`,
        method: "PUT",
        body: book,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Book", id }, "Book"],
    }),

    deleteBook: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/books/${id}`,
        method: "DELETE",
        body: null, 
      }),
      invalidatesTags: ["Book"],
    }),

    borrowBook: builder.mutation<ApiResponse<null>, BorrowRequest>({
      query: (borrowData) => ({
        url: "/borrow",
        method: "POST",
        body: borrowData,
      }),
      invalidatesTags: ["Book", "Borrow"],
    }),

    getBorrowSummary: builder.query<ApiResponse<BorrowSummary[]>, void>({
      query: () => "/borrow",
      providesTags: ["Borrow"],
    }),
  }),
})

export const {
  useGetBooksQuery,
  useGetBookByIdQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useBorrowBookMutation,
  useGetBorrowSummaryQuery,
} = apiSlice
