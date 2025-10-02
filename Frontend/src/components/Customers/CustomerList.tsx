// import React, { useState, useEffect } from 'react';
// import { Plus, Search, Filter, CreditCard as Edit, Trash2, Eye, Phone, Mail } from 'lucide-react';
// import { useData } from '../../contexts/DataContext';
// import toast from 'react-hot-toast';

// interface Customer {
//   id: number;
//   customer_code: string;
//   name: string;
//   email: string;
//   phone: string;
//   city: string;
//   state: string;
//   customer_type: string;
//   loyalty_points: number;
//   is_active: boolean;
//   created_at: string;
// }

// const CustomerList: React.FC = () => {
//   const { refreshTrigger } = useData();
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterType, setFilterType] = useState('');
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

//   // Mock data for demo
//   const mockCustomers: Customer[] = [
//     {
//       id: 1,
//       customer_code: 'CUST1001',
//       name: 'Rajesh Medical Store',
//       email: 'rajesh@medicalstore.com',
//       phone: '9876543220',
//       city: 'Chandigarh',
//       state: 'Punjab',
//       customer_type: 'B2B',
//       loyalty_points: 150,
//       is_active: true,
//       created_at: '2024-01-15T10:30:00Z'
//     },
//     {
//       id: 2,
//       customer_code: 'CUST1002',
//       name: 'Wellness Clinic',
//       email: 'info@wellnessclinic.com',
//       phone: '9876543221',
//       city: 'Chandigarh',
//       state: 'Punjab',
//       customer_type: 'B2B',
//       loyalty_points: 320,
//       is_active: true,
//       created_at: '2024-01-16T14:20:00Z'
//     },
//     {
//       id: 3,
//       customer_code: 'CUST1003',
//       name: 'Priya Sharma',
//       email: 'priya@email.com',
//       phone: '9876543222',
//       city: 'Panchkula',
//       state: 'Haryana',
//       customer_type: 'RETAIL',
//       loyalty_points: 85,
//       is_active: true,
//       created_at: '2024-01-17T09:15:00Z'
//     },
//     {
//       id: 4,
//       customer_code: 'CUST1004',
//       name: 'Ayurveda Distributors',
//       email: 'sales@ayurvedadist.com',
//       phone: '9876543223',
//       city: 'Delhi',
//       state: 'Delhi',
//       customer_type: 'WHOLESALE',
//       loyalty_points: 500,
//       is_active: true,
//       created_at: '2024-01-18T16:45:00Z'
//     }
//   ];

//   useEffect(() => {
//     loadCustomers();
//   }, [refreshTrigger]);

//   const loadCustomers = async () => {
//     setLoading(true);
//     try {
//       // Simulate API call
//       setTimeout(() => {
//         setCustomers(mockCustomers);
//         setLoading(false);
//       }, 1000);
//     } catch (error) {
//       toast.error('Failed to load customers');
//       setLoading(false);
//     }
//   };

//   const filteredCustomers = customers.filter(customer => {
//     const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          customer.customer_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          customer.phone.includes(searchTerm);
//     const matchesFilter = !filterType || customer.customer_type === filterType;
//     return matchesSearch && matchesFilter;
//   });

//   const handleDelete = async (id: number) => {
//     if (window.confirm('Are you sure you want to delete this customer?')) {
//       try {
//         // Simulate API call
//         setCustomers(customers.filter(c => c.id !== id));
//         toast.success('Customer deleted successfully');
//       } catch (error) {
//         toast.error('Failed to delete customer');
//       }
//     }
//   };

//   const CustomerForm = ({ customer, onClose }: { customer?: Customer; onClose: () => void }) => {
//     const [formData, setFormData] = useState({
//       name: customer?.name || '',
//       email: customer?.email || '',
//       phone: customer?.phone || '',
//       address_line1: '',
//       city: customer?.city || '',
//       state: customer?.state || '',
//       pincode: '',
//       customer_type: customer?.customer_type || 'RETAIL',
//     });

