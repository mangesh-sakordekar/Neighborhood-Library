import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Books from "./components/Books.jsx";
import Members from "./components/Members.jsx";
import BorrowedBooks from "./components/BorrowedBooks.jsx";
import styles from "./styles/App.module.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <Router>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>📚 Neighbourhood Library</h1>
          <nav className={styles.nav}>
            <Link className={styles.link} to="/">Books</Link> |
            <Link className={styles.link} to="/members">Members</Link> |
            <Link className={styles.link} to="/borrowandreturn">Borrow & Return</Link>
          </nav>
        </header>

        <main className={styles.main}>
          <Routes>
            <Route path="/" element={<Books />} />
            <Route path="/members" element={<Members />} />
            <Route path="/borrowandreturn" element={<BorrowedBooks />} />
          </Routes>
        </main>

        <footer className={styles.footer}>
          <p>© 2025 Neighbourhood Library — Built with ❤️ using React</p>
        </footer>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}
