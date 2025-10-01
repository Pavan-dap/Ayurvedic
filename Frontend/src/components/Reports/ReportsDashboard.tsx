import React, { useState } from 'react';
import { BarChart3, TrendingUp, Package, Users, DollarSign, FileText, Download, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const ReportsDashboard: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState('');
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const reportTypes = [
    {
      id: 'sales',
      name: 'Sales Report',
      description: 'Detailed sales analysis by outlet, product, and customer',
      icon: TrendingUp,
      color: 'emerald'
    },
    {
      id: 'inventory',
      name: 'Inventory Report',
      description: 'Stock levels, batch tracking, and expiry alerts',
      icon: Package,
      color: 'blue'
    },
    {
      id: 'production',
      name: 'Production Report',
      description: 'Batch-wise production costs and efficiency',
      icon: BarChart3,
      color: 'purple'
    },
    {
      id: 'financial',
      name: 'Financial Report',
      description: 'Revenue, expenses, and profit analysis',
      icon: DollarSign,
      color: 'amber'
    },
    {
      id: 'customer',
      name: 'Customer Report',
      description: 'Customer analysis and purchase patterns',
      icon: Users,
      color: 'pink'
    },
    {
      id: 'gst',
      name: 'GST Report',
      description: 'GST compliance reports (GSTR-1, GSTR-3B)',
      icon: FileText,
      color: 'indigo'
    }
  ];

  const generateReport = async (reportType: string) => {
    try {
      toast.success(`Generating ${reportType} report...`);
      // Simulate report generation
      setTimeout(() => {
        toast.success(`${reportType} report generated successfully!`);
      }, 2000);
    } catch (error) {
      toast.error('Failed to generate report');
    }
  };

  const quickStats = [
    { label: 'Today\'s Sales', value: '₹25,430', change: '+12.5%', color: 'emerald' },
    { label: 'Low Stock Items', value: '8', change: '-2', color: 'red' },
    { label: 'Pending Orders', value: '15', change: '+3', color: 'amber' },
    { label: 'Active Customers', value: '245', change: '+18', color: 'blue' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Generate comprehensive business reports</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="input text-sm"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="input text-sm"
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
              <p className={`text-sm text-${stat.color}-600`}>{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <div key={report.id} className="card p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 bg-${report.color}-100 rounded-lg`}>
                  <Icon className={`w-6 h-6 text-${report.color}-600`} />
                </div>
                <button
                  onClick={() => generateReport(report.name)}
                  className="btn btn-outline btn-sm"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Generate
                </button>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{report.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Last generated: Today</span>
                <span className={`badge badge-${report.color}`}>Available</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Reports */}
      <div className="card">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Report Name</th>
                <th>Type</th>
                <th>Generated</th>
                <th>Size</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div>
                    <div className="font-medium text-gray-900">Sales Report - January 2024</div>
                    <div className="text-sm text-gray-500">Comprehensive sales analysis</div>
                  </div>
                </td>
                <td>
                  <span className="badge badge-emerald">Sales</span>
                </td>
                <td>
                  <span className="text-sm">2 hours ago</span>
                </td>
                <td>
                  <span className="text-sm">2.4 MB</span>
                </td>
                <td>
                  <span className="badge badge-success">Ready</span>
                </td>
                <td>
                  <button className="btn btn-outline btn-sm">
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </button>
                </td>
              </tr>
              <tr>
                <td>
                  <div>
                    <div className="font-medium text-gray-900">Inventory Report - Current Stock</div>
                    <div className="text-sm text-gray-500">Stock levels and alerts</div>
                  </div>
                </td>
                <td>
                  <span className="badge badge-blue">Inventory</span>
                </td>
                <td>
                  <span className="text-sm">1 day ago</span>
                </td>
                <td>
                  <span className="text-sm">1.8 MB</span>
                </td>
                <td>
                  <span className="badge badge-success">Ready</span>
                </td>
                <td>
                  <button className="btn btn-outline btn-sm">
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </button>
                </td>
              </tr>
              <tr>
                <td>
                  <div>
                    <div className="font-medium text-gray-900">GST Report - GSTR-1</div>
                    <div className="text-sm text-gray-500">Monthly GST compliance report</div>
                  </div>
                </td>
                <td>
                  <span className="badge badge-indigo">GST</span>
                </td>
                <td>
                  <span className="text-sm">3 days ago</span>
                </td>
                <td>
                  <span className="text-sm">856 KB</span>
                </td>
                <td>
                  <span className="badge badge-warning">Processing</span>
                </td>
                <td>
                  <button className="btn btn-outline btn-sm" disabled>
                    <Download className="w-3 h-3 mr-1" />
                    Processing
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Report Builder */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Custom Report Builder</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Report Type</label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="input"
            >
              <option value="">Select report type</option>
              <option value="sales">Sales Analysis</option>
              <option value="inventory">Inventory Status</option>
              <option value="production">Production Efficiency</option>
              <option value="financial">Financial Summary</option>
            </select>
          </div>
          <div>
            <label className="label">Format</label>
            <select className="input">
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => selectedReport && generateReport(selectedReport)}
              disabled={!selectedReport}
              className="btn btn-primary w-full disabled:opacity-50"
            >
              Generate Custom Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;