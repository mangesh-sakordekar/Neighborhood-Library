import React from "react";

// columns: [{key,label,render?}]
// actions: [{label, onClick(row), confirmMessage?}]
export default function CrudTable({ columns, data, actions = [], keyField = "id" }) {
  return (
    <div style={{ backgroundColor: "#fff", padding: "1rem 1.5rem", borderRadius: 12 }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#e3f2fd", textAlign: "left" }}>
            {columns.map((c) => (
              <th key={c.key} style={{ padding: "0.75rem", fontWeight: 600 }}>
                {c.label}
              </th>
            ))}
            {actions.length > 0 && <th style={{ padding: "0.75rem", fontWeight: 600 }}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td style={{ padding: "0.75rem" }} colSpan={columns.length + (actions.length ? 1 : 0)}>
                No records found
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row[keyField] ?? Math.random()} style={{ borderBottom: "1px solid #eee" }}>
                {columns.map((c) => (
                  <td key={c.key} style={{ padding: "0.75rem" }}>
                    {c.render ? c.render(row) : row[c.key]}
                  </td>
                ))}
                {actions.length > 0 && (
                  <td style={{ padding: "0.75rem" }}>
                    {actions.map((a, i) => (
                      <button
                        key={i}
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