//     const handleSubmit = async (e: React.FormEvent) => {
//       e.preventDefault();
//       try {
//         if (customer) {
//           // Update existing customer
//           const updatedCustomer = { ...customer, ...formData };
//           setCustomers(customers.map(c => c.id === customer.id ? updatedCustomer : c));
//           toast.success('Customer updated successfully');
//         } else {
//           // Add new customer
//           const newCustomer: Customer = {
//             id: Date.now(),
//             customer_code: `CUST${String(Date.now()).slice(-4)}`,
//             ...formData,
//             loyalty_points: 0,
//             is_active: true,
//             created_at: new Date().toISOString()
//           };
//           setCustomers([...customers, newCustomer]);
//           toast.success('Customer added successfully');
//         }
//         onClose();
//       } catch (error) {
//         toast.error('Failed to save customer');
//       }
//     };

//     return (
//       <div className="modal-overlay">
//         <div className="modal-content max-w-2xl">
//           <div className="modal-header">
//             <h2 className="text-xl font-semibold">
//               {customer ? 'Edit Customer' : 'Add New Customer'}
//             </h2>
//           </div>
//           <form onSubmit={handleSubmit}>
//             <div className="modal-body space-y-4">
//               <div className="form-row">
//                 <div>
//                   <label className="label">Customer Name *</label>
//                   <input
//                     type="text"
//                     required
//                     value={formData.name}
//                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                     className="input"
//                     placeholder="Enter customer name"
//                   />
//                 </div>
//                 <div>
//                   <label className="label">Customer Type</label>
//                   <select
//                     value={formData.customer_type}
//                     onChange={(e) => setFormData({ ...formData, customer_type: e.target.value })}
//                     className="input"
//                   >
//                     <option value="RETAIL">Retail</option>
//                     <option value="B2B">B2B</option>
//                     <option value="B2C">B2C</option>
//                     <option value="WHOLESALE">Wholesale</option>
//                   </select>
//                 </div>
//               </div>
//               <div className="form-row">
//                 <div>
//                   <label className="label">Email</label>
//                   <input
//                     type="email"
//                     value={formData.email}
//                     onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                     className="input"
//                     placeholder="customer@email.com"
//                   />
//                 </div>
//                 <div>
//                   <label className="label">Phone *</label>
//                   <input
//                     type="tel"
//                     required
//                     value={formData.phone}
//                     onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                     className="input"
//                     placeholder="9876543210"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="label">Address</label>
//                 <input
//                   type="text"
//                   value={formData.address_line1}
//                   onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
//                   className="input"
//                   placeholder="Street address"
//                 />
//               </div>
//               <div className="form-row">
//                 <div>
//                   <label className="label">City</label>
//                   <input
//                     type="text"
//                     value={formData.city}
//                     onChange={(e) => setFormData({ ...formData, city: e.target.value })}
//                     className="input"
//                     placeholder="City"
//                   />
//                 </div>
//                 <div>
//                   <label className="label">State</label>
//                   <input
//                     type="text"
//                     value={formData.state}
//                     onChange={(e) => setFormData({ ...formData, state: e.target.value })}
//                     className="input"
//                     placeholder="State"
//                   />
//                 </div>
//               </div>
//             </div>
//             <div className="modal-footer">
//               <button type="button" onClick={onClose} className="btn btn-outline">
//                 Cancel
//               </button>
//               <button type="submit" className="btn btn-primary">
//                 {customer ? 'Update' : 'Add'} Customer
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
//           <p className="text-gray-600">Manage your customer database</p>
//         </div>
//         <button
//           onClick={() => setShowAddModal(true)}
//           className="btn btn-primary"
//         >
//           <Plus className="w-4 h-4 mr-2" />
//           Add Customer
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="card p-4">
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div className="flex-1">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <input
//                 type="text"
//                 placeholder="Search customers..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="input pl-10"
//               />
//             </div>
//           </div>
//           <div className="sm:w-48">
//             <select
//               value={filterType}
//               onChange={(e) => setFilterType(e.target.value)}
//               className="input"
//             >
//               <option value="">All Types</option>
//               <option value="RETAIL">Retail</option>
//               <option value="B2B">B2B</option>
//               <option value="B2C">B2C</option>
//               <option value="WHOLESALE">Wholesale</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Customer List */}
//       <div className="card">
//         {loading ? (
//           <div className="p-8 text-center">
//             <div className="spinner w-8 h-8 mx-auto mb-4"></div>
//             <p className="text-gray-500">Loading customers...</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="table">
//               <thead>
//                 <tr>
//                   <th>Customer</th>
//                   <th>Contact</th>
//                   <th>Location</th>
//                   <th>Type</th>
//                   <th>Loyalty Points</th>
//                   <th>Status</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredCustomers.map((customer) => (
//                   <tr key={customer.id}>
//                     <td>
//                       <div>
//                         <div className="font-medium text-gray-900">{customer.name}</div>
//                         <div className="text-sm text-gray-500">{customer.customer_code}</div>
//                       </div>
//                     </td>
//                     <td>
//                       <div className="space-y-1">
//                         <div className="flex items-center text-sm">
//                           <Phone className="w-3 h-3 mr-1 text-gray-400" />
//                           {customer.phone}
//                         </div>
//                         {customer.email && (
//                           <div className="flex items-center text-sm text-gray-500">
//                             <Mail className="w-3 h-3 mr-1 text-gray-400" />
//                             {customer.email}
//                           </div>
//                         )}
//                       </div>
//                     </td>
//                     <td>
//                       <div className="text-sm">
//                         <div>{customer.city}</div>
//                         <div className="text-gray-500">{customer.state}</div>
//                       </div>
//                     </td>
//                     <td>
//                       <span className={`badge ${
//                         customer.customer_type === 'B2B' ? 'badge-primary' :
//                         customer.customer_type === 'WHOLESALE' ? 'badge-secondary' :
//                         'badge-success'
//                       }`}>
//                         {customer.customer_type}
//                       </span>
//                     </td>
//                     <td>
//                       <span className="font-medium text-emerald-600">
//                         {customer.loyalty_points} pts
//                       </span>
//                     </td>
//                     <td>
//                       <span className={`badge ${customer.is_active ? 'badge-success' : 'badge-error'}`}>
//                         {customer.is_active ? 'Active' : 'Inactive'}
//                       </span>
//                     </td>
//                     <td>
//                       <div className="flex items-center space-x-2">
//                         <button
//                           onClick={() => setEditingCustomer(customer)}
//                           className="p-1 text-blue-600 hover:bg-blue-50 rounded"
//                         >
//                           <Edit className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(customer.id)}
//                           className="p-1 text-red-600 hover:bg-red-50 rounded"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {filteredCustomers.length === 0 && (
//               <div className="p-8 text-center text-gray-500">
//                 No customers found matching your criteria.
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Modals */}
//       {showAddModal && (
//         <CustomerForm onClose={() => setShowAddModal(false)} />
//       )}

