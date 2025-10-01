import React, { useState, useEffect } from 'react';
import { Plus, Search, Eye, CheckCircle, Clock } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import toast from 'react-hot-toast';
import apiService from '../../services/api';

interface PurchaseOrder {
  id: number;
  po_number: string;
  vendor_name: string;
  po_date: string;
  expected_delivery: string;
  status: string;
  total_amount: number;
  items: POItem[];
}

interface POItem {
  id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

const PurchaseOrderList: React.FC = () => {
  const { refreshTrigger } = useData();
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);

  // Mock data
  const mockOrders: PurchaseOrder[] = [
    {
      id: 1,
      po_number: 'PO20240101',
      vendor_name: 'Himalayan Herbs Pvt Ltd',
      po_date: '2024-01-15',
      expected_delivery: '2024-01-25',
      status: 'CONFIRMED',
      total_amount: 25000,
      items: [
        { id: 1, product_name: 'Brahmi Leaves', quantity: 50, unit_price: 800, total_price: 40000 },
        { id: 2, product_name: 'Amla Powder', quantity: 25, unit_price: 600, total_price: 15000 }
      ]
    },
    {
      id: 2,
      po_number: 'PO20240102',
      vendor_name: 'Packaging Solutions',
      po_date: '2024-01-18',
      expected_delivery: '2024-01-28',
      status: 'SENT',
      total_amount: 15000,
      items: [
        { id: 3, product_name: 'Glass Bottles 100ml', quantity: 1000, unit_price: 15, total_price: 15000 }
      ]
    }
  ];

  useEffect(() => {
    loadOrders();
  }, [refreshTrigger]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await apiService.getPurchaseOrders();
      const items = (data?.results || data || []) as PurchaseOrder[];
      setOrders(items);
    } catch (error) {
      toast.error('Failed to load purchase orders');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.po_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.vendor_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterStatus || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'success';
      case 'SENT': return 'warning';
      case 'DRAFT': return 'secondary';
      case 'COMPLETED': return 'primary';
      default: return 'secondary';
    }
  };

  const confirmOrder = async (id: number) => {
    try {
      await apiService.confirmPurchaseOrder(id);
      toast.success('Purchase order confirmed');
      loadOrders();
    } catch (error) {
      toast.error('Failed to confirm order');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Purchase Orders</h1>
          <p className="text-gray-600">Manage purchase orders and procurement</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          New PO
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search purchase orders..."
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
              <option value="DRAFT">Draft</option>
              <option value="SENT">Sent</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="card">
        {loading ? (
          <div className="p-8 text-center">
            <div className="spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading purchase orders...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>PO Details</th>
                  <th>Vendor</th>
                  <th>Dates</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <div>
                        <div className="font-medium text-gray-900">{order.po_number}</div>
                        <div className="text-sm text-gray-500">{order.items.length} items</div>
                      </div>
                    </td>
                    <td>
                      <span className="font-medium">{order.vendor_name}</span>
                    </td>
                    <td>
                      <div className="text-sm">
                        <div>PO: {new Date(order.po_date).toLocaleDateString()}</div>
                        <div className="text-gray-500">
                          Delivery: {new Date(order.expected_delivery).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="font-medium text-emerald-600">
                        ₹{order.total_amount.toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="btn btn-outline btn-sm"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </button>
                        {order.status === 'SENT' && (
                          <button
                            onClick={() => confirmOrder(order.id)}
                            className="btn btn-success btn-sm"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Confirm
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredOrders.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No purchase orders found matching your criteria.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content max-w-4xl">
            <div className="modal-header">
              <h2 className="text-xl font-semibold">Purchase Order Details</h2>
            </div>
            <div className="modal-body space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Order Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>PO Number:</strong> {selectedOrder.po_number}</div>
                    <div><strong>Vendor:</strong> {selectedOrder.vendor_name}</div>
                    <div><strong>Status:</strong> 
                      <span className={`badge badge-${getStatusColor(selectedOrder.status)} ml-2`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Dates</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>PO Date:</strong> {new Date(selectedOrder.po_date).toLocaleDateString()}</div>
                    <div><strong>Expected Delivery:</strong> {new Date(selectedOrder.expected_delivery).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-semibold mb-3">Items</h3>
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id}>
                          <td>{item.product_name}</td>
                          <td>{item.quantity}</td>
                          <td>₹{item.unit_price}</td>
                          <td>₹{item.total_price.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="font-semibold">
                        <td colSpan={3}>Total Amount:</td>
                        <td>₹{selectedOrder.total_amount.toLocaleString()}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setSelectedOrder(null)} className="btn btn-outline">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseOrderList;
