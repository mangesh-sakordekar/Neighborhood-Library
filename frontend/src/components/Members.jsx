import React from "react";
import { getMembers, addMember, updateMember, deleteMember } from "../api";
import { toast } from "react-toastify";
import EntityForm from "./EntityForm";
import CrudTable from "./CrudTable";
import "../styles/Library.css";

export default function Members() {
  const [members, setMembers] = React.useState([]);
  const [message, setMessage] = React.useState("");
  const [isAdding, setIsAdding] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [selectedMember, setSelectedMember] = React.useState(null);

  const fetchMembers = async () => {
    try {
      const res = await getMembers();
      const data = Array.isArray(res.data) ? res.data : res.data?.members || [];
      setMembers(data);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to load members");
    }
  };

  React.useEffect(() => { fetchMembers(); }, []);

  const handleAdd = async (values) => {
    setIsAdding(true);
    try {
      await addMember(values);
      toast.success("Member added");
      await fetchMembers();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to add member");
    } finally { setIsAdding(false); }
  };

  const [addValues, setAddValues] = React.useState({ name: "", contact: "" });

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedMember) return setMessage("Select a member to update");
    setIsUpdating(true);
    try {
      await updateMember(selectedMember.id, { name: selectedMember.name, contact: selectedMember.contact });
      toast.success("Member updated");
      setSelectedMember(null);
      await fetchMembers();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update member");
    } finally { setIsUpdating(false); }
  };

  const handleDelete = async (row) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    try {
      await deleteMember(row.id);
      toast.success("Member deleted");
      await fetchMembers();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Cannot delete member with borrowed books");
    }
  };

  const addFields = [
    { name: "name", label: "Name", required: true },
    { name: "contact", label: "Contact", required: true },
  ];

  const updateFields = [
    { name: "name", label: "Name", required: true },
    { name: "contact", label: "Contact", required: true },
  ];

  const onAddChange = (name, value) => setAddValues(prev => ({ ...prev, [name]: value }));

  const onAddSubmit = (e) => {
    e.preventDefault();
    handleAdd(addValues);
    setAddValues({ name: "", contact: "" });
  };

  return (
  <div className="wrapper">
      <EntityForm
        title="Add Member:"
        fields={addFields}
        values={addValues}
        onChange={onAddChange}
        onSubmit={onAddSubmit}
        isSubmitting={isAdding}
        submitLabel="Add"
      />

      {/* For simplicity, use native form for update but powered by EntityForm-like pattern */}
      <form onSubmit={handleUpdate} className="form">
        <h3 className="formTitle">Update Member:</h3>
        <select className="input" value={selectedMember?.id ?? ""} onChange={(e) => {
          const id = e.target.value;
          const m = members.find(x => String(x.id) === String(id));
          setSelectedMember(m || null);
        }}>
          <option value="">Select Member</option>
          {members.map(m => <option key={m.id} value={m.id}>{m.name} (ID: {m.id})</option>)}
        </select>

        <input className="input" placeholder="New Name" value={selectedMember?.name ?? ""} onChange={(e) => setSelectedMember(prev => ({ ...(prev||{}), name: e.target.value }))} />
        <input className="input" placeholder="New Contact" value={selectedMember?.contact ?? ""} onChange={(e) => setSelectedMember(prev => ({ ...(prev||{}), contact: e.target.value }))} />
        <button className="button" type="submit" disabled={isUpdating}>{isUpdating ? "Updating..." : "Update"}</button>
      </form>

      {message && <p className="message">{message}</p>}

      <div className="headerRow">
          <h2 className="heading">👥 Members</h2>
      </div>
      <CrudTable
        columns={[{ key: "id", label: "ID" }, { key: "name", label: "Name" }, { key: "contact", label: "Contact" }]}
        data={members}
        actions={[{ label: "Delete", onClick: handleDelete, confirmMessage: "Delete member?" }]}
        keyField="id"
      />
    </div>
  );
}
