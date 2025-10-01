import React, { useState, useEffect } from 'react';
import { Plus, Search, CreditCard as Edit, Trash2, Phone, Mail, Star } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import toast from 'react-hot-toast';
import apiService from '../../services/api';

interface Vendor {
  id: number;
  vendor_code: string;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  vendor_type: string;
  performance_rating: number;
  is_active: boolean;
  created_at: string;
}

const VendorList: React.FC = () => {
  const { refreshTrigger } = useData();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  // Backend data

  useEffect(() => {
    loadVendors();
  }, [refreshTrigger]);

  const loadVendors = async () => {
    setLoading(true);
    try {
      const data = await apiService.get('/vendors/vendors/');
      const items = data?.results || data || [];
      setVendors(items);
    } catch (error) {
      toast.error('Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.vendor_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.contact_person.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterType || vendor.vendor_type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      try {
        await apiService.delete(`/vendors/vendors/${id}/`);
        await loadVendors();
        toast.success('Vendor deleted successfully');
      } catch (error) {
        toast.error('Failed to delete vendor');
      }
    }
  };

  const getVendorTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      'RAW_MATERIAL': 'Raw Material',
      'PACKAGING': 'Packaging',
      'SERVICE': 'Service',
      'EQUIPMENT': 'Equipment'
    };
    return types[type] || type;
  };

  const VendorForm = ({ vendor, onClose }: { vendor?: Vendor; onClose: () => void }) => {
    const [formData, setFormData] = useState({
      name: vendor?.name || '',
      contact_person: vendor?.contact_person || '',
      email: vendor?.email || '',
      phone: vendor?.phone || '',
      address_line1: '',
      city: vendor?.city || '',
      state: vendor?.state || '',
      pincode: '',
      vendor_type: vendor?.vendor_type || 'RAW_MATERIAL',
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (vendor) {
          await apiService.put(`/vendors/vendors/${vendor.id}/`, formData);
          toast.success('Vendor updated successfully');
        } else {
          await apiService.post(`/vendors/vendors/`, { ...formData, is_active: true });
          toast.success('Vendor added successfully');
        }
        await loadVendors();
        onClose();
      } catch (error) {
        toast.error('Failed to save vendor');
      }
    };

    return (
      <div className="modal-overlay">
        <div className="modal-content max-w-2xl">
          <div className="modal-header">
            <h2 className="text-xl font-semibold">
              {vendor ? 'Edit Vendor' : 'Add New Vendor'}
            </h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body space-y-4">
              <div className="form-row">
                <div>
                  <label className="label">Vendor Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input"
                    placeholder="Enter vendor name"
                  />
                </div>
                <div>
                  <label className="label">Vendor Type</label>
                  <select
                    value={formData.vendor_type}
                    onChange={(e) => setFormData({ ...formData, vendor_type: e.target.value })}
                    className="input"
                  >
                    <option value="RAW_MATERIAL">Raw Material</option>
                    <option value="PACKAGING">Packaging</option>
                    <option value="SERVICE">Service</option>
                    <option value="EQUIPMENT">Equipment</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div>
                  <label className="label">Contact Person *</label>
                  <input
                    type="text"
                    required
                    value={formData.contact_person}
                    onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                    className="input"
                    placeholder="Contact person name"
                  />
                </div>
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
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input"
                  placeholder="vendor@email.com"
                />
              </div>
              <div>
                <label className="label">Address</label>
                <input
                  type="text"
                  value={formData.address_line1}
                  onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                  className="input"
                  placeholder="Street address"
                />
              </div>
              <div className="form-row">
                <div>
                  <label className="label">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="input"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="label">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="input"
                    placeholder="State"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" onClick={onClose} className="btn btn-outline">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {vendor ? 'Update' : 'Add'} Vendor
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating?.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendors</h1>
          <p className="text-gray-600">Manage your vendor relationships</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Vendor
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
                placeholder="Search vendors..."
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
              <option value="RAW_MATERIAL">Raw Material</option>
              <option value="PACKAGING">Packaging</option>
              <option value="SERVICE">Service</option>
              <option value="EQUIPMENT">Equipment</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vendor List */}
      <div className="card">
        {loading ? (
          <div className="p-8 text-center">
            <div className="spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading vendors...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Vendor</th>
                  <th>Contact</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Performance</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVendors.map((vendor) => (
                  <tr key={vendor.id}>
                    <td>
                      <div>
                        <div className="font-medium text-gray-900">{vendor.name}</div>
                        <div className="text-sm text-gray-500">{vendor.vendor_code}</div>
                      </div>
                    </td>
                    <td>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{vendor.contact_person}</div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="w-3 h-3 mr-1" />
                          {vendor.phone}
                        </div>
                        {vendor.email && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Mail className="w-3 h-3 mr-1" />
                            {vendor.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="text-sm">
                        <div>{vendor.city}</div>
                        <div className="text-gray-500">{vendor.state}</div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        vendor.vendor_type === 'RAW_MATERIAL' ? 'badge-primary' :
                        vendor.vendor_type === 'PACKAGING' ? 'badge-secondary' :
                        vendor.vendor_type === 'SERVICE' ? 'badge-success' :
                        'badge-warning'
                      }`}>
                        {getVendorTypeLabel(vendor.vendor_type)}
                      </span>
                    </td>
                    <td>
                      <StarRating rating={Number(vendor?.performance_rating)} />
                    </td>
                    <td>
                      <span className={`badge ${vendor.is_active ? 'badge-success' : 'badge-error'}`}>
                        {vendor.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingVendor(vendor)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(vendor.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredVendors.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No vendors found matching your criteria.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <VendorForm onClose={() => setShowAddModal(false)} />
      )}

      {editingVendor && (
        <VendorForm
          vendor={editingVendor}
          onClose={() => setEditingVendor(null)}
        />
      )}
    </div>
  );
};

export default VendorList;