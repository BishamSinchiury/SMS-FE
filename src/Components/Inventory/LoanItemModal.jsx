import { useState } from 'react';
import './ItemsSheet.css';

function LoanItemModal({ item, onClose, onLoan }) {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  // Initial form data with borrow_qty instead of quantity
  const [formData, setFormData] = useState({
    item: item?.id || null,
    borrower_name: '',
    borrower_contact: '',
    loan_date: today,
    return_date: tomorrowStr,
    status: 'borrowed',
    borrow_qty: 1, // Default quantity to 1
  });

  const [error, setError] = useState('');

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle submit and check for quantity validation
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if quantity is valid
    if (formData.borrow_qty > item.available_quantity) {
      setError(`You cannot loan more than ${item.available_quantity} items.`);
      return;
    }

    if (formData.status === 'borrowed') {
      // Call onLoan function to loan the item
      onLoan(formData);
    } else if (formData.status === 'expense') {
      // Deduct the quantity directly if the status is 'expense'
      item.quantity -= formData.borrow_qty;
      // Call API or function to save the updated item status in the backend
      updateItemQuantity(item);
    }

    // Close the modal after loaning or updating
    onClose();
  };

  const updateItemQuantity = async (item) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/inventory/items/${item.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity: item.quantity, // Update the quantity directly
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to update item quantity');
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Loan Item: {item?.name}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="borrower_name">Borrower Name *</label>
            <input
              type="text"
              id="borrower_name"
              name="borrower_name"
              value={formData.borrower_name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="borrower_contact">Borrower Contact</label>
            <input
              type="text"
              id="borrower_contact"
              name="borrower_contact"
              value={formData.borrower_contact}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="loan_date">Loan Date *</label>
            <input
              type="date"
              id="loan_date"
              name="loan_date"
              value={formData.loan_date}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="return_date">Return Date *</label>
            <input
              type="date"
              id="return_date"
              name="return_date"
              value={formData.return_date}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="borrow_qty">Quantity *</label>
            <input
              type="number"
              id="borrow_qty" // Changed to match formData name
              name="borrow_qty" // Correct name to match state
              value={formData.borrow_qty} // Corrected value binding
              onChange={handleChange}
              min="1"
              max={item.available_quantity} // Limit quantity to available stock
              required
            />
          </div>
          <div>
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="borrowed">Borrowed</option>
              <option value="expense">Expense</option> {/* Added expense option */}
            </select>
          </div>
          {/* Display error message if quantity exceeds available stock */}
          {error && <p className="error">{error}</p>}
          <div className="modal-buttons">
            <button type="submit">Loan Item</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoanItemModal;
