import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Layout from './components/Layout';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard';
import CustomerList from './components/Customers/CustomerList';
import VendorList from './components/Vendors/VendorList';
import ProductList from './components/Inventory/ProductList';
import StockList from './components/Inventory/StockList';
import PurchaseOrderList from './components/Inventory/PurchaseOrderList';
import SalesList from './components/Sales/SalesList';
import ProductionBatchList from './components/Production/ProductionBatchList';
import EmployeeList from './components/HR/EmployeeList';
import AttendanceList from './components/HR/AttendanceList';
import OutletList from './components/Outlets/OutletList';
import ReportsDashboard from './components/Reports/ReportsDashboard';
import ExpenseList from './components/Finance/ExpenseList';
import POSSystem from './components/Sales/POSSystem';
import StockTransferList from './components/Inventory/StockTransferList';
import CustomDashboard from './components/Dashboard/CustomDashboard';
import GSTReports from './components/Finance/GSTReports';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';




// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});


function AppRoutes() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/customers" element={<CustomerList />} />
        <Route path="/vendors" element={<VendorList />} />
        <Route path="/inventory/products" element={<ProductList />} />
        <Route path="/inventory/stock" element={<StockList />} />
        <Route path="/inventory/purchase-orders" element={<PurchaseOrderList />} />
        <Route path="/inventory/stock-transfers" element={<StockTransferList />} />
        <Route path="/sales" element={<SalesList />} />
        <Route path="/sales/pos" element={<POSSystem />} />
        <Route path="/production/batches" element={<ProductionBatchList />} />
        <Route path="/hr/employees" element={<EmployeeList />} />
        <Route path="/hr/attendance" element={<AttendanceList />} />
        <Route path="/outlets" element={<OutletList />} />
        <Route path="/finance/expenses" element={<ExpenseList />} />
        <Route path="/finance/gst-reports" element={<GSTReports />} />
        <Route path="/dashboard/custom" element={<CustomDashboard />} />
        <Route path="/reports" element={<ReportsDashboard />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
}


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <div className="App">
              <AppRoutes />
              <Toaster position="top-right" />
            </div>
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
