import React, { useState } from "react";
import EntityForm from "./EntityForm";
import styles from "./BookList.module.css";

export default function BookForm({ onAdd, existingTitles = [], isSubmitting }) {
  const [values, setValues] = useState({ title: "", author: "" });
  const [error, setError] = useState("");

  const fields = [
    { name: "title", label: "Title", required: true },
    { name: "author", label: "Author", required: true },
  ];

  const validate = (vals) => {
    if (!vals.title.trim() || !vals.author.trim()) {
      setError("Please fill in both title and author.");
      return false;
    }
    const duplicate = existingTitles.find((t) => t.toLowerCase() === vals.title.trim().toLowerCase());
    if (duplicate) {
      setError("A book with this title already exists.");
      return false;
    }
    setError("");
    return true;
  };

  const handleChange = (name, value) => setValues((p) => ({ ...p, [name]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate(values)) return;
    onAdd({ title: values.title.trim(), author: values.author.trim() });
    setValues({ title: "", author: "" });
  };

  return (
    <div>
      <EntityForm
        title="Add Book:"
        fields={fields}
        values={values}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Add"
      />
      {error && <p className={styles['form-error']}>{error}</p>}
    </div>
  );
}
