import React, { useEffect, useState } from "react";
import { getBooks, createBook, updateBook, deleteBook } from "../api";

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");

  const [bookId, setBookId] = useState("");
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateAuthor, setUpdateAuthor] = useState("");

  // Fetch all books
  const fetchBooks = async () => {
    try {
      const res = await getBooks();
      const data = Array.isArray(res.data) ? res.data : res.data?.books || [];
      setBooks(data);
    } catch (err) {
      console.error("❌ Failed to load books:", err);
      setMessage("❌ Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Create book
  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await createBook({ title, author });
      setTitle("");
      setAuthor("");
      setMessage("");
      await fetchBooks();
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to create book");
    }
  };

  // Update book
  const handleUpdateBook = async (e) => {
    e.preventDefault();
    if (!bookId) return setMessage("⚠️ Please select a book to update.");

    try {
      await updateBook(bookId, { title: updateTitle, author: updateAuthor });
      setBookId("");
      setUpdateTitle("");
      setUpdateAuthor("");
      setMessage("");
      await fetchBooks();
    } catch (err) {
      console.error("❌ Failed to update book:", err);
      setMessage("❌ Failed to update book");
    }
  };

  // Delete book
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await deleteBook(id);
      setMessage("");
      await fetchBooks();
    } catch (err) {
      console.error("❌ Failed to delete book:", err);
      setMessage("❌ Cannot delete borrowed book");
    }
  };

  // Auto-fill fields when selecting a book to update
  useEffect(() => {
    if (bookId) {
      const selected = books.find((b) => String(b.id) === String(bookId));
      if (selected) {
        setUpdateTitle(selected.title);
        setUpdateAuthor(selected.author);
      }
    } else {
      setUpdateTitle("");
      setUpdateAuthor("");
    }
  }, [bookId, books]);

  if (loading) return <p>Loading books...</p>;

  return (
    <div style={styles.wrapper}>
      {/* Add Book Form */}
      <form onSubmit={handleAddBook} style={styles.form}>
        <h3 style={styles.formTitle}>Add Book:</h3>
        <input
          style={styles.input}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          style={styles.input}
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <button style={styles.button} type="submit">
          Add
        </button>
      </form>

      {/* Update Book Form */}
      <form onSubmit={handleUpdateBook} style={styles.form}>
        <h3 style={styles.formTitle}>Update Book:</h3>
        <select
          style={styles.input}
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
          required
        >
          <option value="">Select Book</option>
          {books.map((b) => (
            <option key={b.id} value={b.id}>
              {b.title} by {b.author} (ID: {b.id})
            </option>
          ))}
        </select>
        <input
          style={styles.input}
          placeholder="New Title"
          value={updateTitle}
          onChange={(e) => setUpdateTitle(e.target.value)}
          required
        />
        <input
          style={styles.input}
          placeholder="New Author"
          value={updateAuthor}
          onChange={(e) => setUpdateAuthor(e.target.value)}
          required
        />
        <button style={styles.button} type="submit">
          Update
        </button>
      </form>

      {message && <p style={styles.message}>{message}</p>}

      {/* Books Table */}
      <div style={styles.tableContainer}>
        <h2 style={styles.heading}>📚 All Books</h2>
        {books.length === 0 ? (
          <p>No books available</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Author</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id} style={styles.tableRow}>
                  <td style={styles.td}>{book.id}</td>
                  <td style={styles.td}>{book.title}</td>
                  <td style={styles.td}>{book.author}</td>
                  <td
                    style={{
                      color: book.available ? "#2e7d32" : "#d32f2f",
                      padding: "0.75rem",
                      fontWeight: "600",
                    }}
                  >
                    {book.available ? "Available" : "Borrowed"}
                  </td>
                  <td style={styles.td}>
                    {book.available ? (
                      <button
                        style={{ ...styles.button, backgroundColor: "#d32f2f" }}
                        onClick={() => handleDelete(book.id)}
                      >
                        Delete
                      </button>
                    ) : (
                      <span style={{ color: "#888" }}>Unavailable</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    padding: "2rem",
    backgroundColor: "#f9fafc",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },
  form: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    backgroundColor: "#fff",
    padding: "1rem 1.5rem",
    borderRadius: "12px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    marginBottom: "1.5rem",
    flexWrap: "wrap",
  },
  formTitle: {
    margin: 0,
    fontWeight: "600",
    color: "#1976d2",
  },
  input: {
    flex: 1,
    padding: "0.6rem 0.8rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    outline: "none",
  },
  button: {
    backgroundColor: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "0.6rem 1.2rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  message: {
    margin: "0.5rem 0 1.5rem 0",
    fontWeight: "500",
  },
  tableContainer: {
    backgroundColor: "#fff",
    padding: "1rem 1.5rem",
    borderRadius: "12px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  },
  heading: {
    marginBottom: "1rem",
    color: "#2c3e50",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    backgroundColor: "#e3f2fd",
    textAlign: "left",
  },
  tableRow: {
    borderBottom: "1px solid #eee",
  },
  th: {
    padding: "0.75rem",
    fontWeight: "600",
  },
  td: {
    padding: "0.75rem",
  },
};
