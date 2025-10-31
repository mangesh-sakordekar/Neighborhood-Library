import React, { useEffect, useState } from "react";
import {
  borrowBook,
  getBorrowedBooks,
  returnBook,
  getMembers,
  getAvailableBooks,
} from "../api";

export default function BorrowedBooks() {
  const [borrowed, setBorrowed] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [message, setMessage] = useState("");
  const [bookId, setBookId] = useState("");
  const [memberId, setMemberId] = useState("");
  const [members, setMembers] = useState([]);
  const [availableBooks, setAvailableBooks] = useState([]);
  const [filterMember, setFilterMember] = useState("");

  const fetchBorrowedBooks = async () => {
    try {
      const res = await getBorrowedBooks();
      const data = Array.isArray(res.data) ? res.data : res.data?.borrowed || [];
      setBorrowed(data);
      setFiltered(data);
    } catch (err) {
      console.error("❌ Failed to fetch borrowed books:", err);
    }
  };

  const fetchAvailableBooks = async () => {
    try {
      const res = await getAvailableBooks();
      const data = Array.isArray(res.data) ? res.data : res.data?.books || [];
      setAvailableBooks(data);
    } catch (err) {
      console.error("❌ Failed to fetch available books:", err);
    }
  };

  useEffect(() => {
    fetchBorrowedBooks();
    fetchAvailableBooks();
    getMembers()
      .then((res) => setMembers(res.data))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await borrowBook({ book_id: Number(bookId), member_id: Number(memberId) });
      setMessage("");
      setBookId("");
      setMemberId("");
      await fetchBorrowedBooks();
      await fetchAvailableBooks();
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to borrow book");
    }
  };

  const handleReturn = async (borrowing_id) => {
    try {
      await returnBook({ borrowing_id });
      setMessage("");
      await fetchBorrowedBooks();
      await fetchAvailableBooks();
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to return book");
    }
  };

  const handleSearch = () => {
    if (filterMember === "") {
      setFiltered(borrowed);
    } else {
      const filteredList = borrowed.filter(
        (b) => String(b.member_id) === String(filterMember)
      );
      setFiltered(filteredList);
    }
  };

  const handleClear = () => {
    setFilterMember("");
    setFiltered(borrowed);
  };

  return (
    <div style={styles.wrapper}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h3 style={styles.formTitle}>Borrow Book:</h3>

        {/* Dropdown for available books */}
        <select
          style={styles.input}
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
          required
        >
          <option value="">Select Book</option>
          {availableBooks.map((b) => (
            <option key={b.id} value={b.id}>
              {b.title} by {b.author} (ID: {b.id})
            </option>
          ))}
        </select>

        {/* Dropdown for members */}
        <select
          style={styles.input}
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
          required
        >
          <option value="">Select Member</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} (ID: {m.id})
            </option>
          ))}
        </select>

        <button style={styles.button} type="submit">
          Borrow
        </button>
      </form>

      {message && <p style={styles.message}>{message}</p>}

      <div style={styles.tableContainer}>
        <div style={styles.headerRow}>
          <h2 style={styles.heading}>⏳ Pending Returns</h2>

          {/* Filter section */}
          <div style={styles.filterSection}>
            <select
              style={styles.input}
              value={filterMember}
              onChange={(e) => setFilterMember(e.target.value)}
            >
              <option value="">Select Member</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} (ID: {m.id})
                </option>
              ))}
            </select>

            <button onClick={handleSearch} style={styles.filterButton}>
              Search
            </button>
            <button onClick={handleClear} style={styles.clearButton}>
              Clear
            </button>
          </div>
        </div>

        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>Book ID</th>
              <th style={styles.th}>Book</th>
              <th style={styles.th}>Member ID</th>
              <th style={styles.th}>Member</th>
              <th style={styles.th}>Borrowing Date</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td style={styles.td} colSpan="6" align="center">
                  No borrowed books found
                </td>
              </tr>
            ) : (
              filtered.map((b) => (
                <tr key={b.borrowing_id} style={styles.tableRow}>
                  <td style={styles.td}>{b.book_id}</td>
                  <td style={styles.td}>{b.book_title}</td>
                  <td style={styles.td}>{b.member_id}</td>
                  <td style={styles.td}>{b.member_name}</td>
                  <td style={styles.td}>{b.borrowing_date}</td>
                  <td style={styles.td} align="center">
                    <button
                      onClick={() => handleReturn(b.borrowing_id)}
                      style={styles.returnButton}
                    >
                      Return
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "1rem",
  },
  filterSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  heading: {
    color: "#2c3e50",
    fontWeight: "600",
  },
  filterButton: {
    backgroundColor: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    padding: "0.6rem 1.2rem",
  },
  clearButton: {
    backgroundColor: "#9e9e9e",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "0.6rem 1.2rem",
    cursor: "pointer",
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
  returnButton: {
    backgroundColor: "#2e7d32",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "0.4rem 1rem",
    cursor: "pointer",
    fontWeight: "500",
    transition: "background-color 0.2s",
  },
};
