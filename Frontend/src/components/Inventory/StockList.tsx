import React, { useState, useEffect } from 'react';
import { Search, AlertTriangle, Calendar, Package } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import apiService from '../../services/api';

interface Stock {
  id: number;
  product_name: string;
  product_code: string;
  batch_number: string;
  quantity: number;
  available_quantity: number;
  reserved_quantity: number;
  unit_cost: number;
  expiry_date: string;
  outlet_name: string;
  days_to_expiry: number;
}

const StockList: React.FC = () => {
  const { selectedOutlet } = useData();
  const { isDemo } = useAuth();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAlert, setFilterAlert] = useState('');

  useEffect(() => {
    loadStocks();
  }, [selectedOutlet]);

  const loadStocks = async () => {
    setLoading(true);
    try {
      if (isDemo) {
        const today = new Date();
        const d = (n: number) => new Date(today.getTime() + n * 24 * 3600 * 1000).toISOString();
        const mock: Stock[] = [
          { id: 1, product_name: 'Brahmi Hair Oil', product_code: 'PROD-0001', batch_number: 'B2301', quantity: 200, available_quantity: 180, reserved_quantity: 20, unit_cost: 120, expiry_date: d(120), outlet_name: 'Main Manufacturing Unit', days_to_expiry: 120 },
          { id: 2, product_name: 'Triphala Churna', product_code: 'PROD-0002', batch_number: 'T2402', quantity: 90, available_quantity: 15, reserved_quantity: 5, unit_cost: 80, expiry_date: d(25), outlet_name: 'Sector 17 Store', days_to_expiry: 25 },
          { id: 3, product_name: 'Neem Leaves', product_code: 'RM-NEEM', batch_number: 'N2310', quantity: 500, available_quantity: 500, reserved_quantity: 0, unit_cost: 45, expiry_date: d(365), outlet_name: 'Warehouse', days_to_expiry: 365 },
        ];
        setStocks(mock);
        return;
      }
      const data = await apiService.get('/inventory/stock/');
      const items = data?.results || data || [];
      const normalized: Stock[] = items.map((s: any) => ({
        id: s.id,
        product_name: s.product_name || s.product?.name || '',
        product_code: s.product?.product_code || '',
        batch_number: s.batch_number,
        quantity: Number(s.quantity || 0),
        available_quantity: Number(s.available_quantity || s.quantity || 0),
        reserved_quantity: Number(s.reserved_quantity || 0),
        unit_cost: Number(s.unit_cost || 0),
        expiry_date: s.expiry_date,
        outlet_name: s.outlet_name || s.outlet?.name || '',
        days_to_expiry: Number(s.days_to_expiry || 0),
      }));
      setStocks(normalized);
    } catch (error) {
      toast.error('Failed to load stock data');
    } finally {
      setLoading(false);
    }
  };

  const filteredStocks = stocks.filter(stock => {
    const matchesSearch = stock.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stock.product_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stock.batch_number.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (filterAlert === 'low_stock') {
      matchesFilter = stock.available_quantity < 20;
    } else if (filterAlert === 'expiring') {
      matchesFilter = stock.days_to_expiry <= 90;
    }
    
    return matchesSearch && matchesFilter;
  });

  const getStockStatus = (stock: Stock) => {
    if (stock.days_to_expiry <= 30) {
      return { color: 'red', text: 'Expiring Soon' };
    } else if (stock.available_quantity < 20) {
      return { color: 'amber', text: 'Low Stock' };
    } else {
      return { color: 'green', text: 'Good' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stock Management</h1>
          <p className="text-gray-600">Monitor inventory levels and batch details</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{stocks.length}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-amber-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-amber-600">
                {stocks.filter(s => s.available_quantity < 20).length}
              </p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-red-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-red-600">
                {stocks.filter(s => s.days_to_expiry <= 90).length}
              </p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-emerald-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-emerald-600">
                ₹{stocks.reduce((sum, s) => sum + (s.quantity * s.unit_cost), 0).toLocaleString()}
              </p>
            </div>
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
                placeholder="Search by product name, code, or batch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={filterAlert}
              onChange={(e) => setFilterAlert(e.target.value)}
              className="input"
            >
              <option value="">All Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="expiring">Expiring Soon</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stock List */}
      <div className="card">
        {loading ? (
          <div className="p-8 text-center">
            <div className="spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading stock data...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Batch Details</th>
                  <th>Quantity</th>
                  <th>Value</th>
                  <th>Expiry</th>
                  <th>Outlet</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredStocks.map((stock) => {
                  const status = getStockStatus(stock);
                  return (
                    <tr key={stock.id}>
                      <td>
                        <div>
                          <div className="font-medium text-gray-900">{stock.product_name}</div>
                          <div className="text-sm text-gray-500">{stock.product_code}</div>
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          <div className="font-medium">{stock.batch_number}</div>
                          <div className="text-gray-500">₹{stock.unit_cost.toFixed(2)} per unit</div>
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          <div className="font-medium">Available: {stock.available_quantity}</div>
                          <div className="text-gray-500">Reserved: {stock.reserved_quantity}</div>
                          <div className="text-gray-500">Total: {stock.quantity}</div>
                        </div>
                      </td>
                      <td>
                        <div className="font-medium text-emerald-600">
                          ₹{(stock.quantity * stock.unit_cost).toLocaleString()}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          <div>{new Date(stock.expiry_date).toLocaleDateString()}</div>
                          <div className={`text-${status.color}-600`}>
                            {stock.days_to_expiry} days left
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="text-sm">{stock.outlet_name}</span>
                      </td>
                      <td>
                        <span className={`badge badge-${status.color === 'green' ? 'success' : status.color === 'amber' ? 'warning' : 'error'}`}>
                          {status.text}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredStocks.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No stock items found matching your criteria.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StockList;
