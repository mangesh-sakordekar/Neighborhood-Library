import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

export const getBooks = () => api.get("/books");

export const createBook = (data) => api.post("/books", data);

export const updateBook = (id, data) => api.put(`/books/${id}`, data);

export const deleteBook = (id) => api.delete(`/books/${id}`);

export const borrowBook = (data) => api.post("/borrow", data);

export const addMember = (data) => api.post("/members", data);

export const getMembers = () => api.get("/members");

export const updateMember = (id, data) => api.put(`/members/${id}`, data);

export const deleteMember = (id) => api.delete(`/members/${id}`);

export const getBorrowedBooks = () => api.get("/borrowed");

export const returnBook = (data) => api.post("/return", data);

export const getAvailableBooks = () => api.get("/availablebooks");


