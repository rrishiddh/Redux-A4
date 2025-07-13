
export const Genre = {
  FICTION: "FICTION",
  NON_FICTION: "NON_FICTION",
  SCIENCE: "SCIENCE",
  HISTORY: "HISTORY",
  BIOGRAPHY: "BIOGRAPHY",
  FANTASY: "FANTASY",
} as const;

export type Genre = typeof Genre[keyof typeof Genre];

export interface Book {
  _id: string
  title: string
  author: string
  genre: Genre 
  isbn: string
  description?: string
  copies: number
  available: boolean
  createdAt: string
  updatedAt: string
}

export interface BorrowRequest {
  book: string
  quantity: number
  dueDate: string
}

export interface BorrowSummary {
  book: {
    title: string
    isbn: string
  }
  totalQuantity: number
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  error?: unknown
}
