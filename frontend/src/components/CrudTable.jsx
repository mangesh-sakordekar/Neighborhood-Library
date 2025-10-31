import React from "react";
import "../styles/Library.css";

// columns: [{key,label,render?}]
// actions: [{label, onClick(row), confirmMessage?}]
export default function CrudTable({ columns, data, actions = [], keyField = "id" }) {
  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr className="table-header">
            {columns.map((c) => (
              <th key={c.key} className="th">
                {c.label}
              </th>
            ))}
            {actions.length > 0 && <th className="th">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td className="td" colSpan={columns.length + (actions.length ? 1 : 0)}>
                No records found
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row[keyField] ?? Math.random()} className="table-row">
                {columns.map((c) => (
                  <td key={c.key} className="td">
                    {c.render ? c.render(row) : row[c.key]}
                  </td>
                ))}
                {actions.length > 0 && (
                  <td className="td">
                    {actions.map((a, i) => (
                      <button
                        key={i}
                        className="button danger"
                        style={{ marginRight: 8 }}
                        onClick={() => {
                          if (a.confirmMessage) {
                            if (!window.confirm(a.confirmMessage)) return;
                          }
                          a.onClick(row);
                        }}
                      >
                        {a.label}
                      </button>
                    ))}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
