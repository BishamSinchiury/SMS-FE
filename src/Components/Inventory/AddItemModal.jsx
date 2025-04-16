import { useState, useEffect } from 'react';

function AddItemModal({ onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    exp_date: '',
    department: '',
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/inventory/departments/', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch departments');
        }

        const data = await response.json();
        // Handle both paginated and non-paginated responses
        const results = data.results || data;
        setDepartments(results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page refresh
    e.stopPropagation(); // Stop event bubbling
    // Convert numeric fields to proper types
    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity, 10),
    };
    onAdd(submitData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.stopPropagation()}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Add New Item</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            maxLength={100}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <input
            name="price"
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
          />
          <input
            name="quantity"
            type="number"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            step="1"
            min="0"
            required
          />
          <input
            name="exp_date"
            type="date"
            placeholder="Expiration Date"
            value={formData.exp_date}
            onChange={handleChange}
            required
          />
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            disabled={loading || error}
            required
          >
            <option value="">Select Department</option>
            {loading && <option>Loading...</option>}
            {error && <option>Error: {error}</option>}
            {!loading &&
              !error &&
              departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
          </select>
          <div className="modal-buttons">
            <button type="submit" disabled={loading}>
              Add
            </button>
            <button type="button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddItemModal;