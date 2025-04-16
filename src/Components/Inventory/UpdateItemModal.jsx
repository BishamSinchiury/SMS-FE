// UpdateItemModal.js
import { useState, useEffect } from 'react';

function UpdateItemModal({ item, onClose, onUpdate }) {
  const [formData, setFormData] = useState(item || {});
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch departments when the component mounts
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
        setDepartments(data); // Assuming the API returns an array of department objects
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Update Item</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            maxLength={100}
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={formData.price || ''}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            step="0.01"
            required
          />
          <input
            type="number"
            placeholder="Quantity"
            value={formData.quantity || ''}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            step="1"
            required
          />
          <input
            type="date"
            placeholder="Expiration Date"
            value={formData.exp_date || ''}
            onChange={(e) => setFormData({ ...formData, exp_date: e.target.value })}
            required
          />
          <select
            value={formData.department || ''} // Changed from 'dept' to 'department'
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
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
              Update
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

export default UpdateItemModal;