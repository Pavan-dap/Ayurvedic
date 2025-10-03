import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, Building2, TrendingUp, AlertCircle } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import toast from 'react-hot-toast';

interface GSTReport {
  id: number;
  report_type: string;
  month: number;
  year: number;
  outlet_name: string;
  total_sales: number;
  b2b_sales: number;
  b2c_sales: number;
  cgst_amount: number;
  sgst_amount: number;
  igst_amount: number;
  total_tax_collected: number;
  input_tax_credit: number;
  tax_payable: number;
  status: string;
  generated_at: string;
}

interface HSNReport {
  id: number;
  hsn_code: string;
  description: string;
  total_quantity: number;
  total_value: number;
  taxable_value: number;
  cgst_amount: number;
  sgst_amount: number;
  igst_amount: number;
  month: number;
  year: number;
}

const GSTReports: React.FC = () => {
  const { selectedOutlet } = useData();
  const [gstReports, setGstReports] = useState<GSTReport[]>([]);
  const [hsnReports, setHsnReports] = useState<HSNReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'gstr1' | 'gstr3b' | 'gstr9' | 'hsn'>('gstr1');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Mock GST data
  const mockGSTReports: GSTReport[] = [
    {
      id: 1,
      report_type: 'GSTR1',
      month: 1,
      year: 2024,
      outlet_name: 'Main Manufacturing Unit',
      total_sales: 485670,
      b2b_sales: 385670,
      b2c_sales: 100000,
      cgst_amount: 29140,
      sgst_amount: 29140,
      igst_amount: 0,
      total_tax_collected: 58280,
      input_tax_credit: 15000,
      tax_payable: 43280,
      status: 'GENERATED',
      generated_at: '2024-01-31'
    },
    {
      id: 2,
      report_type: 'GSTR3B',
      month: 1,
      year: 2024,
      outlet_name: 'Sector 17 Store',
      total_sales: 125000,
      b2b_sales: 75000,
      b2c_sales: 50000,
      cgst_amount: 7500,
      sgst_amount: 7500,
      igst_amount: 0,
      total_tax_collected: 15000,
      input_tax_credit: 4500,
      tax_payable: 10500,
      status: 'GENERATED',
      generated_at: '2024-01-31'
    }
  ];

  const mockHSNReports: HSNReport[] = [
    {
      id: 1,
      hsn_code: '15159090',
      description: 'Herbal Oils',
      total_quantity: 1500,
      total_value: 180000,
      taxable_value: 180000,
      cgst_amount: 10800,
      sgst_amount: 10800,
      igst_amount: 0,
      month: 1,
      year: 2024
    },
    {
      id: 2,
      hsn_code: '12119099',
      description: 'Herbal Powders',
      total_quantity: 800,
      total_value: 160000,
      taxable_value: 160000,
      cgst_amount: 4000,
      sgst_amount: 4000,
      igst_amount: 0,
      month: 1,
      year: 2024
    }
  ];
  
    const loadReports = async () => {
      setLoading(true);
      try {
        setTimeout(() => {
          setGstReports(mockGSTReports);
          setHsnReports(mockHSNReports);
          setLoading(false);
        }, 1000);
      } catch (error) {
        toast.error('Failed to load GST reports');
        setLoading(false);
      }
    };

  useEffect(() => {
    loadReports();
  }, [selectedOutlet, selectedMonth, selectedYear]);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="spinner w-8 h-8 mx-auto mb-4"></div>
        <p className="text-gray-500">Loading reports...</p>
      </div>
    );
  }

  const generateGSTReport = async (reportType: string) => {
    try {
      toast.success(`Generating ${reportType} report...`);
      setTimeout(() => {
        const newReport: GSTReport = {
          id: Date.now(),
          report_type: reportType,
          month: selectedMonth,
          year: selectedYear,
          outlet_name: selectedOutlet === 1 ? 'Main Manufacturing Unit' : `Outlet ${selectedOutlet}`,
          total_sales: Math.floor(Math.random() * 500000) + 100000,
          b2b_sales: Math.floor(Math.random() * 300000) + 50000,
          b2c_sales: Math.floor(Math.random() * 200000) + 50000,
          cgst_amount: 0,
          sgst_amount: 0,
          igst_amount: 0,
          total_tax_collected: 0,
          input_tax_credit: Math.floor(Math.random() * 20000) + 5000,
          tax_payable: 0,
          status: 'GENERATED',
          generated_at: new Date().toISOString().split('T')[0]
        };
        
        // Calculate tax amounts
        newReport.cgst_amount = newReport.total_sales * 0.06; // 6% CGST
        newReport.sgst_amount = newReport.total_sales * 0.06; // 6% SGST
        newReport.total_tax_collected = newReport.cgst_amount + newReport.sgst_amount;
        newReport.tax_payable = newReport.total_tax_collected - newReport.input_tax_credit;

        setGstReports([newReport, ...gstReports]);
        toast.success(`${reportType} report generated successfully!`);
      }, 2000);
    } catch (error) {
      toast.error('Failed to generate GST report');
    }
  };

  const downloadReport = (report: GSTReport) => {
    toast.success(`Downloading ${report.report_type} report...`);
  };

  const getMonthName = (month: number) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1];
  };

  const GSTR1Tab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat-card">
          <div>
            <p className="text-sm text-gray-600">Total B2B Sales</p>
            <p className="text-2xl font-bold text-blue-600">
              ₹{gstReports.filter(r => r.report_type === 'GSTR1').reduce((sum, r) => sum + r.b2b_sales, 0).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="stat-card">
          <div>
            <p className="text-sm text-gray-600">Total B2C Sales</p>
            <p className="text-2xl font-bold text-emerald-600">
              ₹{gstReports.filter(r => r.report_type === 'GSTR1').reduce((sum, r) => sum + r.b2c_sales, 0).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="stat-card">
          <div>
            <p className="text-sm text-gray-600">Tax Collected</p>
            <p className="text-2xl font-bold text-purple-600">
              ₹{gstReports.filter(r => r.report_type === 'GSTR1').reduce((sum, r) => sum + r.total_tax_collected, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">GSTR-1 Reports</h3>
            <button
              onClick={() => generateGSTReport('GSTR1')}
              className="btn btn-primary"
            >
              Generate GSTR-1
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Period</th>
                <th>Outlet</th>
                <th>Total Sales</th>
                <th>B2B Sales</th>
                <th>B2C Sales</th>
                <th>Tax Collected</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {gstReports.filter(r => r.report_type === 'GSTR1').map((report) => (
                <tr key={report.id}>
                  <td>
                    <div className="font-medium">{getMonthName(report.month)} {report.year}</div>
                  </td>
                  <td>{report.outlet_name}</td>
                  <td>₹{report.total_sales.toLocaleString()}</td>
                  <td>₹{report.b2b_sales.toLocaleString()}</td>
                  <td>₹{report.b2c_sales.toLocaleString()}</td>
                  <td>₹{report.total_tax_collected.toLocaleString()}</td>
                  <td>
                    <span className="badge badge-success">{report.status}</span>
                  </td>
                  <td>
                    <button
                      onClick={() => downloadReport(report)}
                      className="btn btn-outline btn-sm"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const GSTR3BTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card">
          <div>
            <p className="text-sm text-gray-600">Outward Supplies</p>
            <p className="text-2xl font-bold text-blue-600">₹4,85,670</p>
          </div>
        </div>
        <div className="stat-card">
          <div>
            <p className="text-sm text-gray-600">Input Tax Credit</p>
            <p className="text-2xl font-bold text-emerald-600">₹15,000</p>
          </div>
        </div>
        <div className="stat-card">
          <div>
            <p className="text-sm text-gray-600">Tax Payable</p>
            <p className="text-2xl font-bold text-red-600">₹43,280</p>
          </div>
        </div>
        <div className="stat-card">
          <div>
            <p className="text-sm text-gray-600">Interest/Penalty</p>
            <p className="text-2xl font-bold text-amber-600">₹0</p>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">GSTR-3B Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Outward Supplies</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Taxable Supplies:</span>
                <span>₹4,85,670</span>
              </div>
              <div className="flex justify-between">
                <span>Zero Rated Supplies:</span>
                <span>₹0</span>
              </div>
              <div className="flex justify-between">
                <span>Exempt Supplies:</span>
                <span>₹0</span>
              </div>
              <div className="flex justify-between font-medium border-t pt-2">
                <span>Total:</span>
                <span>₹4,85,670</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-3">Tax Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>CGST:</span>
                <span>₹29,140</span>
              </div>
              <div className="flex justify-between">
                <span>SGST:</span>
                <span>₹29,140</span>
              </div>
              <div className="flex justify-between">
                <span>IGST:</span>
                <span>₹0</span>
              </div>
              <div className="flex justify-between font-medium border-t pt-2">
                <span>Total Tax:</span>
                <span>₹58,280</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => generateGSTReport('GSTR3B')}
            className="btn btn-primary"
          >
            Generate GSTR-3B
          </button>
          <button className="btn btn-outline">
            <Download className="w-4 h-4 mr-2" />
            Download JSON
          </button>
        </div>
      </div>
    </div>
  );

  const HSNTab = () => (
    <div className="space-y-6">
      <div className="card">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">HSN-wise Summary</h3>
            <button
              onClick={() => toast.success('Generating HSN report...')}
              className="btn btn-primary"
            >
              Generate HSN Report
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>HSN Code</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Total Value</th>
                <th>Taxable Value</th>
                <th>CGST</th>
                <th>SGST</th>
                <th>IGST</th>
              </tr>
            </thead>
            <tbody>
              {hsnReports.map((hsn) => (
                <tr key={hsn.id}>
                  <td>
                    <span className="font-medium">{hsn.hsn_code}</span>
                  </td>
                  <td>{hsn.description}</td>
                  <td>{hsn.total_quantity.toLocaleString()}</td>
                  <td>₹{hsn.total_value.toLocaleString()}</td>
                  <td>₹{hsn.taxable_value.toLocaleString()}</td>
                  <td>₹{hsn.cgst_amount.toLocaleString()}</td>
                  <td>₹{hsn.sgst_amount.toLocaleString()}</td>
                  <td>₹{hsn.igst_amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'gstr1', name: 'GSTR-1', description: 'Outward Supplies' },
    { id: 'gstr3b', name: 'GSTR-3B', description: 'Monthly Return' },
    { id: 'gstr9', name: 'GSTR-9', description: 'Annual Return' },
    { id: 'hsn', name: 'HSN Summary', description: 'HSN-wise Report' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">GST Reports</h1>
          <p className="text-gray-600">Generate GST compliance reports as per Indian government norms</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="input"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {getMonthName(i + 1)}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="input"
          >
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
        </div>
      </div>

      {/* GST Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-emerald-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold text-emerald-600">₹6,10,670</p>
              <p className="text-xs text-gray-500">This month</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Tax Collected</p>
              <p className="text-2xl font-bold text-blue-600">₹73,280</p>
              <p className="text-xs text-gray-500">CGST + SGST + IGST</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center">
            <Building2 className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Input Tax Credit</p>
              <p className="text-2xl font-bold text-purple-600">₹19,500</p>
              <p className="text-xs text-gray-500">Available ITC</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center">
            <AlertCircle className="w-8 h-8 text-red-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Tax Payable</p>
              <p className="text-2xl font-bold text-red-600">₹53,780</p>
              <p className="text-xs text-gray-500">Net liability</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div>
                  <div>{tab.name}</div>
                  <div className="text-xs text-gray-400">{tab.description}</div>
                </div>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'gstr1' && <GSTR1Tab />}
          {activeTab === 'gstr3b' && <GSTR3BTab />}
          {activeTab === 'gstr9' && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">GSTR-9 Annual Return</h3>
              <p className="text-gray-600 mb-4">Annual return for the financial year</p>
              <button
                onClick={() => generateGSTReport('GSTR9')}
                className="btn btn-primary"
              >
                Generate GSTR-9
              </button>
            </div>
          )}
          {activeTab === 'hsn' && <HSNTab />}
        </div>
      </div>

      {/* Filing Calendar */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">GST Filing Calendar</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center mb-2">
              <Calendar className="w-5 h-5 text-red-600 mr-2" />
              <span className="font-medium text-red-800">GSTR-1 Due</span>
            </div>
            <p className="text-sm text-red-600">Due: 11th of next month</p>
            <p className="text-xs text-red-500">For January 2024: Due 11th Feb 2024</p>
          </div>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center mb-2">
              <Calendar className="w-5 h-5 text-amber-600 mr-2" />
              <span className="font-medium text-amber-800">GSTR-3B Due</span>
            </div>
            <p className="text-sm text-amber-600">Due: 20th of next month</p>
            <p className="text-xs text-amber-500">For January 2024: Due 20th Feb 2024</p>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center mb-2">
              <Calendar className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-medium text-blue-800">GSTR-9 Due</span>
            </div>
            <p className="text-sm text-blue-600">Due: 31st December</p>
            <p className="text-xs text-blue-500">Annual return for FY 2023-24</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GSTReports;
