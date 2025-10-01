import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Package, 
  Users, 
  AlertTriangle,
  DollarSign,
  ShoppingCart,
  Clock,
  Factory,
  Building2
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import apiService from '../services/api';

const Dashboard: React.FC = () => {
  const { selectedOutlet } = useData();
  const [dashboardData, setDashboardData] = useState({
    sales: {
      today: { total: 0, count: 0 },
      this_month: { total: 0, count: 0 }
    },
    inventory: {
      low_stock_alerts: 0,
      expiring_soon: 0
    },
    entities: {
      customers: 0,
      vendors: 0,
      employees: 0
    },
    recent_activities: {
      sales: [] as any[]
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, [selectedOutlet]);

  const load = async () => {
    setLoading(true);
    try {
      const summary = await apiService.getDashboardSummary();
      setDashboardData({
        sales: {
          today: { total: summary?.today?.total_amount || 0, count: summary?.today?.count || 0 },
          this_month: { total: summary?.this_month?.total_amount || 0, count: summary?.this_month?.count || 0 }
        },
        inventory: {
          low_stock_alerts: summary?.inventory?.low_stock || 0,
          expiring_soon: summary?.inventory?.expiring_soon || 0
        },
        entities: {
          customers: summary?.entities?.customers || 0,
          vendors: summary?.entities?.vendors || 0,
          employees: summary?.entities?.employees || 0
        },
        recent_activities: {
          sales: summary?.recent_sales || []
        }
      });
    } catch (e) {
      // Keep zeros
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, trend, color = 'emerald' }: any) => (
    <div className="stat-card">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold text-${color}-600 mt-1`}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <TrendingUp className={`w-4 h-4 text-${trend > 0 ? 'green' : 'red'}-500 mr-1`} />
              <span className={`text-sm text-${trend > 0 ? 'green' : 'red'}-600`}>
                {trend > 0 ? '+' : ''}{trend}%
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 bg-${color}-100 rounded-lg`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const AlertCard = ({ title, count, description, color = 'amber' }: any) => (
    <div className={`p-4 bg-${color}-50 border border-${color}-200 rounded-lg`}>
      <div className="flex items-center">
        <AlertTriangle className={`w-5 h-5 text-${color}-600 mr-2`} />
        <div>
          <h3 className={`font-medium text-${color}-800`}>{title}</h3>
          <p className={`text-sm text-${color}-600`}>{count} {description}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="stat-card animate-pulse">
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Current Outlet</p>
          <p className="font-semibold text-gray-900">
            {selectedOutlet === 1 ? 'Main Manufacturing Unit' : `Outlet ${selectedOutlet}`}
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Sales"
          value={`₹${dashboardData.sales.today.total.toLocaleString()}`}
          subtitle={`${dashboardData.sales.today.count} orders`}
          icon={DollarSign}
          trend={12.5}
          color="emerald"
        />
        <StatCard
          title="Monthly Sales"
          value={`₹${dashboardData.sales.this_month.total.toLocaleString()}`}
          subtitle={`${dashboardData.sales.this_month.count} orders`}
          icon={ShoppingCart}
          trend={8.2}
          color="blue"
        />
        <StatCard
          title="Active Customers"
          value={dashboardData.entities.customers}
          subtitle="Total registered"
          icon={Users}
          color="purple"
        />
        <StatCard
          title="Employees"
          value={dashboardData.entities.employees}
          subtitle="Active staff"
          icon={Building2}
          color="indigo"
        />
      </div>

      {/* Alerts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Inventory Alerts</h2>
          <AlertCard
            title="Low Stock Items"
            count={dashboardData.inventory.low_stock_alerts}
            description="products need restocking"
            color="red"
          />
          <AlertCard
            title="Expiring Soon"
            count={dashboardData.inventory.expiring_soon}
            description="items expire within 30 days"
            color="amber"
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Quick Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="stat-card">
              <div className="flex items-center">
                <Package className="w-8 h-8 text-emerald-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Products</p>
                  <p className="text-xl font-bold text-gray-900">156</p>
                </div>
              </div>
            </div>
            <div className="stat-card">
              <div className="flex items-center">
                <Factory className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Production</p>
                  <p className="text-xl font-bold text-gray-900">12</p>
                  <p className="text-xs text-gray-500">Active batches</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Sales</h2>
          <div className="space-y-3">
            {dashboardData.recent_activities.sales.map((sale, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{sale.invoice_number}</p>
                  <p className="text-sm text-gray-600">{sale.customer__name}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-emerald-600">₹{(sale.total_amount || 0).toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Just now</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Production Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Brahmi Hair Oil</p>
                <p className="text-sm text-gray-600">Batch: BHO202401001</p>
              </div>
              <div className="text-right">
                <span className="badge badge-success">Completed</span>
                <p className="text-xs text-gray-500 mt-1">500 units</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Triphala Churna</p>
                <p className="text-sm text-gray-600">Batch: TC202401002</p>
              </div>
              <div className="text-right">
                <span className="badge badge-warning">In Progress</span>
                <p className="text-xs text-gray-500 mt-1">200 units</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="btn btn-outline flex flex-col items-center p-4 h-auto">
            <ShoppingCart className="w-6 h-6 mb-2" />
            <span>New Sale</span>
          </button>
          <button className="btn btn-outline flex flex-col items-center p-4 h-auto">
            <Package className="w-6 h-6 mb-2" />
            <span>Add Stock</span>
          </button>
          <button className="btn btn-outline flex flex-col items-center p-4 h-auto">
            <Users className="w-6 h-6 mb-2" />
            <span>New Customer</span>
          </button>
          <button className="btn btn-outline flex flex-col items-center p-4 h-auto">
            <Factory className="w-6 h-6 mb-2" />
            <span>Start Production</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;