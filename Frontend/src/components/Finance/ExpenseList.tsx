import React, { useState, useEffect } from 'react';
import { Plus, Search, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import toast from 'react-hot-toast';
import apiService from '../../services/api';

interface Expense {
  id: number;
  expense_number: string;
  category: string;
  amount: number;
  expense_date: string;
  description: string;
  vendor_name: string;
  payment_method: string;
  is_approved: boolean;
  outlet_name: string;
}

const ExpenseList: React.FC = () => {
  const { selectedOutlet } = useData();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadExpenses();
  }, [selectedOutlet]);

  const loadExpenses = async () => {
    setLoading(true);
    try {
      const data = await apiService.get('/finance/expenses/');
      const items = data?.results || data || [];
      setExpenses(items);
    } catch (e) {
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.expense_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.vendor_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterCategory || expense.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  const handleApprove = async (id: number) => {
    try {
      await apiService.post(`/finance/expenses/${id}/approve_expense/`, {});
      toast.success('Expense approved');
      loadExpenses();
    } catch (e) {
      toast.error('Failed to approve expense');
    }
  };

  const ExpenseForm = ({ onClose }: { onClose: () => void }) => {
    const [formData, setFormData] = useState({
      category: 'Raw Materials',
      amount: 0,
      expense_date: new Date().toISOString().split('T')[0],
      description: '',
      vendor_name: '',
      payment_method: 'CASH',
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const newExpense: Expense = {
          id: Date.now(),
          expense_number: `EXP${Date.now()}`,
          ...formData,
          is_approved: false,
          outlet_name: 'Main Unit'
        };
        setExpenses([...expenses, newExpense]);
        toast.success('Expense added successfully');
        onClose();
      } catch (error) {
        toast.error('Failed to add expense');
      }
    };

    return (
      <div className="modal-overlay">
        <div className="modal-content max-w-2xl">
          <div className="modal-header">
            <h2 className="text-xl font-semibold">Add New Expense</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body space-y-4">
              <div className="form-row">
                <div>
                  <label className="label">Category *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input"
                  >
                    <option value="Raw Materials">Raw Materials</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Office Expenses">Office Expenses</option>
                    <option value="Equipment">Equipment</option>
                  </select>
                </div>
                <div>
                  <label className="label">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="input"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="form-row">
                <div>
                  <label className="label">Expense Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.expense_date}
                    onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Payment Method</label>
                  <select
                    value={formData.payment_method}
                    onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                    className="input"
                  >
                    <option value="CASH">Cash</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="CHEQUE">Cheque</option>
                    <option value="CARD">Card</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Vendor Name</label>
                <input
                  type="text"
                  value={formData.vendor_name}
                  onChange={(e) => setFormData({ ...formData, vendor_name: e.target.value })}
                  className="input"
                  placeholder="Vendor or supplier name"
                />
              </div>
              <div>
                <label className="label">Description *</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input"
                  rows={3}
                  placeholder="Describe the expense..."
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" onClick={onClose} className="btn btn-outline">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Add Expense
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const approvedExpenses = expenses.filter(exp => exp.is_approved).reduce((sum, exp) => sum + exp.amount, 0);
  const pendingExpenses = expenses.filter(exp => !exp.is_approved).reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-600">Track and manage business expenses</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Expense
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalExpenses.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-emerald-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-emerald-600">₹{approvedExpenses.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-amber-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-amber-600">₹{pendingExpenses.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div>
            <p className="text-sm text-gray-600">This Month</p>
            <p className="text-2xl font-bold text-purple-600">₹{totalExpenses.toLocaleString()}</p>
            <p className="text-sm text-gray-500">{expenses.length} expenses</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input"
            >
              <option value="">All Categories</option>
              <option value="Raw Materials">Raw Materials</option>
              <option value="Utilities">Utilities</option>
              <option value="Transportation">Transportation</option>
              <option value="Marketing">Marketing</option>
              <option value="Office Expenses">Office Expenses</option>
              <option value="Equipment">Equipment</option>
            </select>
          </div>
        </div>
      </div>

      {/* Expense List */}
      <div className="card">
        {loading ? (
          <div className="p-8 text-center">
            <div className="spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading expenses...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Expense Details</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Vendor</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>
                      <div>
                        <div className="font-medium text-gray-900">{expense.expense_number}</div>
                        <div className="text-sm text-gray-500">{expense.description}</div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-secondary">{expense.category}</span>
                    </td>
                    <td>
                      <span className="font-medium text-red-600">₹{expense.amount.toLocaleString()}</span>
                    </td>
                    <td>
                      <span className="text-sm">{new Date(expense.expense_date).toLocaleDateString()}</span>
                    </td>
                    <td>
                      <span className="text-sm">{expense.vendor_name || 'N/A'}</span>
                    </td>
                    <td>
                      <span className="text-sm">{expense.payment_method.replace('_', ' ')}</span>
                    </td>
                    <td>
                      <span className={`badge ${expense.is_approved ? 'badge-success' : 'badge-warning'}`}>
                        {expense.is_approved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td>
                      {!expense.is_approved && (
                        <button
                          onClick={() => handleApprove(expense.id)}
                          className="btn btn-success btn-sm"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredExpenses.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No expenses found matching your criteria.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <ExpenseForm onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
};

export default ExpenseList;