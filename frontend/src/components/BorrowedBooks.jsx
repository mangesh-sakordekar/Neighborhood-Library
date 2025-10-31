import React, { useEffect, useState } from "react";
import {
  borrowBook,
  getBorrowedBooks,
  returnBook,
  getMembers,
  getAvailableBooks,
} from "../api";
import styles from "./BookList.module.css";
import { toast } from "react-toastify";
import EntityForm from "./EntityForm";
import CrudTable from "./CrudTable";

export default function BorrowedBooks() {
  const [borrowed, setBorrowed] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [message, setMessage] = useState("");
  const [bookId, setBookId] = useState("");
  const [memberId, setMemberId] = useState("");
  const [members, setMembers] = useState([]);
  const [availableBooks, setAvailableBooks] = useState([]);
  const [filterMember, setFilterMember] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBorrowedBooks = async () => {
    try {
      const res = await getBorrowedBooks();
      const data = Array.isArray(res.data) ? res.data : res.data?.borrowed || [];
      setBorrowed(data);
      setFiltered(data);
    } catch (err) {
      console.error("❌ Failed to fetch borrowed books:", err);
      toast.error(err.message || "Failed to fetch borrowed books");
    }
  };

  const fetchAvailableBooks = async () => {
    try {
      const res = await getAvailableBooks();
      const data = Array.isArray(res.data) ? res.data : res.data?.books || [];
      setAvailableBooks(data);
    } catch (err) {
      console.error("❌ Failed to fetch available books:", err);
      toast.error(err.message || "Failed to fetch available books");
    }
  };

  useEffect(() => {
    fetchBorrowedBooks();
    fetchAvailableBooks();
    getMembers()
      .then((res) => setMembers(res.data))
      .catch((err) => {
        console.error(err);
        toast.error(err.message || "Failed to fetch members");
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await borrowBook({ book_id: Number(bookId), member_id: Number(memberId) });
      setMessage("");
      setBookId("");
      setMemberId("");
      toast.success("Book borrowed");
      await fetchBorrowedBooks();
      await fetchAvailableBooks();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to borrow book");
      setMessage("❌ Failed to borrow book");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReturn = async (borrowing_id) => {
    try {
      await returnBook({ borrowing_id });
      setMessage("");
      toast.success("Book returned");
      await fetchBorrowedBooks();
      await fetchAvailableBooks();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to return book");
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

  // EntityForm fields for borrowing
  const borrowFields = [
    { name: "book_id", label: "Book", type: "select", required: true, options: availableBooks.map(b => ({ id: b.id, label: `${b.title} by ${b.author}` })) },
    { name: "member_id", label: "Member", type: "select", required: true, options: members.map(m => ({ id: m.id, label: m.name })) },
  ];

  const borrowValues = { book_id: bookId, member_id: memberId };

  const onBorrowChange = (name, value) => {
    if (name === "book_id") setBookId(value);
    if (name === "member_id") setMemberId(value);
  };

  return (
    <div className={styles.wrapper}>
      <EntityForm
        title="Borrow Book:"
        fields={borrowFields}
        values={borrowValues}
        onChange={onBorrowChange}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Borrow"
      />

      {message && <p className={styles.message}>{message}</p>}

      <div className={styles.tableContainer}>
        <div className={styles.headerRow}>
          <h2 className={styles.heading}>⏳ Pending Returns</h2>

          {/* Filter section */}
          <div className={styles.filterSection}>
            <select
              className={styles.input}
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

            <button onClick={handleSearch} className={styles.filterButton}>
              Search
            </button>
            <button onClick={handleClear} className={styles.clearButton}>
              Clear
            </button>
          </div>
        </div>

        <CrudTable
          columns={[
            { key: "book_id", label: "Book ID" },
            { key: "book_title", label: "Book" },
            { key: "member_id", label: "Member ID" },
            { key: "member_name", label: "Member" },
            { key: "borrowing_date", label: "Borrowing Date" },
          ]}
          data={filtered}
          actions={[{ label: "Return", onClick: (row) => handleReturn(row.borrowing_id), confirmMessage: "Return this book?" }]}
          keyField="borrowing_id"
        />
      </div>
    </div>
  );
}
