import React from "react";
import "../styles/Library.css";

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
    <form onSubmit={onSubmit} className="form">
      <h3 className="formTitle">{title}</h3>

      <select className="input" value={selectedId} onChange={(e) => onSelectChange(e.target.value)}>
        <option value="">Select</option>
        {selectOptions.map((opt) => (
          <option key={opt.id ?? opt.value} value={opt.id ?? opt.value}>{opt.label ?? opt.name ?? opt.title}</option>
        ))}
      </select>

      {fields.map((f) => (
        <input
          key={f.name}
          className={input}
          placeholder={f.placeholder || f.label}
          value={values[f.name] ?? ""}
          onChange={(e) => onChange(f.name, e.target.value)}
        />
      ))}

      <button className="button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? `${submitLabel}...` : submitLabel}
      </button>
    </form>
  );
}
