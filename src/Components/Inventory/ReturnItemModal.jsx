import { useState } from 'react';

function ReturnItemModal({ loanedItem, onClose, onReturn, onFullReturn }) {
  const [returnQuantity, setReturnQuantity] = useState(loanedItem.quantity);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (returnQuantity <= 0) {
      setError('Return quantity must be greater than 0');
      return;
    }

    if (returnQuantity > loanedItem.quantity) {
      setError('Return quantity cannot exceed loaned quantity');
      return;
    }

    const payload = {
      quantity: returnQuantity,
      return_type: parseInt(returnQuantity) === parseInt(loanedItem.borrow_qty) ? 'full' : 'partial',
    };

    if (payload.return_type === 'full') {
      onFullReturn({
        id: loanedItem.id,
        ...payload,
      });
    } else {
      onReturn({
        id: loanedItem.id,
        ...payload,
      });
    }

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Return Item</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Item Name</label>
            <input type="text" value={loanedItem.item} disabled />
          </div>
          <div>
            <label>Borrowed By</label>
            <input type="text" value={loanedItem.borrower_name} disabled />
          </div>
          <div>
            <label>Total Quantity Borrowed</label>
            <input type="text" value={loanedItem.borrow_qty} disabled />
          </div>
          <div>
            <label>Quantity to Return</label>
            <input
              type="number"
              value={returnQuantity}
              min="1"
              max={loanedItem.quantity}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  setReturnQuantity(''); // Allow empty input while typing
                  setError('');
                } else {
                  const parsedValue = parseInt(value);
                  if (!isNaN(parsedValue)) {
                    setReturnQuantity(Math.min(parsedValue, loanedItem.borrow_qty));
                    setError('');
                  }
                }
              }}
              onBlur={() => {
                // Reset to 1 if empty or invalid on blur
                if (returnQuantity === '' || isNaN(returnQuantity)) {
                  setReturnQuantity(1);
                }
              }}
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="modal-buttons">
            <button
              type="submit"
              disabled={returnQuantity <= 0 || returnQuantity > loanedItem.quantity}
            >
              {returnQuantity === loanedItem.borrow_qty ? 'Return All' : 'Partial Return'}
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReturnItemModal;