import React from "react";
import styles from "./BookList.module.css";

// Generic update form: renders a select for choosing the entity and input fields to edit
export default function UpdateForm({
  title = "Update",
  selectOptions = [],
  selectedId = "",
  onSelectChange = () => {},
  fields = [],
  values = {},
  onChange = () => {},
  onSubmit = () => {},
  isSubmitting = false,
  submitLabel = "Update",
}) {
  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <h3 className={styles.formTitle}>{title}</h3>

      <select className={styles.input} value={selectedId} onChange={(e) => onSelectChange(e.target.value)}>
        <option value="">Select</option>
        {selectOptions.map((opt) => (
          <option key={opt.id ?? opt.value} value={opt.id ?? opt.value}>{opt.label ?? opt.name ?? opt.title}</option>
        ))}
      </select>

      {fields.map((f) => (
        <input
          key={f.name}
          className={styles.input}
          placeholder={f.placeholder || f.label}
          value={values[f.name] ?? ""}
          onChange={(e) => onChange(f.name, e.target.value)}
        />
      ))}

      <button className={styles.button} type="submit" disabled={isSubmitting}>
        {isSubmitting ? `${submitLabel}...` : submitLabel}
      </button>
    </form>
  );
}
