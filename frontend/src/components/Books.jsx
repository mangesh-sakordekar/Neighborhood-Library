import React from "react";
import EntityForm from "./EntityForm.jsx";
import CrudTable from "./CrudTable.jsx";
import "../styles/Library.css";
import { getBooks, createBook, updateBook, deleteBook } from "../api";
import { toast } from "react-toastify";

export default function Books() {
  // reuse logic from BookList.jsx
  const [books, setBooks] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [message, setMessage] = React.useState("");

  const [addValues, setAddValues] = React.useState({ title: "", author: "" });
  const [isAdding, setIsAdding] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [selectedBook, setSelectedBook] = React.useState(null);

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

  const handleAddBook = async (values) => {
    setIsAdding(true);
    try {
      await createBook(values);
      toast.success("Book added");
      await fetchBooks();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to create book");
    } finally { setIsAdding(false); }
  };

  const handleUpdateBook = async (e) => {
    e.preventDefault();
    if (!selectedBook) return setMessage("Please select a book to update");
    if (!selectedBook.title.trim() || !selectedBook.author.trim()) return setMessage("Please provide title and author.");
    setIsUpdating(true);
    try {
      await updateBook(selectedBook.id, { title: selectedBook.title, author: selectedBook.author });
      setSelectedBook(null);
      toast.success("Book updated");
      await fetchBooks();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update book");
    } finally { setIsUpdating(false); }
  };

  const handleDelete = async (row) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await deleteBook(row.id);
      toast.success("Book deleted");
      await fetchBooks();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Cannot delete borrowed book");
    }
  };

  // Update selectedBook when selection changes

  if (loading) return <p>Loading books...</p>;

  // Add form fields
  const addFields = [
    { name: "title", label: "Title", required: true },
    { name: "author", label: "Author", required: true },
  ];

  // Update form fields
  const updateFields = [
    { name: "title", label: "Title", required: true },
    { name: "author", label: "Author", required: true },
  ];

  // Add form change handler
  const onAddChange = (name, value) => setAddValues(prev => ({ ...prev, [name]: value }));
  const onAddSubmit = (e) => {
    e.preventDefault();
    handleAddBook(addValues);
    setAddValues({ title: "", author: "" });
  };

  // Update form change handler
  const onUpdateSelect = (e) => {
    const id = e.target.value;
    const book = books.find(b => String(b.id) === String(id));
    setSelectedBook(book || null);
  };
  const onUpdateChange = (name, value) => setSelectedBook(prev => ({ ...(prev||{}), [name]: value }));

  return (
  <div className="wrapper">
      <EntityForm
        title="Add Book:"
        fields={addFields}
        values={addValues}
        onChange={onAddChange}
        onSubmit={onAddSubmit}
        isSubmitting={isAdding}
        submitLabel="Add"
      />

      {/* Update Book Form */}
      <form onSubmit={handleUpdateBook} className="form">
        <h3 className="formTitle">Update Book:</h3>
        <select className="input" value={selectedBook?.id ?? ""} onChange={onUpdateSelect}>
          <option value="">Select Book</option>
          {books.map(b => <option key={b.id} value={b.id}>{b.title} by {b.author}</option>)}
        </select>
        <input className="input" placeholder="New Title" value={selectedBook?.title ?? ""} onChange={e => onUpdateChange("title", e.target.value)} />
        <input className="input" placeholder="New Author" value={selectedBook?.author ?? ""} onChange={e => onUpdateChange("author", e.target.value)} />
        <button className="button" type="submit" disabled={isUpdating}>{isUpdating ? "Updating..." : "Update"}</button>
      </form>

      {message && <p className="message">{message}</p>}

      <div className="headerRow">
          <h2 className="heading">📚 Books</h2>
      </div>
      <CrudTable
        columns={[{ key: "id", label: "ID" }, { key: "title", label: "Title" }, { key: "author", label: "Author" }]}
        data={books}
        actions={[{ label: "Delete", onClick: handleDelete }]}
        keyField="id"
      />
    </div>
  );
}
