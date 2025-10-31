import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import BookList from "./components/BookList";
import MembersList from "./components/MembersList";
import BorrowedBooks from "./components/BorrowedBooks";

export default function App() {
  return (
    <Router>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>📚 Neighbourhood Library</h1>
          <nav style={styles.nav}>
            <Link style={styles.link} to="/">Books</Link> | 
            <Link style={styles.link} to="/members">Members</Link> | 
            <Link style={styles.link} to="/borrowandreturn">Borrow & Return</Link>
          </nav>
        </header>

        <main style={styles.main}>
          <Routes>
            <Route path="/" element={<BookList />} />
            <Route path="/members" element={<MembersList />} />
            <Route path="/borrowandreturn" element={<BorrowedBooks />} />
          </Routes>
        </main>

        <footer style={styles.footer}>
          <p>© 2025 Neighbourhood Library — Built with ❤️ using React</p>
        </footer>
      </div>
    </Router>
  );
}

const styles = {
  container: {
    fontFamily: "'Inter', sans-serif",
    color: "#2c3e50",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f9fafc",
  },
  header: {
    backgroundColor: "#1976d2",
    color: "#fff",
    padding: "1rem 0 0.5rem 0",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  title: {
    margin: "0",
    textAlign: "center",
    fontWeight: "600",
    letterSpacing: "0.5px",
  },
  nav: {
    display: "flex",
    justifyContent: "center",
    gap: "24px",
    padding: "0.75rem 0",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "500",
    transition: "opacity 0.2s",
    padding: "0 30px",
  },
  main: {
    flex: 1,
    padding: "1rem",
    margin: "10px",
  },
  footer: {
    textAlign: "center",
    padding: "1rem",
    backgroundColor: "#e3f2fd",
    color: "#555",
    fontSize: "0.9rem",
  },
};
