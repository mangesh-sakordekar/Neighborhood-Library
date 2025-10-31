import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 10000,
});

// Centralized response handler (returns data or throws error)
async function handleRequest(promise) {
  try {
    const res = await promise;
    return res;
  } catch (err) {
    // Normalize error object
    const message =
      err?.response?.data?.message || err?.response?.data || err.message || "Unknown error";
    const error = new Error(message);
    error.status = err?.response?.status;
    error.original = err;
    throw error;
  }
}

export const getBooks = async () => handleRequest(api.get("/books"));

export const createBook = async (data) => handleRequest(api.post("/books", data));

export const updateBook = async (id, data) => handleRequest(api.put(`/books/${id}`, data));

export const deleteBook = async (id) => handleRequest(api.delete(`/books/${id}`));

export const borrowBook = async (data) => handleRequest(api.post("/borrow", data));

export const addMember = async (data) => handleRequest(api.post("/members", data));

export const getMembers = async () => handleRequest(api.get("/members"));

export const updateMember = async (id, data) => handleRequest(api.put(`/members/${id}`, data));

export const deleteMember = async (id) => handleRequest(api.delete(`/members/${id}`));

export const getBorrowedBooks = async () => handleRequest(api.get("/borrowed"));

export const returnBook = async (data) => handleRequest(api.post("/return", data));

export const getAvailableBooks = async () => handleRequest(api.get("/availablebooks"));


