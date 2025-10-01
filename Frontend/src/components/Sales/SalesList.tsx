import React, { useState, useEffect } from 'react';
import { Search, Eye, Plus, CreditCard } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import toast from 'react-hot-toast';
import apiService from '../../services/api';

interface Sale {
  id: number;
  invoice_number: string;
  customer_name: string;
  sale_date: string;
  total_amount: number;
  paid_amount: number;
  payment_status: string;
  sale_type: string;
  outlet_name: string;
}

const SalesList: React.FC = () => {
  const { selectedOutlet } = useData();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Backend data

  useEffect(() => {
    loadSales();
  }, [selectedOutlet]);

  const loadSales = async () => {
    setLoading(true);
    try {
      const data = await apiService.getSales();
      const normalized = (data?.results || data || []).map((s: any) => ({
        id: s.id,
        invoice_number: s.invoice_number,
        customer_name: s.customer_name || s.customer?.name || '',
        sale_date: s.sale_date,
        total_amount: Number(s.total_amount || 0),
        paid_amount: Number(s.paid_amount || 0),
        payment_status: s.payment_status,
        sale_type: s.sale_type,
        outlet_name: s.outlet_name || s.outlet?.name || '',
      })) as Sale[];
      setSales(normalized);
    } catch (error) {
      toast.error('Failed to load sales data');
    } finally {
      setLoading(false);
    }
  };

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterStatus || sale.payment_status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'success';
      case 'PARTIAL': return 'warning';
      case 'PENDING': return 'error';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales</h1>
          <p className="text-gray-600">Track sales and manage invoices</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary">
            <Plus className="w-4 h-4 mr-2" />
            New Sale
          </button>
          <button className="btn btn-primary">
            <CreditCard className="w-4 h-4 mr-2" />
            POS System
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card">
          <div>
            <p className="text-sm text-gray-600">Today's Sales</p>
            <p className="text-2xl font-bold text-emerald-600">₹7,950</p>
            <p className="text-sm text-gray-500">3 orders</p>
          </div>
        </div>
        <div className="stat-card">
          <div>
            <p className="text-sm text-gray-600">Pending Payments</p>
            <p className="text-2xl font-bold text-red-600">₹5,250</p>
            <p className="text-sm text-gray-500">2 invoices</p>
          </div>
        </div>
        <div className="stat-card">
          <div>
            <p className="text-sm text-gray-600">This Month</p>
            <p className="text-2xl font-bold text-blue-600">₹1,25,000</p>
            <p className="text-sm text-gray-500">45 orders</p>
          </div>
        </div>
        <div className="stat-card">
          <div>
            <p className="text-sm text-gray-600">Average Order</p>
            <p className="text-2xl font-bold text-purple-600">₹2,650</p>
            <p className="text-sm text-gray-500">per invoice</p>
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
                placeholder="Search by invoice or customer..."
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
              <option value="">All Payments</option>
              <option value="PAID">Paid</option>
              <option value="PARTIAL">Partial</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sales List */}
      <div className="card">
        {loading ? (
          <div className="p-8 text-center">
            <div className="spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading sales data...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Type</th>
                  <th>Outlet</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((sale) => (
                  <tr key={sale.id}>
                    <td>
                      <div className="font-medium text-gray-900">{sale.invoice_number}</div>
                    </td>
                    <td>
                      <span className="font-medium">{sale.customer_name}</span>
                    </td>
                    <td>
                      <span className="text-sm">{new Date(sale.sale_date).toLocaleDateString()}</span>
                    </td>
                    <td>
                      <div className="text-sm">
                        <div className="font-medium">₹{sale.total_amount.toLocaleString()}</div>
                        {sale.paid_amount < sale.total_amount && (
                          <div className="text-red-600">Due: ₹{(sale.total_amount - sale.paid_amount).toLocaleString()}</div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${getPaymentStatusColor(sale.payment_status)}`}>
                        {sale.payment_status}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        sale.sale_type === 'B2B' ? 'badge-primary' : 'badge-secondary'
                      }`}>
                        {sale.sale_type}
                      </span>
                    </td>
                    <td>
                      <span className="text-sm">{sale.outlet_name}</span>
                    </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={async () => {
                          try {
                            const { file_url } = await apiService.generateInvoicePdf(sale.id);
                            window.open(file_url, '_blank');
                          } catch {
                            toast.error('Failed to generate invoice');
                          }
                        }}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Invoice
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={async () => {
                          try {
                            const amount = Math.max(0, sale.total_amount - sale.paid_amount);
                            const order = await apiService.createPaymentOrder(sale.id, { amount, gateway: 'razorpay' });
                            toast.success(`Payment order created: ${order.order_id}`);
                          } catch {
                            toast.error('Failed to create payment order');
                          }
                        }}
                      >
                        <CreditCard className="w-3 h-3 mr-1" />
                        Pay
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={async () => {
                          try {
                            const phone = prompt('Customer WhatsApp number (with country code)');
                            if (!phone) return;
                            await apiService.sendInvoiceWhatsApp(sale.id, { phone });
                            toast.success('WhatsApp message queued');
                          } catch {
                            toast.error('Failed to send WhatsApp');
                          }
                        }}
                      >
                        Send WA
                      </button>
                    </div>
                  </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredSales.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No sales found matching your criteria.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesList;