import React from "react";
import BookForm from "./BookForm.jsx";
import BookTable from "./BookTable.jsx";
import UpdateForm from "./UpdateForm";
import styles from "./BookList.module.css";
import { getBooks, createBook, updateBook, deleteBook } from "../api";
import { toast } from "react-toastify";

export default function Books() {
  // reuse logic from BookList.jsx
  const [books, setBooks] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [message, setMessage] = React.useState("");

  const [bookId, setBookId] = React.useState("");
  const [updateTitle, setUpdateTitle] = React.useState("");
  const [updateAuthor, setUpdateAuthor] = React.useState("");
  const [isAdding, setIsAdding] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);

  const fetchBooks = async () => {
    try {
      const res = await getBooks();
      const data = Array.isArray(res.data) ? res.data : res.data?.books || [];
      setBooks(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { fetchBooks(); }, []);

  const handleAddBook = async (payload) => {
    setIsAdding(true);
    try {
      await createBook(payload);
      toast.success("Book added");
      await fetchBooks();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to create book");
    } finally { setIsAdding(false); }
  };

  const handleUpdateBook = async (e) => {
    e.preventDefault();
    if (!bookId) return setMessage("Please select a book to update");
    if (!updateTitle.trim() || !updateAuthor.trim()) return setMessage("Please provide title and author.");
    setIsUpdating(true);
    try {
      await updateBook(bookId, { title: updateTitle, author: updateAuthor });
      setBookId(""); setUpdateTitle(""); setUpdateAuthor("");
      toast.success("Book updated");
      await fetchBooks();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update book");
    } finally { setIsUpdating(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await deleteBook(id);
      toast.success("Book deleted");
      await fetchBooks();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Cannot delete borrowed book");
    }
  };

  React.useEffect(() => {
    if (bookId) {
      const selected = books.find((b) => String(b.id) === String(bookId));
      if (selected) { setUpdateTitle(selected.title); setUpdateAuthor(selected.author); }
    } else { setUpdateTitle(""); setUpdateAuthor(""); }
  }, [bookId, books]);

  if (loading) return <p>Loading books...</p>;

  return (
    <div className={styles.wrapper}>
      <BookForm onAdd={handleAddBook} existingTitles={books.map((b) => b.title)} isSubmitting={isAdding} />

      <UpdateForm
        title={"Update Book:"}
        selectOptions={books.map(b => ({ id: b.id, label: `${b.title} by ${b.author}` }))}
        selectedId={bookId}
        onSelectChange={(v) => setBookId(v)}
        fields={[{ name: 'title', label: 'Title' }, { name: 'author', label: 'Author' }]}
        values={{ title: updateTitle, author: updateAuthor }}
        onChange={(name, val) => {
          if (name === 'title') setUpdateTitle(val);
          if (name === 'author') setUpdateAuthor(val);
        }}
        onSubmit={handleUpdateBook}
        isSubmitting={isUpdating}
        submitLabel={"Update"}
      />

      {message && <p className={styles.message}>{message}</p>}

      <BookTable books={books} onDelete={handleDelete} />
    </div>
  );
}
