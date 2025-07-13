# 📖 Assignment: Minimal Library Management System

- A Library Management Front-end with Next.js(react-framework),TypeScript, Redux Toolkit, API built with Express.js, TypeScript and MongoDB Atlas (via Mongoose).

* * *

## Features

* Public Access: All pages are publicly accessible without authentication.
* UI: Responsive and Simple Ui.
* Book Management: Comprehensive CRUD (Create, Read, Update, Delete) operations for books.
* Borrowing System: Handle book borrowing with quantity tracking
* Availability Control: Automatic availability updates based on stock
* Filtering & Sorting: Advanced book filtering by genre with sorting options
* Aggregation Pipeline: Borrowed books summary with MongoDB aggregation
* Data Validation: Comprehensive schema validation with Mongoose
* Middleware Implementation: Pre/post hooks for business logic
* Error Handling: Proper error responses with detailed messages
* TypeScript: Full type safety and modern JavaScript features

## Installation & Setup Steps

- Step 1: Clone Project Directory.
 
`git clone https://github.com/rrishiddh/Redux-A4.git`

- Step 2: Install Project Dependencies.

` npm i`


- Step 3: Run the Application.

`npm run dev`



###

## Project's Page Structure

* src/app/books~ Displays a list of all books with options to view, edit, delete and borrow
* src/app/borrow/:bookId~ Form to borrow a selected book
* src/app/borrow-summary~ Displays an aggregated summary of all borrowed books.
* src/app/create-book~ Form interface to add a new book to the system.
* src/app/edit-book/:id~ Interface to update an existing book’s details.


### Dependencies:
- @reduxjs/toolkit: ^2.8.2
- lucide-react: ^0.525.0
- next: ^15.3.5
- react: ^19.0.0
- react-dom: ^19.0.0
- react-hot-toast: ^2.5.2
- react-redux: ^9.2.0

##  Link: 
### Vercel : [https://library-management-rrishiddh.vercel.app/books/](https://library-management-rrishiddh.vercel.app/books)

###  Github-Repo-Frontend : [https://github.com/rrishiddh/Redux-A4](https://github.com/rrishiddh/Redux-A4)
###  Github-Repo-Backend : [https://github.com/rrishiddh/Express-Mongoose-A3](https://github.com/rrishiddh/Express-Mongoose-A3)