//       {editingCustomer && (
//         <CustomerForm
//           customer={editingCustomer}
//           onClose={() => setEditingCustomer(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default CustomerList;


import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import { Plus, Search, CreditCard as Edit, Trash2, Phone, Mail } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

interface Customer {
  id: number;
  customer_code: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  customer_type: string;
  loyalty_points: number;
  is_active: boolean;
  created_at: string;
}

// Uses shared authenticated API client

const CustomerList: React.FC = () => {
  const { refreshTrigger } = useData();
  const { isDemo } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    loadCustomers();
  }, [refreshTrigger, searchTerm, filterType]);

  // ✅ Load customers from API (or mock in demo)
  const loadCustomers = async () => {
    setLoading(true);
    try {
      if (isDemo) {
        const mock: Customer[] = [
          { id: 1, customer_code: 'CUST0001', name: 'Rajesh Kumar', email: 'rajesh@example.com', phone: '9876543210', city: 'Chandigarh', state: 'Punjab', customer_type: 'RETAIL', loyalty_points: 120, is_active: true, created_at: '2024-01-15' },
          { id: 2, customer_code: 'CUST0002', name: 'Priya Sharma', email: 'priya@example.com', phone: '9876543211', city: 'Mohali', state: 'Punjab', customer_type: 'B2B', loyalty_points: 300, is_active: true, created_at: '2024-01-16' },
        ];
        const filtered = mock.filter(c =>
          (!searchTerm || c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.customer_code.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone.includes(searchTerm)) &&
          (!filterType || c.customer_type === filterType)
        );
        setCustomers(filtered);
        return;
      }
      const params = new URLSearchParams({ ordering: '-created_at' });
      if (searchTerm) params.set('search', searchTerm);
      if (filterType) params.set('customer_type', filterType);
      const data = await apiService.get(`/customers/customers/?${params.toString()}`);
      const items = data?.results || data || [];
      setCustomers(items);
    } catch (error) {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete customer API
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await apiService.delete(`/customers/customers/${id}/`);
        toast.success('Customer deleted successfully');
        loadCustomers();
      } catch (error) {
        toast.error('Failed to delete customer');
      }
    }
  };

  // ✅ Add/Edit Form
  const CustomerForm = ({ customer, onClose }: { customer?: Customer; onClose: () => void }) => {
    const [formData, setFormData] = useState({
      name: customer?.name || '',
      email: customer?.email || '',
      phone: customer?.phone || '',
      address_line1: '',
      city: customer?.city || '',
      state: customer?.state || '',
      pincode: '',
      customer_type: customer?.customer_type || 'RETAIL',
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (customer) {
          // Update existing customer
          await apiService.put(`/customers/customers/${customer.id}/`, formData);
          toast.success('Customer updated successfully');
        } else {
          // Add new customer
          await apiService.post(`/customers/customers/`, formData);
          toast.success('Customer added successfully');
        }
        loadCustomers();
        onClose();
      } catch (error) {
        toast.error('Failed to save customer');
      }
    };

    return (
      <div className="modal-overlay">
        <div className="modal-content max-w-2xl">
          <div className="modal-header">
            <h2 className="text-xl font-semibold">
              {customer ? 'Edit Customer' : 'Add New Customer'}
            </h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body space-y-4">
              <div className="form-row">
                <div>
                  <label className="label">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input"
                    placeholder="Enter customer name"
                  />
                </div>
                <div>
                  <label className="label">Customer Type</label>
                  <select
                    value={formData.customer_type}
                    onChange={(e) => setFormData({ ...formData, customer_type: e.target.value })}
                    className="input"
                  >
                    <option value="RETAIL">Retail</option>
                    <option value="B2B">B2B</option>
                    <option value="B2C">B2C</option>
                    <option value="WHOLESALE">Wholesale</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input"
                    placeholder="customer@email.com"
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
                {customer ? 'Update' : 'Add'} Customer
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // ✅ Filtered customers from API response
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.customer_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    const matchesFilter = !filterType || customer.customer_type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600">Manage your customer database</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
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
                placeholder="Search customers..."
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
              <option value="RETAIL">Retail</option>
              <option value="B2B">B2B</option>
              <option value="B2C">B2C</option>
              <option value="WHOLESALE">Wholesale</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customer List */}
      <div className="card">
        {loading ? (
          <div className="p-8 text-center">
            <div className="spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading customers...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Loyalty Points</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <div>
                        <div className="font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.customer_code}</div>
                      </div>
                    </td>
                    <td>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Phone className="w-3 h-3 mr-1 text-gray-400" />
                          {customer.phone}
                        </div>
                        {customer.email && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Mail className="w-3 h-3 mr-1 text-gray-400" />
                            {customer.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="text-sm">
                        <div>{customer.city}</div>
                        <div className="text-gray-500">{customer.state}</div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        customer.customer_type === 'B2B' ? 'badge-primary' :
                        customer.customer_type === 'WHOLESALE' ? 'badge-secondary' :
                        'badge-success'
                      }`}>
                        {customer.customer_type}
                      </span>
                    </td>
                    <td>
                      <span className="font-medium text-emerald-600">
                        {customer.loyalty_points} pts
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${customer.is_active ? 'badge-success' : 'badge-error'}`}>
                        {customer.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingCustomer(customer)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(customer.id)}
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

            {filteredCustomers.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No customers found matching your criteria.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <CustomerForm onClose={() => setShowAddModal(false)} />
      )}
      {editingCustomer && (
        <CustomerForm
          customer={editingCustomer}
          onClose={() => setEditingCustomer(null)}
        />
      )}
    </div>
  );
};

export default CustomerList;
