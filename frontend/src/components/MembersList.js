import { useEffect, useState } from "react";
import { getMembers, addMember, updateMember, deleteMember } from "../api";

export default function MembersList() {
  const [members, setMembers] = useState([]);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");

  const [memberId, setMemberId] = useState("");
  const [updateName, setUpdateName] = useState("");
  const [updateContact, setUpdateContact] = useState("");

  const fetchMembers = async () => {
    try {
      const res = await getMembers();
      const data = Array.isArray(res.data) ? res.data : res.data?.members || [];
      setMembers(data);
    } catch (err) {
      console.error("❌ Failed to load members:", err);
    }
  };

  useEffect(() => {
      fetchMembers();
    }, []);

  // Update book
    const handleUpdateMember = async (e) => {
      e.preventDefault();
      if (!memberId) return setMessage("⚠️ Please select a book to update.");
  
      try {
        await updateMember(memberId, { name: updateName, contact: updateContact });
        setMemberId("");
        setUpdateName("");
        setUpdateContact("");
        setMessage("");
        await fetchMembers();
      } catch (err) {
        console.error("❌ Failed to update Member:", err);
        setMessage("❌ Failed to update member");
      }
    };

  useEffect(() => {
    if (memberId) {
      const selected = members.find((b) => String(b.id) === String(memberId));
      if (selected) {
        setUpdateName(selected.name);
        setUpdateContact(selected.contact);
      }
    } else {
      setUpdateName("");
      setUpdateContact("");
    }
  }, [memberId, members]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addMember({ name, contact });
      setMessage("");
      setName("");
      setContact("");
      await fetchMembers(); // 🔄 Refresh member list
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to add member");
    }
  };

  // Delete book
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    try {
      await deleteMember(id);
      setMessage("");
      await fetchMembers();
    } catch (err) {
      console.error("❌ Failed to delete member:", err);
      setMessage("❌ Cannot delete member with borrowed books");
    }
  };

  return (
    <div style={styles.wrapper}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h3 style={styles.formTitle}>Add Member:</h3>
        <input
          style={styles.input}
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          style={styles.input}
          type="text"
          placeholder="Contact"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
        />
        <button type="submit" style={styles.button}>
          Add
        </button>
      </form>

      {/* Update Member Form */}
      <form onSubmit={handleUpdateMember} style={styles.form}>
        <h3 style={styles.formTitle}>Update Member:</h3>
        <select
          style={styles.input}
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
          required
        >
          <option value="">Select Member</option>
          {members.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name} (ID: {b.id})
            </option>
          ))}
        </select>
        <input
          style={styles.input}
          placeholder="New Name"
          value={updateName}
          onChange={(e) => setUpdateName(e.target.value)}
          required
        />
        <input
          style={styles.input}
          placeholder="New Contact"
          value={updateContact}
          onChange={(e) => setUpdateContact(e.target.value)}
          required
        />
        <button style={styles.button} type="submit">
          Update
        </button>
      </form>

      {message && <p style={styles.message}>{message}</p>}

      <div style={styles.tableContainer}>
        <h2 style={styles.heading}>👥 Members List</h2>
        {members.length === 0 ? (
          <p>No members found.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Contact</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} style={styles.tableRow}>
                  <td style={styles.td}>{m.id}</td>
                  <td style={styles.td}>{m.name}</td>
                  <td style={styles.td}>{m.contact}</td>
                  <td style={styles.td}>
                    <button
                      style={{ ...styles.button, backgroundColor: "#d32f2f" }}
                      onClick={() => handleDelete(m.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    padding: "2rem",
    backgroundColor: "#f9fafc",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },
  form: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    backgroundColor: "#fff",
    padding: "1rem 1.5rem",
    borderRadius: "12px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    marginBottom: "1.5rem",
  },
  formTitle: {
    margin: 0,
    fontWeight: "600",
    color: "#1976d2",
  },
  input: {
    flex: 1,
    padding: "0.6rem 0.8rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    outline: "none",
  },
  button: {
    backgroundColor: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "0.6rem 1.2rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  message: {
    margin: "0.5rem 0 1.5rem 0",
    fontWeight: "500",
  },
  tableContainer: {
    backgroundColor: "#fff",
    padding: "1rem 1.5rem",
    borderRadius: "12px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  },
  heading: {
    marginBottom: "1rem",
    color: "#2c3e50",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    backgroundColor: "#e3f2fd",
    textAlign: "left",
  },
  tableRow: {
    borderBottom: "1px solid #eee",
  },
  th: {
    padding: "0.75rem",
    fontWeight: "600",
  },
  td: {
    padding: "0.75rem",
  },
};
