import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Package,
  Users,
  AlertTriangle,
  DollarSign,
  ShoppingCart,
  Factory,
  Building2,
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import apiService from '../services/api';
import dayjs from 'dayjs';

const Dashboard: React.FC = () => {
  const { selectedOutlet } = useData();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, [selectedOutlet]);

  const load = async () => {
    setLoading(true);
    try {
      const summary = await apiService.getDashboardSummary();

      // directly use data as per your structure
      setDashboardData(summary);
    } catch (e) {
      console.error('Error loading dashboard:', e);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, color = 'emerald' }: any) => (
    <div className="stat-card">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold text-${color}-600 mt-1`}>
            {value ?? 0}
          </p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
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
          <p className={`text-sm text-${color}-600`}>
            {count} {description}
          </p>
        </div>
      </div>
    </div>
  );

  if (loading || !dashboardData) {
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

  const { sales, inventory, entities, recent_activities, generated_at } = dashboardData;

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Generated on {dayjs(generated_at).format('DD MMM YYYY, hh:mm A')}
          </p>
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
          value={`₹${(sales?.today?.total ?? 0).toLocaleString()}`}
          subtitle={`${sales?.today?.count ?? 0} orders`}
          icon={DollarSign}
          color="emerald"
        />
        <StatCard
          title="Monthly Sales"
          value={`₹${(sales?.this_month?.total ?? 0).toLocaleString()}`}
          subtitle={`${sales?.this_month?.count ?? 0} orders`}
          icon={ShoppingCart}
          color="blue"
        />
        <StatCard
          title="Active Customers"
          value={entities?.customers ?? 0}
          subtitle="Total registered"
          icon={Users}
          color="purple"
        />
        <StatCard
          title="Employees"
          value={entities?.employees ?? 0}
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
            count={inventory?.low_stock_alerts ?? 0}
            description="products need restocking"
            color="red"
          />
          <AlertCard
            title="Expiring Soon"
            count={inventory?.expiring_soon ?? 0}
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
                  <p className="text-sm text-gray-600">Vendors</p>
                  <p className="text-xl font-bold text-gray-900">
                    {entities?.vendors ?? 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="stat-card">
              <div className="flex items-center">
                <Factory className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Products in Production</p>
                  <p className="text-xl font-bold text-gray-900">12</p>
                  <p className="text-xs text-gray-500">Active batches</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Sales</h2>
        {recent_activities?.sales?.length > 0 ? (
          <div className="space-y-3">
            {recent_activities.sales.map((sale: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{sale.invoice_number}</p>
                  <p className="text-sm text-gray-600">{sale.customer__name}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-emerald-600">
                    ₹{(sale.total_amount || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {dayjs(sale.created_at).format('DD MMM YYYY, hh:mm A')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No recent sales found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
