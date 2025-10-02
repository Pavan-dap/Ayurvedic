import React, { useState, useEffect } from 'react';
import { Plus, Search, CreditCard as Edit, Trash2, User } from 'lucide-react';
import apiService from '../../services/api';
import { useData } from '../../contexts/DataContext';
import toast from 'react-hot-toast';

interface Employee {
  id: number;
  employee_id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  salary: number;
  join_date: string;
  is_active: boolean;
}

const EmployeeList: React.FC = () => {
  const { refreshTrigger } = useData();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);


  useEffect(() => {
    loadEmployees();
  }, [refreshTrigger]);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await apiService.getEmployees();
      const items = (data?.results || data || []) as Employee[];
      setEmployees(items);
    } catch (error) {
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterDepartment || employee.department === filterDepartment;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await apiService.delete(`/hr/employees/${id}/`);
        toast.success('Employee deleted successfully');
        loadEmployees();
      } catch (error) {
        toast.error('Failed to delete employee');
      }
    }
  };

  const EmployeeForm = ({ employee, onClose }: { employee?: Employee; onClose: () => void }) => {
    const [formData, setFormData] = useState({
      name: employee?.name || '',
      email: employee?.email || '',
      phone: employee?.phone || '',
      department: employee?.department || 'Production',
      designation: employee?.designation || '',
      salary: employee?.salary || 0,
      join_date: employee?.join_date || new Date().toISOString().split('T')[0],
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (employee) {
          await apiService.updateEmployee(employee.id, formData);
          toast.success('Employee updated successfully');
        } else {
          await apiService.createEmployee(formData);
          toast.success('Employee added successfully');
        }
        await loadEmployees();
        onClose();
      } catch (error) {
        toast.error('Failed to save employee');
      }
    };

    return (
      <div className="modal-overlay">
        <div className="modal-content max-w-2xl">
          <div className="modal-header">
            <h2 className="text-xl font-semibold">
              {employee ? 'Edit Employee' : 'Add New Employee'}
            </h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body space-y-4">
              <div className="form-row">
                <div>
                  <label className="label">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input"
                    placeholder="employee@email.com"
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
                  <label className="label">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="input"
                  >
                    <option value="Production">Production</option>
                    <option value="Sales & Marketing">Sales & Marketing</option>
                    <option value="Quality Control">Quality Control</option>
                    <option value="Administration">Administration</option>
                    <option value="Finance & Accounts">Finance & Accounts</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div>
                  <label className="label">Designation *</label>
                  <input
                    type="text"
                    required
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="input"
                    placeholder="Job title"
                  />
                </div>
                <div>
                  <label className="label">Salary (₹)</label>
                  <input
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                    className="input"
                    placeholder="Monthly salary"
                  />
                </div>
              </div>
              <div>
                <label className="label">Join Date</label>
                <input
                  type="date"
                  value={formData.join_date}
                  onChange={(e) => setFormData({ ...formData, join_date: e.target.value })}
                  className="input"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" onClick={onClose} className="btn btn-outline">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {employee ? 'Update' : 'Add'} Employee
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
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-600">Manage your workforce</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Employee
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center">
            <User className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div>
            <p className="text-sm text-gray-600">Active</p>
            <p className="text-2xl font-bold text-emerald-600">
              {employees.filter(e => e.is_active).length}
            </p>
          </div>
        </div>
        <div className="stat-card">
          <div>
            <p className="text-sm text-gray-600">Departments</p>
            <p className="text-2xl font-bold text-purple-600">5</p>
          </div>
        </div>
        <div className="stat-card">
          <div>
            <p className="text-sm text-gray-600">Avg Salary</p>
            <p className="text-2xl font-bold text-amber-600">
              ₹{Math.round(employees.reduce((sum, e) => sum + e.salary, 0) / employees.length || 0).toLocaleString()}
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
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="input"
            >
              <option value="">All Departments</option>
              <option value="Production">Production</option>
              <option value="Sales & Marketing">Sales & Marketing</option>
              <option value="Quality Control">Quality Control</option>
              <option value="Administration">Administration</option>
              <option value="Finance & Accounts">Finance & Accounts</option>
            </select>
          </div>
        </div>
      </div>

      {/* Employee List */}
      <div className="card">
        {loading ? (
          <div className="p-8 text-center">
            <div className="spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading employees...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Contact</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Salary</th>
                  <th>Join Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td>
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                          <User className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{employee.name}</div>
                          <div className="text-sm text-gray-500">{employee.employee_id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm">
                        <div>{employee.phone}</div>
                        {employee.email && (
                          <div className="text-gray-500">{employee.email}</div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="text-sm">{employee.department}</span>
                    </td>
                    <td>
                      <span className="text-sm font-medium">{employee.designation}</span>
                    </td>
                    <td>
                      <span className="font-medium text-emerald-600">
                        ₹{employee.salary.toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <span className="text-sm">{new Date(employee.join_date).toLocaleDateString()}</span>
                    </td>
                    <td>
                      <span className={`badge ${employee.is_active ? 'badge-success' : 'badge-error'}`}>
                        {employee.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingEmployee(employee)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(employee.id)}
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

            {filteredEmployees.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No employees found matching your criteria.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <EmployeeForm onClose={() => setShowAddModal(false)} />
      )}

      {editingEmployee && (
        <EmployeeForm
          employee={editingEmployee}
          onClose={() => setEditingEmployee(null)}
        />
      )}
    </div>
  );
};

export default EmployeeList;
