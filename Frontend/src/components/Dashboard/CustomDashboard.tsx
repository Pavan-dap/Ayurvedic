import React, { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit, Trash2, BarChart3, PieChart, TrendingUp, Table, Save, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

interface DashboardWidget {
  id: number;
  name: string;
  type: 'chart' | 'table' | 'metric' | 'alert';
  chart_type?: 'bar' | 'line' | 'pie' | 'doughnut';
  data_source: string;
  filters: any;
  position: { x: number; y: number; width: number; height: number };
  config: any;
  created_at: string;
}

interface SavedDashboard {
  id: number;
  name: string;
  description: string;
  widgets: DashboardWidget[];
  is_default: boolean;
  created_at: string;
}

const CustomDashboard: React.FC = () => {
  const [dashboards, setDashboards] = useState<SavedDashboard[]>([]);
  const [currentDashboard, setCurrentDashboard] = useState<SavedDashboard | null>(null);
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [showWidgetModal, setShowWidgetModal] = useState(false);
  const [showDashboardModal, setShowDashboardModal] = useState(false);
  const [editingWidget, setEditingWidget] = useState<DashboardWidget | null>(null);

  // Mock saved dashboards
  const mockDashboards: SavedDashboard[] = [
    {
      id: 1,
      name: 'Sales Overview',
      description: 'Daily sales metrics and trends',
      widgets: [
        {
          id: 1,
          name: 'Daily Sales',
          type: 'chart',
          chart_type: 'bar',
          data_source: 'sales',
          filters: { period: 'daily' },
          position: { x: 0, y: 0, width: 6, height: 4 },
          config: { title: 'Daily Sales Trend' },
          created_at: '2024-01-20'
        },
        {
          id: 2,
          name: 'Top Products',
          type: 'table',
          data_source: 'products',
          filters: { sort: 'sales_desc', limit: 10 },
          position: { x: 6, y: 0, width: 6, height: 4 },
          config: { title: 'Top Selling Products' },
          created_at: '2024-01-20'
        }
      ],
      is_default: true,
      created_at: '2024-01-20'
    },
    {
      id: 2,
      name: 'Inventory Dashboard',
      description: 'Stock levels and alerts',
      widgets: [
        {
          id: 3,
          name: 'Stock Alerts',
          type: 'alert',
          data_source: 'inventory',
          filters: { alert_type: 'low_stock' },
          position: { x: 0, y: 0, width: 4, height: 3 },
          config: { title: 'Low Stock Alerts' },
          created_at: '2024-01-20'
        }
      ],
      is_default: false,
      created_at: '2024-01-20'
    }
  ];

  useEffect(() => {
    loadDashboards();
  }, []);

  const loadDashboards = async () => {
    try {
      setTimeout(() => {
        setDashboards(mockDashboards);
        const defaultDashboard = mockDashboards.find(d => d.is_default);
        if (defaultDashboard) {
          setCurrentDashboard(defaultDashboard);
          setWidgets(defaultDashboard.widgets);
        }
      }, 500);
    } catch (error) {
      toast.error('Failed to load dashboards');
    }
  };

  const saveDashboard = async (dashboardData: any) => {
    try {
      const newDashboard: SavedDashboard = {
        id: Date.now(),
        ...dashboardData,
        widgets: widgets,
        created_at: new Date().toISOString()
      };
      setDashboards([...dashboards, newDashboard]);
      setCurrentDashboard(newDashboard);
      toast.success('Dashboard saved successfully');
    } catch (error) {
      toast.error('Failed to save dashboard');
    }
  };

  const addWidget = async (widgetData: any) => {
    try {
      const newWidget: DashboardWidget = {
        id: Date.now(),
        ...widgetData,
        position: { x: 0, y: 0, width: 6, height: 4 },
        created_at: new Date().toISOString()
      };
      setWidgets([...widgets, newWidget]);
      toast.success('Widget added successfully');
    } catch (error) {
      toast.error('Failed to add widget');
    }
  };

  const updateWidget = async (id: number, widgetData: any) => {
    try {
      setWidgets(widgets.map(w => w.id === id ? { ...w, ...widgetData } : w));
      toast.success('Widget updated successfully');
    } catch (error) {
      toast.error('Failed to update widget');
    }
  };

  const deleteWidget = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this widget?')) {
      try {
        setWidgets(widgets.filter(w => w.id !== id));
        toast.success('Widget deleted successfully');
      } catch (error) {
        toast.error('Failed to delete widget');
      }
    }
  };

  const WidgetForm = ({ widget, onClose }: { widget?: DashboardWidget; onClose: () => void }) => {
    const [formData, setFormData] = useState({
      name: widget?.name || '',
      type: widget?.type || 'chart',
      chart_type: widget?.chart_type || 'bar',
      data_source: widget?.data_source || 'sales',
      title: widget?.config?.title || '',
      filters: widget?.filters || {}
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const widgetData = {
        ...formData,
        config: { title: formData.title },
        filters: formData.filters
      };

      if (widget) {
        await updateWidget(widget.id, widgetData);
      } else {
        await addWidget(widgetData);
      }
      onClose();
    };

    return (
      <div className="modal-overlay">
        <div className="modal-content max-w-2xl">
          <div className="modal-header">
            <h2 className="text-xl font-semibold">
              {widget ? 'Edit Widget' : 'Add New Widget'}
            </h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body space-y-4">
              <div className="form-row">
                <div>
                  <label className="label">Widget Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input"
                    placeholder="Enter widget name"
                  />
                </div>
                <div>
                  <label className="label">Widget Type *</label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="input"
                  >
                    <option value="chart">Chart</option>
                    <option value="table">Table</option>
                    <option value="metric">Metric Card</option>
                    <option value="alert">Alert Widget</option>
                  </select>
                </div>
              </div>

              {formData.type === 'chart' && (
                <div>
                  <label className="label">Chart Type</label>
                  <select
                    value={formData.chart_type}
                    onChange={(e) => setFormData({ ...formData, chart_type: e.target.value as any })}
                    className="input"
                  >
                    <option value="bar">Bar Chart</option>
                    <option value="line">Line Chart</option>
                    <option value="pie">Pie Chart</option>
                    <option value="doughnut">Doughnut Chart</option>
                  </select>
                </div>
              )}

              <div className="form-row">
                <div>
                  <label className="label">Data Source *</label>
                  <select
                    required
                    value={formData.data_source}
                    onChange={(e) => setFormData({ ...formData, data_source: e.target.value })}
                    className="input"
                  >
                    <option value="sales">Sales Data</option>
                    <option value="inventory">Inventory Data</option>
                    <option value="customers">Customer Data</option>
                    <option value="production">Production Data</option>
                    <option value="finance">Finance Data</option>
                  </select>
                </div>
                <div>
                  <label className="label">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input"
                    placeholder="Widget title"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" onClick={onClose} className="btn btn-outline">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {widget ? 'Update' : 'Add'} Widget
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const DashboardForm = ({ onClose }: { onClose: () => void }) => {
    const [formData, setFormData] = useState({
      name: '',
      description: '',
      is_default: false
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      await saveDashboard(formData);
      onClose();
    };

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="text-xl font-semibold">Save Dashboard</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body space-y-4">
              <div>
                <label className="label">Dashboard Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  placeholder="Enter dashboard name"
                />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input"
                  rows={3}
                  placeholder="Describe this dashboard..."
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_default"
                  checked={formData.is_default}
                  onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="is_default" className="text-sm">Set as default dashboard</label>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" onClick={onClose} className="btn btn-outline">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Dashboard
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderWidget = (widget: DashboardWidget) => {
    const baseClasses = "card p-4 h-full";
    
    switch (widget.type) {
      case 'chart':
        return (
          <div className={baseClasses}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{widget.config?.title || widget.name}</h3>
              {editMode && (
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditingWidget(widget)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => deleteWidget(widget.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
            <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
              {widget.chart_type === 'bar' && <BarChart3 className="w-12 h-12 text-gray-400" />}
              {widget.chart_type === 'line' && <TrendingUp className="w-12 h-12 text-gray-400" />}
              {widget.chart_type === 'pie' && <PieChart className="w-12 h-12 text-gray-400" />}
              <div className="ml-3 text-gray-500">
                <div className="font-medium">{widget.chart_type?.toUpperCase()} Chart</div>
                <div className="text-sm">Data from {widget.data_source}</div>
              </div>
            </div>
          </div>
        );

      case 'table':
        return (
          <div className={baseClasses}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{widget.config?.title || widget.name}</h3>
              {editMode && (
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditingWidget(widget)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => deleteWidget(widget.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Value</th>
                    <th>Change</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Brahmi Hair Oil</td>
                    <td>₹25,000</td>
                    <td className="text-emerald-600">+12%</td>
                  </tr>
                  <tr>
                    <td>Triphala Churna</td>
                    <td>₹18,500</td>
                    <td className="text-emerald-600">+8%</td>
                  </tr>
                  <tr>
                    <td>Neem Face Cream</td>
                    <td>₹15,200</td>
                    <td className="text-red-600">-3%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'metric':
        return (
          <div className={baseClasses}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">{widget.config?.title || widget.name}</h3>
              {editMode && (
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditingWidget(widget)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => deleteWidget(widget.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
            <div className="text-3xl font-bold text-emerald-600 mb-1">₹2,45,670</div>
            <div className="text-sm text-gray-500">+15.3% from last month</div>
          </div>
        );

      case 'alert':
        return (
          <div className={baseClasses}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{widget.config?.title || widget.name}</h3>
              {editMode && (
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditingWidget(widget)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => deleteWidget(widget.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-sm font-medium text-red-800">8 Low Stock Items</div>
                <div className="text-xs text-red-600">Require immediate restocking</div>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="text-sm font-medium text-amber-800">3 Items Expiring Soon</div>
                <div className="text-xs text-amber-600">Within next 30 days</div>
              </div>
            </div>
          </div>
        );

      default:
        return <div className={baseClasses}>Unknown widget type</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Custom Dashboard</h1>
          <p className="text-gray-600">Create and manage your personalized dashboards</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={currentDashboard?.id || ''}
            onChange={(e) => {
              const dashboard = dashboards.find(d => d.id === Number(e.target.value));
              if (dashboard) {
                setCurrentDashboard(dashboard);
                setWidgets(dashboard.widgets);
              }
            }}
            className="input"
          >
            <option value="">Select Dashboard</option>
            {dashboards.map(dashboard => (
              <option key={dashboard.id} value={dashboard.id}>
                {dashboard.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => setEditMode(!editMode)}
            className={`btn ${editMode ? 'btn-warning' : 'btn-secondary'}`}
          >
            <Edit className="w-4 h-4 mr-2" />
            {editMode ? 'Exit Edit' : 'Edit Mode'}
          </button>
          <button
            onClick={() => setShowDashboardModal(true)}
            className="btn btn-primary"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Dashboard
          </button>
        </div>
      </div>

      {/* Dashboard Info */}
      {currentDashboard && (
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">{currentDashboard.name}</h2>
              <p className="text-sm text-gray-600">{currentDashboard.description}</p>
            </div>
            {editMode && (
              <button
                onClick={() => setShowWidgetModal(true)}
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Widget
              </button>
            )}
          </div>
        </div>
      )}

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {widgets.map((widget) => (
          <div key={widget.id} className="relative">
            {renderWidget(widget)}
          </div>
        ))}
        
        {widgets.length === 0 && (
          <div className="col-span-full">
            <div className="card p-12 text-center">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Widgets Added</h3>
              <p className="text-gray-600 mb-4">Start building your custom dashboard by adding widgets</p>
              <button
                onClick={() => setShowWidgetModal(true)}
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Widget
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Saved Dashboards */}
      <div className="card">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Saved Dashboards</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboards.map((dashboard) => (
              <div key={dashboard.id} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium">{dashboard.name}</h3>
                    <p className="text-sm text-gray-600">{dashboard.description}</p>
                  </div>
                  {dashboard.is_default && (
                    <span className="badge badge-primary text-xs">Default</span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-gray-500">
                    {dashboard.widgets.length} widgets
                  </span>
                  <button
                    onClick={() => {
                      setCurrentDashboard(dashboard);
                      setWidgets(dashboard.widgets);
                    }}
                    className="btn btn-outline btn-sm"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Load
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showWidgetModal && (
        <WidgetForm onClose={() => setShowWidgetModal(false)} />
      )}

      {editingWidget && (
        <WidgetForm
          widget={editingWidget}
          onClose={() => setEditingWidget(null)}
        />
      )}

      {showDashboardModal && (
        <DashboardForm onClose={() => setShowDashboardModal(false)} />
      )}
    </div>
  );
};

export default CustomDashboard;