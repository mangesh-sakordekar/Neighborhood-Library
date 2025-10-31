import React from "react";
import styles from "./BookList.module.css";

export default function BookTable({ books, onDelete }) {
  return (
    <div className={styles['table-container']}>
      <h2 className={styles.heading}>📚 All Books</h2>
      {books.length === 0 ? (
        <p>No books available</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr className={styles['table-header']}>
              <th className={styles.th}>ID</th>
              <th className={styles.th}>Title</th>
              <th className={styles.th}>Author</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id} className={styles['table-row']}>
                <td className={styles.td}>{book.id}</td>
                <td className={styles.td}>{book.title}</td>
                <td className={styles.td}>{book.author}</td>
                <td className={styles.td} style={{ color: book.available ? "#2e7d32" : "#d32f2f", padding: "0.75rem", fontWeight: 600 }}>
                  {book.available ? "Available" : "Borrowed"}
                </td>
                <td className={styles.td}>
                  {book.available ? (
                    <button className={`${styles.button} ${styles.danger}`} onClick={() => onDelete(book.id)}>
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
  );
}
