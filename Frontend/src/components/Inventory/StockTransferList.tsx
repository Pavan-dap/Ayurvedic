import React, { useState, useEffect } from 'react';
import { Plus, Search, Truck, CheckCircle, Clock, ArrowRight, Package } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import toast from 'react-hot-toast';
import apiService from '../../services/api';

interface StockTransfer {
  id: number;
  transfer_number: string;
  from_outlet: string;
  to_outlet: string;
  transfer_date: string;
  expected_delivery: string;
  status: string;
  total_items: number;
  total_value: number;
  items: TransferItem[];
}

interface TransferItem {
  id: number;
  product_name: string;
  batch_number: string;
  quantity_requested: number;
  quantity_sent: number;
  quantity_received: number;
  unit_price: number;
  expiry_date: string;
}

const StockTransferList: React.FC = () => {
  const { selectedOutlet } = useData();
  const [transfers, setTransfers] = useState<StockTransfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<StockTransfer | null>(null);

  // Mock data
  const mockTransfers: StockTransfer[] = [
    {
      id: 1,
      transfer_number: 'ST20240101',
      from_outlet: 'Main Manufacturing Unit',
      to_outlet: 'Sector 17 Store',
      transfer_date: '2024-01-20',
      expected_delivery: '2024-01-21',
      status: 'IN_TRANSIT',
      total_items: 3,
      total_value: 15000,
      items: [
        {
          id: 1,
          product_name: 'Brahmi Hair Oil',
          batch_number: 'BHO202401001',
          quantity_requested: 50,
          quantity_sent: 50,
          quantity_received: 0,
          unit_price: 120,
          expiry_date: '2025-01-15'
        },
        {
          id: 2,
          product_name: 'Triphala Churna',
          batch_number: 'TC202401001',
          quantity_requested: 30,
          quantity_sent: 30,
          quantity_received: 0,
          unit_price: 200,
          expiry_date: '2025-01-20'
        }
      ]
    },
    {
      id: 2,
      transfer_number: 'ST20240102',
      from_outlet: 'Main Manufacturing Unit',
      to_outlet: 'Panchkula Outlet',
      transfer_date: '2024-01-19',
      expected_delivery: '2024-01-20',
      status: 'RECEIVED',
      total_items: 2,
      total_value: 12000,
      items: [
        {
          id: 3,
          product_name: 'Neem Face Cream',
          batch_number: 'NFC202401001',
          quantity_requested: 25,
          quantity_sent: 25,
          quantity_received: 25,
          unit_price: 250,
          expiry_date: '2025-01-25'
        }
      ]
    }
  ];

  useEffect(() => {
    loadTransfers();
  }, [selectedOutlet]);

  const loadTransfers = async () => {
    setLoading(true);
    try {
      const data = await apiService.getStockTransfer();
      const items = (data?.results || data || []) as StockTransfer[];
      setTransfers(items);
    } catch (error) {
      toast.error('Failed to load stock transfers');
    } finally {
      setLoading(false);
    }
  };

  const filteredTransfers = transfers.filter(transfer => {
    const matchesSearch = transfer.transfer_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.from_outlet.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.to_outlet.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterStatus || transfer.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'secondary';
      case 'APPROVED': return 'primary';
      case 'IN_TRANSIT': return 'warning';
      case 'RECEIVED': return 'success';
      case 'CANCELLED': return 'error';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return Clock;
      case 'APPROVED': return CheckCircle;
      case 'IN_TRANSIT': return Truck;
      case 'RECEIVED': return Package;
      default: return Clock;
    }
  };

  const updateTransferStatus = async (id: number, newStatus: string) => {
    try {
      await apiService.patch(`/inventory/movements/${id}/`, { status: newStatus });
      toast.success(`Transfer ${newStatus.toLowerCase()} successfully`);
      loadTransfers();
    } catch (error) {
      toast.error('Failed to update transfer status');
    }
  };

  const NewTransferForm = ({ onClose }: { onClose: () => void }) => {
    const [formData, setFormData] = useState({
      from_outlet: '1',
      to_outlet: '2',
      transfer_date: new Date().toISOString().split('T')[0],
      expected_delivery: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      items: [{ product_name: '', quantity: 0, batch_number: '' }]
    });

    const addItem = () => {
      setFormData({
        ...formData,
        items: [...formData.items, { product_name: '', quantity: 0, batch_number: '' }]
      });
    };

    const removeItem = (index: number) => {
      setFormData({
        ...formData,
        items: formData.items.filter((_, i) => i !== index)
      });
    };

    const updateItem = (index: number, field: string, value: any) => {
      const updatedItems = formData.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
      setFormData({ ...formData, items: updatedItems });
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await apiService.post('/inventory/movements/', {
          from_outlet: formData.from_outlet,
          to_outlet: formData.to_outlet,
          transfer_date: formData.transfer_date,
          expected_delivery: formData.expected_delivery,
          items: formData.items,
        });
        toast.success('Stock transfer created successfully');
        loadTransfers();
        onClose();
      } catch (error) {
        toast.error('Failed to create stock transfer');
      }
    };

    return (
      <div className="modal-overlay">
        <div className="modal-content max-w-4xl">
          <div className="modal-header">
            <h2 className="text-xl font-semibold">Create Stock Transfer</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body space-y-6">
              <div className="form-row">
                <div>
                  <label className="label">From Outlet *</label>
                  <select
                    required
                    value={formData.from_outlet}
                    onChange={(e) => setFormData({ ...formData, from_outlet: e.target.value })}
                    className="input"
                  >
                    <option value="1">Main Manufacturing Unit</option>
                    <option value="2">Sector 17 Store</option>
                    <option value="3">Panchkula Outlet</option>
                    <option value="4">Mohali Store</option>
                  </select>
                </div>
                <div>
                  <label className="label">To Outlet *</label>
                  <select
                    required
                    value={formData.to_outlet}
                    onChange={(e) => setFormData({ ...formData, to_outlet: e.target.value })}
                    className="input"
                  >
                    <option value="1">Main Manufacturing Unit</option>
                    <option value="2">Sector 17 Store</option>
                    <option value="3">Panchkula Outlet</option>
                    <option value="4">Mohali Store</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div>
                  <label className="label">Transfer Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.transfer_date}
                    onChange={(e) => setFormData({ ...formData, transfer_date: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Expected Delivery *</label>
                  <input
                    type="date"
                    required
                    value={formData.expected_delivery}
                    onChange={(e) => setFormData({ ...formData, expected_delivery: e.target.value })}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Transfer Items</h3>
                  <button type="button" onClick={addItem} className="btn btn-secondary btn-sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Item
                  </button>
                </div>
                
                <div className="space-y-3">
                  {formData.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-4 gap-3 p-3 bg-gray-50 rounded-lg">
                      <div>
                        <input
                          type="text"
                          placeholder="Product name"
                          value={item.product_name}
                          onChange={(e) => updateItem(index, 'product_name', e.target.value)}
                          className="input"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Batch number"
                          value={item.batch_number}
                          onChange={(e) => updateItem(index, 'batch_number', e.target.value)}
                          className="input"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          placeholder="Quantity"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                          className="input"
                        />
                      </div>
                      <div className="flex items-center">
                        {formData.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="btn btn-outline btn-sm text-red-600"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" onClick={onClose} className="btn btn-outline">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create Transfer
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const TransferDetailsModal = ({ transfer, onClose }: { transfer: StockTransfer; onClose: () => void }) => {
    return (
      <div className="modal-overlay">
        <div className="modal-content max-w-4xl">
          <div className="modal-header">
            <h2 className="text-xl font-semibold">Stock Transfer Details</h2>
          </div>
          <div className="modal-body space-y-6">
            {/* Transfer Info */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold">Transfer Information</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Transfer Number:</strong> {transfer.transfer_number}</div>
                  <div><strong>Status:</strong> 
                    <span className={`badge badge-${getStatusColor(transfer.status)} ml-2`}>
                      {transfer.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div><strong>Total Items:</strong> {transfer.total_items}</div>
                  <div><strong>Total Value:</strong> ₹{transfer.total_value.toLocaleString()}</div>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold">Route & Timeline</h3>
                <div className="flex items-center space-x-3">
                  <div className="text-center">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <div className="text-xs mt-1">{transfer.from_outlet}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <div className="text-center">
                    <div className={`w-3 h-3 rounded-full ${
                      transfer.status === 'RECEIVED' ? 'bg-emerald-500' : 'bg-gray-300'
                    }`}></div>
                    <div className="text-xs mt-1">{transfer.to_outlet}</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div><strong>Transfer Date:</strong> {new Date(transfer.transfer_date).toLocaleDateString()}</div>
                  <div><strong>Expected Delivery:</strong> {new Date(transfer.expected_delivery).toLocaleDateString()}</div>
                </div>
              </div>
            </div>

            {/* Items */}
            <div>
              <h3 className="font-semibold mb-3">Transfer Items</h3>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Batch</th>
                      <th>Requested</th>
                      <th>Sent</th>
                      <th>Received</th>
                      <th>Unit Price</th>
                      <th>Total Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transfer.items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.product_name}</td>
                        <td>{item.batch_number}</td>
                        <td>{item.quantity_requested}</td>
                        <td>{item.quantity_sent}</td>
                        <td>{item.quantity_received}</td>
                        <td>₹{item.unit_price}</td>
                        <td>₹{(item.quantity_sent * item.unit_price).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions */}
            {transfer.status === 'PENDING' && (
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    updateTransferStatus(transfer.id, 'APPROVED');
                    onClose();
                  }}
                  className="btn btn-primary"
                >
                  Approve Transfer
                </button>
              </div>
            )}

            {transfer.status === 'APPROVED' && (
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    updateTransferStatus(transfer.id, 'IN_TRANSIT');
                    onClose();
                  }}
                  className="btn btn-warning"
                >
                  Mark In Transit
                </button>
              </div>
            )}

            {transfer.status === 'IN_TRANSIT' && (
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    updateTransferStatus(transfer.id, 'RECEIVED');
                    onClose();
                  }}
                  className="btn btn-success"
                >
                  Mark as Received
                </button>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button onClick={onClose} className="btn btn-outline">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stock Transfers</h1>
          <p className="text-gray-600">Manage stock movement between outlets</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Transfer
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center">
            <Truck className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Transfers</p>
              <p className="text-2xl font-bold text-gray-900">{transfers.length}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div>
            <p className="text-sm text-gray-600">In Transit</p>
            <p className="text-2xl font-bold text-amber-600">
              {transfers.filter(t => t.status === 'IN_TRANSIT').length}
            </p>
          </div>
        </div>
        <div className="stat-card">
          <div>
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-red-600">
              {transfers.filter(t => t.status === 'PENDING').length}
            </p>
          </div>
        </div>
        <div className="stat-card">
          <div>
            <p className="text-sm text-gray-600">Total Value</p>
            <p className="text-2xl font-bold text-emerald-600">
              ₹{transfers.reduce((sum, t) => sum + t.total_value, 0).toLocaleString()}
            </p>
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
                placeholder="Search transfers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="RECEIVED">Received</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transfer List */}
      <div className="card">
        {loading ? (
          <div className="p-8 text-center">
            <div className="spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading stock transfers...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Transfer Details</th>
                  <th>Route</th>
                  <th>Timeline</th>
                  <th>Items</th>
                  <th>Value</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransfers.map((transfer) => {
                  const StatusIcon = getStatusIcon(transfer.status);
                  return (
                    <tr key={transfer.id}>
                      <td>
                        <div>
                          <div className="font-medium text-gray-900">{transfer.transfer_number}</div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center space-x-2 text-sm">
                          <span>{transfer.from_outlet}</span>
                          <ArrowRight className="w-3 h-3 text-gray-400" />
                          <span>{transfer.to_outlet}</span>
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          <div>Start: {new Date(transfer.transfer_date).toLocaleDateString()}</div>
                          <div className="text-gray-500">
                            Expected: {new Date(transfer.expected_delivery).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="font-medium">{transfer.total_items} items</span>
                      </td>
                      <td>
                        <span className="font-medium text-emerald-600">
                          ₹{transfer.total_value.toLocaleString()}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-${getStatusColor(transfer.status)} flex items-center w-fit`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {transfer.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedTransfer(transfer)}
                            className="btn btn-outline btn-sm"
                          >
                            View Details
                          </button>
                          {transfer.status === 'PENDING' && (
                            <button
                              onClick={() => updateTransferStatus(transfer.id, 'APPROVED')}
                              className="btn btn-primary btn-sm"
                            >
                              Approve
                            </button>
                          )}
                          {transfer.status === 'IN_TRANSIT' && (
                            <button
                              onClick={() => updateTransferStatus(transfer.id, 'RECEIVED')}
                              className="btn btn-success btn-sm"
                            >
                              Receive
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredTransfers.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No stock transfers found matching your criteria.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <NewTransferForm onClose={() => setShowAddModal(false)} />
      )}

      {selectedTransfer && (
        <TransferDetailsModal
          transfer={selectedTransfer}
          onClose={() => setSelectedTransfer(null)}
        />
      )}
    </div>
  );
};

export default StockTransferList;
