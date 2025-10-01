import React, { useState, useEffect } from 'react';
import { Plus, Search, CreditCard as Edit, Building2, MapPin } from 'lucide-react';
import apiService from '../../services/api';
import { useData } from '../../contexts/DataContext';
import toast from 'react-hot-toast';

interface Outlet {
  id: number;
  outlet_code: string;
  name: string;
  outlet_type: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  manager_name: string;
  is_active: boolean;
  total_sales: number;
  stock_value: number;
}

const OutletList: React.FC = () => {
  const { refreshTrigger } = useData();
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingOutlet, setEditingOutlet] = useState<Outlet | null>(null);

  // Mock data
  const mockOutlets: Outlet[] = [
    {
      id: 1,
      outlet_code: 'MAIN0001',
      name: 'Main Manufacturing Unit',
      outlet_type: 'MAIN',
      address: 'Industrial Area Phase-1',
      city: 'Chandigarh',
      state: 'Punjab',
      phone: '9876543210',
      manager_name: 'Rajesh Kumar',
      is_active: true,
      total_sales: 0,
      stock_value: 500000
    },
    {
      id: 2,
      outlet_code: 'OUT0001',
      name: 'Sector 17 Store',
      outlet_type: 'RETAIL',
      address: 'SCO 123, Sector 17-C',
      city: 'Chandigarh',
      state: 'Punjab',
      phone: '9876543211',
      manager_name: 'Priya Sharma',
      is_active: true,
      total_sales: 125000,
      stock_value: 75000
    },
    {
      id: 3,
      outlet_code: 'OUT0002',
      name: 'Panchkula Outlet',
      outlet_type: 'RETAIL',
      address: 'Shop 45, Sector 5',
      city: 'Panchkula',
      state: 'Haryana',
      phone: '9876543212',
      manager_name: 'Amit Singh',
      is_active: true,
      total_sales: 95000,
      stock_value: 60000
    },
    {
      id: 4,
      outlet_code: 'OUT0003',
      name: 'Mohali Store',
      outlet_type: 'RETAIL',
      address: 'Phase 7, Mohali',
      city: 'Mohali',
      state: 'Punjab',
      phone: '9876543213',
      manager_name: 'Sunita Verma',
      is_active: true,
      total_sales: 110000,
      stock_value: 65000
    }
  ];

  useEffect(() => {
    loadOutlets();
  }, [refreshTrigger]);

  const loadOutlets = async () => {
    setLoading(true);
    try {
      const data = await apiService.getOutlets();
      const items = (data?.results || data || []) as Outlet[];
      setOutlets(items);
    } catch (error) {
      toast.error('Failed to load outlets');
    } finally {
      setLoading(false);
    }
  };

  const filteredOutlets = outlets.filter(outlet => {
    const matchesSearch = outlet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         outlet.outlet_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         outlet.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterType || outlet.outlet_type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getOutletTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      'MAIN': 'Manufacturing',
      'RETAIL': 'Retail Store',
      'WAREHOUSE': 'Warehouse',
      'DISTRIBUTION': 'Distribution'
    };
    return types[type] || type;
  };

  const getOutletTypeColor = (type: string) => {
    switch (type) {
      case 'MAIN': return 'primary';
      case 'RETAIL': return 'success';
      case 'WAREHOUSE': return 'warning';
      case 'DISTRIBUTION': return 'secondary';
      default: return 'secondary';
    }
  };

  const OutletForm = ({ outlet, onClose }: { outlet?: Outlet; onClose: () => void }) => {
    const [formData, setFormData] = useState({
      name: outlet?.name || '',
      outlet_type: outlet?.outlet_type || 'RETAIL',
      address: outlet?.address || '',
      city: outlet?.city || '',
      state: outlet?.state || '',
      phone: outlet?.phone || '',
      manager_name: outlet?.manager_name || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (outlet) {
          await apiService.put(`/outlets/outlets/${outlet.id}/`, formData);
          toast.success('Outlet updated successfully');
        } else {
          await apiService.createOutlet(formData);
          toast.success('Outlet added successfully');
        }
        await loadOutlets();
        onClose();
      } catch (error) {
        toast.error('Failed to save outlet');
      }
    };

    return (
      <div className="modal-overlay">
        <div className="modal-content max-w-2xl">
          <div className="modal-header">
            <h2 className="text-xl font-semibold">
              {outlet ? 'Edit Outlet' : 'Add New Outlet'}
            </h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body space-y-4">
              <div className="form-row">
                <div>
                  <label className="label">Outlet Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input"
                    placeholder="Enter outlet name"
                  />
                </div>
                <div>
                  <label className="label">Outlet Type</label>
                  <select
                    value={formData.outlet_type}
                    onChange={(e) => setFormData({ ...formData, outlet_type: e.target.value })}
                    className="input"
                  >
                    <option value="RETAIL">Retail Store</option>
                    <option value="WAREHOUSE">Warehouse</option>
                    <option value="DISTRIBUTION">Distribution Center</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Address *</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="input"
                  placeholder="Street address"
                />
              </div>
              <div className="form-row">
                <div>
                  <label className="label">City *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="input"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="label">State *</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="input"
                    placeholder="State"
                  />
                </div>
              </div>
              <div className="form-row">
                <div>
                  <label className="label">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input"
                    placeholder="9876543210"
                  />
                </div>
                <div>
                  <label className="label">Manager Name</label>
                  <input
                    type="text"
                    value={formData.manager_name}
                    onChange={(e) => setFormData({ ...formData, manager_name: e.target.value })}
                    className="input"
                    placeholder="Manager name"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" onClick={onClose} className="btn btn-outline">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {outlet ? 'Update' : 'Add'} Outlet
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Outlets</h1>
          <p className="text-gray-600">Manage your business locations</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Outlet
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center">
            <Building2 className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Outlets</p>
              <p className="text-2xl font-bold text-gray-900">{outlets.length}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div>
            <p className="text-sm text-gray-600">Active</p>
            <p className="text-2xl font-bold text-emerald-600">
              {outlets.filter(o => o.is_active).length}
            </p>
          </div>
        </div>
        <div className="stat-card">
          <div>
            <p className="text-sm text-gray-600">Total Sales</p>
            <p className="text-2xl font-bold text-emerald-600">
              ₹{outlets.reduce((sum, o) => sum + o.total_sales, 0).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="stat-card">
          <div>
            <p className="text-sm text-gray-600">Stock Value</p>
            <p className="text-2xl font-bold text-purple-600">
              ₹{outlets.reduce((sum, o) => sum + o.stock_value, 0).toLocaleString()}
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
                placeholder="Search outlets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input"
            >
              <option value="">All Types</option>
              <option value="MAIN">Manufacturing</option>
              <option value="RETAIL">Retail Store</option>
              <option value="WAREHOUSE">Warehouse</option>
              <option value="DISTRIBUTION">Distribution</option>
            </select>
          </div>
        </div>
      </div>

      {/* Outlet List */}
      <div className="card">
        {loading ? (
          <div className="p-8 text-center">
            <div className="spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading outlets...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Outlet</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Manager</th>
                  <th>Performance</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOutlets.map((outlet) => (
                  <tr key={outlet.id}>
                    <td>
                      <div className="flex items-center">
                        <Building2 className="w-8 h-8 text-emerald-600 mr-3" />
                        <div>
                          <div className="font-medium text-gray-900">{outlet.name}</div>
                          <div className="text-sm text-gray-500">{outlet.outlet_code}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm">
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                          {outlet.city}, {outlet.state}
                        </div>
                        <div className="text-gray-500">{outlet.phone}</div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${getOutletTypeColor(outlet.outlet_type)}`}>
                        {getOutletTypeLabel(outlet.outlet_type)}
                      </span>
                    </td>
                    <td>
                      <span className="text-sm font-medium">{outlet.manager_name}</span>
                    </td>
                    <td>
                      <div className="text-sm">
                        <div className="text-emerald-600">Sales: ₹{outlet.total_sales.toLocaleString()}</div>
                        <div className="text-purple-600">Stock: ₹{outlet.stock_value.toLocaleString()}</div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${outlet.is_active ? 'badge-success' : 'badge-error'}`}>
                        {outlet.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => setEditingOutlet(outlet)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredOutlets.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No outlets found matching your criteria.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <OutletForm onClose={() => setShowAddModal(false)} />
      )}

      {editingOutlet && (
        <OutletForm
          outlet={editingOutlet}
          onClose={() => setEditingOutlet(null)}
        />
      )}
    </div>
  );
};

export default OutletList;
