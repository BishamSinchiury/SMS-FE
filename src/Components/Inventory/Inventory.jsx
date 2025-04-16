import { useState, useEffect } from 'react'
import AddItemModal from './AddItemModal.jsx'
import UpdateItemModal from './UpdateItemModal.jsx'
import LoanItemModal from './LoanItemModal.jsx'
import ReturnItemModal from './ReturnItemModal.jsx'
import './ItemsSheet.css'

function ItemsSheet() {
  const [filterDepOptions, setFilterDepOptions] = useState([])
  const [selectedDep, setSelectedDep] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRow, setSelectedRow] = useState(null)
  const [selectedLoanRow, setSelectedLoanRow] = useState(null)
  const [items, setItems] = useState([])
  const [loanedItems, setLoanedItems] = useState([])
  const [page, setPage] = useState(1)
  const [loanPage, setLoanPage] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showLoanModal, setShowLoanModal] = useState(false)
  const [showReturnModal, setShowReturnModal] = useState(false)
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false)
  const itemsPerPage = 20
  const loanedItemsPerPage = 10

  useEffect(() => {
    fetchDepartments()
  }, [])

  useEffect(() => {
    fetchItems()
    fetchLoanedItems()
  }, [page, loanPage, searchQuery, selectedDep])

  const fetchDepartments = async () => {
    setIsLoadingDepartments(true)
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/inventory/departments/')
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      const departments = data.results || data
      setFilterDepOptions(departments.map(dep => ({ id: dep.id, name: dep.name })))
    } catch (error) {
      console.error('Error fetching departments:', error)
      setFilterDepOptions([])
    } finally {
      setIsLoadingDepartments(false)
    }
  }

  const fetchItems = async () => {
    try {
      let url = `http://127.0.0.1:8000/api/v1/inventory/items/?page=${page}&limit=${itemsPerPage}`
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`
      if (selectedDep) url += `&department=${encodeURIComponent(selectedDep)}`
      
      const response = await fetch(url)
      const data = await response.json()
      setItems(data.results || data)
    } catch (error) {
      console.error('Error fetching items:', error)
    }
  }
  
  const fetchLoanedItems = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/inventory/items-loan/?page=${loanPage}&limit=${loanedItemsPerPage}`)
      const data = await response.json()
      const sortedData = (data.results || data).sort((a, b) => {
        const today = new Date()
        const aDate = new Date(a.return_date)
        const bDate = new Date(b.return_date)
        const aOverdue = a.status === 'borrowed' && aDate < today
        const bOverdue = b.status === 'borrowed' && bDate < today
        return aOverdue && !bOverdue ? -1 : !aOverdue && bOverdue ? 1 : aDate - bDate
      })
      setLoanedItems(sortedData)
    } catch (error) {
      console.error('Error fetching loaned items:', error)
    }
  }

  const handleAddItem = async (newItem) => {
    try {
      await fetch('http://127.0.0.1:8000/api/v1/inventory/items/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      })
      await fetchItems()
      setShowAddModal(false)
    } catch (error) {
      console.error('Error adding item:', error)
    }
  }

  const handleUpdateItem = async (updatedItem) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/v1/inventory/items/${updatedItem.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem)
      })
      await fetchItems()
      setShowUpdateModal(false)
    } catch (error) {
      console.error('Error updating item:', error)
    }
  }

  const handleLoanItem = async (loanData) => {
    try {
      await fetch('http://127.0.0.1:8000/api/v1/inventory/items-loan/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loanData)
      })
      await Promise.all([fetchItems(), fetchLoanedItems()])
      setShowLoanModal(false)
    } catch (error) {
      console.error('Error loaning item:', error)
    }
  }

  const handleFullReturn = async (returnData) => {
    if (!returnData.id) {
      alert('Please select a loaned item to return first')
      return
    }
    if (confirm('Are you sure you want to return this item?')) {
      try {
        await fetch(`http://127.0.0.1:8000/api/v1/inventory/items-loan/${returnData.id}/`, {
          method: 'DELETE',
        })
        await Promise.all([fetchItems(), fetchLoanedItems()])
        setSelectedLoanRow(null)
      } catch (error) {
        console.error('Error returning item:', error)
      }
    }
  }

  const handlePartialReturn = async (returnData) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/v1/inventory/items-loan/${returnData.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quantity: returnData.quantity,
          return_type: returnData.return_type
        })
      })
      await Promise.all([fetchItems(), fetchLoanedItems()])
      setShowReturnModal(false)
      setSelectedLoanRow(null)
    } catch (error) {
      console.error('Error returning item partially:', error)
    }
  }

  const handleButtonClick = (e, action) => {
    e.preventDefault()
    e.stopPropagation()
    
    switch(action) {
      case 'add':
        setShowAddModal(true)
        break
      case 'loan':
        if (!selectedRow) {
          alert('Please select an item to loan first')
          return
        }
        setShowLoanModal(true)
        break
      case 'return':
        if (!selectedLoanRow) {
          alert('Please select a loaned item to return first')
          return
        }
        setShowReturnModal(true)
        break
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchItems()
  }

  const isOverdue = (item) => {
    const today = new Date()
    const returnDate = new Date(item.return_date)
    return item.status === 'borrowed' && returnDate < today
  }

  return (
    <div className="items-main-sheet">
      <div className='items-header-div'>
        <div className='items-head'>
          <h1>STOCK ITEMS</h1>
          <div className="buttons-container">
            <button 
              className="add-item-btn"
              onClick={(e) => handleButtonClick(e, 'add')}
            >
              Add Item
            </button>
            <button 
              className="loan-item-btn"
              onClick={(e) => handleButtonClick(e, 'loan')}
            >
              Loan Item
            </button>
            <button 
              className="return-item-btn"
              onClick={(e) => handleButtonClick(e, 'return')}
            >
              Return Item
            </button>
          </div>
        </div>
      </div>
      <div className='items-tables-container'>
        <div className='items-list-div'>
          <h2 className="table-title">Inventory Items</h2>
          <div className='items-search'>
            <form onSubmit={handleSearch}>
              <select 
                value={selectedDep}
                onChange={(e) => {
                  setSelectedDep(e.target.value)
                  setPage(1)
                }}
                disabled={isLoadingDepartments}
              >
                <option value="">{isLoadingDepartments ? 'Loading...' : 'All Departments'}</option>
                {filterDepOptions.map(dep => (
                  <option key={dep.id} value={dep.id}>{dep.name}</option>
                ))}
              </select>
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search by name...'
              />
            </form>
          </div>
          <table className="items-table">
            <thead>
              <tr>
                <th></th>
                <th>S.N</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr 
                  key={item.id}
                  className={selectedRow === item.id ? 'selected' : ''}
                  onClick={() => {
                    setSelectedRow(item.id)
                    setSelectedLoanRow(null)
                  }}
                  onDoubleClick={() => {
                    setSelectedRow(item.id)
                    setShowUpdateModal(true)
                  }}
                >
                  <td><input type="checkbox" checked={selectedRow === item.id} readOnly /></td>
                  <td>{(page - 1) * itemsPerPage + index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>${item.price}</td>
                  <td>{item.department?.name || item.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span>Page {page}</span>
            <button 
              onClick={() => setPage(p => p + 1)}
              disabled={items.length < itemsPerPage}
            >
              Next
            </button>
          </div>
        </div>

        <div className='loaned-items-div'>
          <h2 className="table-title">Loaned Items</h2>
          <table className="loaned-items-table">
            <thead>
              <tr>
                <th></th>
                <th>S.N</th>
                <th>Item</th>
                <th>Borrower</th>
                <th>Qty</th>
                <th>Loan Date</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {loanedItems.map((loanedItem, index) => (
                <tr 
                  key={loanedItem.id}
                  className={`${selectedLoanRow === loanedItem.id ? 'selected' : ''} ${isOverdue(loanedItem) ? 'overdue' : ''}`}
                  onClick={() => {
                    setSelectedLoanRow(loanedItem.id)
                    setSelectedRow(null)
                  }}
                >
                  <td><input type="checkbox" checked={selectedLoanRow === loanedItem.id} readOnly /></td>
                  <td>{(loanPage - 1) * loanedItemsPerPage + index + 1}</td>
                  <td>{loanedItem.item?.name || loanedItem.item}</td>
                  <td>{loanedItem.borrower_name}</td>
                  <td>{loanedItem.borrow_qty}</td>
                  <td>{new Date(loanedItem.loan_date).toLocaleDateString()}</td>
                  <td>{new Date(loanedItem.return_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button 
              onClick={() => setLoanPage(p => Math.max(1, p - 1))}
              disabled={loanPage === 1}
            >
              Previous
            </button>
            <span>Page {loanPage}</span>
            <button 
              onClick={() => setLoanPage(p => p + 1)}
              disabled={loanedItems.length < loanedItemsPerPage}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddItemModal 
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddItem}
        />
      )}
      {showUpdateModal && (
        <UpdateItemModal 
          item={items.find(i => i.id === selectedRow)}
          onClose={() => setShowUpdateModal(false)}
          onUpdate={handleUpdateItem}
        />
      )}
      {showLoanModal && (
        <LoanItemModal 
          item={items.find(i => i.id === selectedRow)}
          onClose={() => setShowLoanModal(false)}
          onLoan={handleLoanItem}
        />
      )}
      {showReturnModal && (
        <ReturnItemModal 
          loanedItem={loanedItems.find(i => i.id === selectedLoanRow)}
          onClose={() => setShowReturnModal(false)}
          onReturn={handlePartialReturn}
          onFullReturn={handleFullReturn}
        />
      )}
    </div>
  )
}

export default ItemsSheet