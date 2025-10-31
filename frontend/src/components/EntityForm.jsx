import React from "react";
import styles from "./BookList.module.css";

// Generic entity form
// fields: [{name,label,type,required,options,full}] type can be text/select
export default function EntityForm({ title, fields, values, onChange, onSubmit, isSubmitting, submitLabel = "Submit" }) {
  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <h3 className={styles.formTitle}>{title}</h3>
      {fields.map((f) => (
        <div key={f.name} style={{ flex: f.full ? "0 0 100%" : 1 }}>
          {f.type === "select" ? (
            <select
              className={styles.input}
              value={values[f.name] ?? ""}
              onChange={(e) => onChange(f.name, e.target.value)}
              required={!!f.required}
            >
              <option value="">{f.placeholder || `Select ${f.label}`}</option>
              {(f.options || []).map((opt) => (
                <option key={opt.value ?? opt.id} value={opt.value ?? opt.id}>
                  {opt.label ?? opt.name ?? opt.title}
                </option>
              ))}
            </select>
          ) : (
            <input
              className={styles.input}
              type={f.type || "text"}
              placeholder={f.placeholder || f.label}
              value={values[f.name] ?? ""}
              onChange={(e) => onChange(f.name, e.target.value)}
              required={!!f.required}
            />
          )}
        </div>
      ))}

      <button className={styles.button} type="submit" disabled={isSubmitting}>
        {isSubmitting ? `${submitLabel}...` : submitLabel}
      </button>
    </form>
  );
}
