import { useState, useEffect } from "react";

const API = "https://testing-repo-six-delta.vercel.app/api/items";
function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", price: "" });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch(API);
      if (!res.ok) throw new Error("Failed to fetch items");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.description || !form.price) {
      setError("All fields are required");
      return;
    }

    try {
      const body = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
      };

      let res;
      if (editing) {
        res = await fetch(`${API}/${editing}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch(API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Request failed");
      }

      setForm({ name: "", description: "", price: "" });
      setEditing(null);
      fetchItems();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (item) => {
    setEditing(item._id);
    setForm({
      name: item.name,
      description: item.description,
      price: String(item.price),
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      fetchItems();
    } catch (err) {
      setError(err.message);
    }
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm({ name: "", description: "", price: "" });
  };

  return (
    <div className="container">
      <h1>MERN CRUD App</h1>

      {error && <div className="error">{error}</div>}

      <div className="form-card">
        <h2>{editing ? "Edit Item" : "Add New Item"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Item name"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Item description"
            />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editing ? "Update" : "Add"} Item
            </button>
            {editing && (
              <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {loading ? (
        <div className="loading">Loading items...</div>
      ) : items.length === 0 ? (
        <div className="empty">No items yet. Add one above!</div>
      ) : (
        <div className="items-list">
          {items.map((item) => (
            <div key={item._id} className="item-card">
              <div className="item-info">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <span className="item-price">${Number(item.price).toFixed(2)}</span>
              </div>
              <div className="item-actions">
                <button className="btn btn-edit" onClick={() => handleEdit(item)}>
                  Edit
                </button>
                <button className="btn btn-delete" onClick={() => handleDelete(item._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
