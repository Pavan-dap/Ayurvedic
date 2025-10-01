import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { 
  Home,
  Users,
  Truck,
  Package,
  ShoppingCart,
  Factory,
  UserCheck,
  Building2,
  DollarSign,
  FileText,
  Menu,
  X,
  LogOut,
  Bell,
  Settings
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { selectedOutlet, setSelectedOutlet } = useData();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Customers', href: '/customers', icon: Users },
    { name: 'Vendors', href: '/vendors', icon: Truck },
    { 
      name: 'Inventory', 
      icon: Package,
      children: [
        { name: 'Products', href: '/inventory/products' },
        { name: 'Stock', href: '/inventory/stock' },
        { name: 'Purchase Orders', href: '/inventory/purchase-orders' },
        { name: 'Stock Transfers', href: '/inventory/stock-transfers' },
      ]
    },
    { name: 'Sales', href: '/sales', icon: ShoppingCart },
    { name: 'POS System', href: '/sales/pos', icon: ShoppingCart },
    
    { 
      name: 'Production', 
      icon: Factory,
      children: [
        { name: 'Batches', href: '/production/batches' },
      ]
    },
    { 
      name: 'HR', 
      icon: UserCheck,
      children: [
        { name: 'Employees', href: '/hr/employees' },
        { name: 'Attendance', href: '/hr/attendance' },
      ]
    },
    { name: 'Outlets', href: '/outlets', icon: Building2 },
    { 
      name: 'Finance', 
      icon: DollarSign,
      children: [
        { name: 'Expenses', href: '/finance/expenses' },
        { name: 'GST Reports', href: '/finance/gst-reports' },
      ]
    },
    { name: 'Custom Dashboard', href: '/dashboard/custom', icon: FileText },
    { name: 'Reports', href: '/reports', icon: FileText },
  ];

  const isActivePath = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const hasActiveChild = (children: any[]) => {
    return children?.some(child => isActivePath(child.href));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-emerald-600" />
            <span className="ml-2 text-lg font-semibold text-gray-900">AyurERP</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 custom-scrollbar overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = item.href ? isActivePath(item.href) : hasActiveChild(item.children || []);
            
            if (item.children) {
              return (
                <div key={item.name} className="space-y-1">
                  <div className={`sidebar-item ${isActive ? 'active' : ''}`}>
                    <Icon className="w-5 h-5 mr-3" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="ml-8 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        to={child.href}
                        className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                          isActivePath(child.href)
                            ? 'bg-emerald-50 text-emerald-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                to={item.href!}
                className={`sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-emerald-700">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </span>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="ml-4 lg:ml-0 text-2xl font-semibold text-gray-900 capitalize">
                {location.pathname.split('/')[1] || 'Dashboard'}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Outlet selector */}
              <select
                value={selectedOutlet || ''}
                onChange={(e) => setSelectedOutlet(Number(e.target.value))}
                className="input max-w-xs"
              >
                <option value="1">Main Unit</option>
                <option value="2">Sector 17 Store</option>
                <option value="3">Panchkula Outlet</option>
                <option value="4">Mohali Store</option>
              </select>

              <button className="p-2 rounded-md hover:bg-gray-100 relative">
                <Bell className="w-5 h-5 text-gray-500" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <button className="p-2 rounded-md hover:bg-gray-100">
                <Settings className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;