const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiService {
  private baseURL: string;
  private authToken: string | null = null;
  private isRefreshing = false;
  private refreshPromise: Promise<string | null> | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  setAuthToken(token: string | null) {
    this.authToken = token;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  async request(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: this.getHeaders(),
      ...options,
    };

    let response = await fetch(url, config);

    if (response.status === 401) {
      // Try refresh once
      const newToken = await this.tryRefreshToken();
      if (newToken) {
        // Retry with new token
        const retryConfig: RequestInit = {
          ...config,
          headers: {
            ...(config.headers as any),
            Authorization: `Bearer ${newToken}`,
          },
        };
        response = await fetch(url, retryConfig);
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Request failed' }));
      throw new Error(errorData.detail || errorData.message || 'Request failed');
    }

    return response;
  }

  private async tryRefreshToken(): Promise<string | null> {
    const refresh = localStorage.getItem('refreshToken');
    if (!refresh) return null;
    if (this.isRefreshing && this.refreshPromise) return this.refreshPromise;

    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        const resp = await fetch(`${this.baseURL}/auth/refresh/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh }),
        });
        if (!resp.ok) throw new Error('Refresh failed');
        const data = await resp.json();
        const access = data.access;
        if (!access) throw new Error('No access token');
        localStorage.setItem('accessToken', access);
        this.setAuthToken(access);
        return access;
      } catch (e) {
        // Full logout
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        this.setAuthToken(null);
        return null;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  async get(endpoint: string): Promise<any> {
    const response = await this.request(endpoint);
    return response.json();
  }

  async post(endpoint: string, data: any): Promise<any> {
    const response = await this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async put(endpoint: string, data: any): Promise<any> {
    const response = await this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async patch(endpoint: string, data: any): Promise<any> {
    const response = await this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async delete(endpoint: string): Promise<any> {
    const response = await this.request(endpoint, {
      method: 'DELETE',
    });
    
    // DELETE responses might be empty
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  }

  // Specific API methods
  async getCustomers() {
    return this.get('/customers/customers/');
  }

  async createCustomer(data: any) {
    return this.post('/customers/customers/', data);
  }

  async updateCustomer(id: number, data: any) {
    return this.put(`/customers/customers/${id}/`, data);
  }

  async deleteCustomer(id: number) {
    return this.delete(`/customers/customers/${id}/`);
  }

  async getVendors() {
    return this.get('/vendors/vendors/');
  }

  async createVendor(data: any) {
    return this.post('/vendors/vendors/', data);
  }

  async updateVendor(id: number, data: any) {
    return this.put(`/vendors/vendors/${id}/`, data);
  }

  async deleteVendor(id: number) {
    return this.delete(`/vendors/vendors/${id}/`);
  }

  async getProducts() {
    return this.get('/inventory/products/');
  }

  async createProduct(data: any) {
    return this.post('/inventory/products/', data);
  }

  async updateProduct(id: number, data: any) {
    return this.put(`/inventory/products/${id}/`, data);
  }

  async deleteProduct(id: number) {
    return this.delete(`/inventory/products/${id}/`);
  }

  async getStock() {
    return this.get('/inventory/stock/');
  }

  async getStockTransfer() {
    return this.get('/inventory/movements/');
  }

  async getStockAlerts() {
    return this.get('/inventory/stock/low_stock_alerts/');
  }

  async getExpiryAlerts() {
    return this.get('/inventory/stock/expiry_alerts/');
  }

  async getPurchaseOrders() {
    return this.get('/inventory/purchase-orders/');
  }

  async createPurchaseOrder(data: any) {
    return this.post('/inventory/purchase-orders/', data);
  }

  async updatePurchaseOrder(id: number, data: any) {
    return this.put(`/inventory/purchase-orders/${id}/`, data);
  }

  async confirmPurchaseOrder(id: number) {
    return this.post(`/inventory/purchase-orders/${id}/confirm_order/`, {});
  }

  async getSales() {
    return this.get('/sales/sales/');
  }

  async createSale(data: any) {
    return this.post('/sales/sales/', data);
  }

  async getSalesSummary() {
    return this.get('/sales/sales/sales_summary/');
  }

  // Sales actions
  async addSalePayment(saleId: number, data: any) {
    return this.post(`/sales/sales/${saleId}/add_payment/`, data);
  }

  async createPaymentOrder(saleId: number, data: { amount?: number; gateway?: string }) {
    return this.post(`/sales/sales/${saleId}/create_payment_order/`, data);
  }

  async generateInvoicePdf(saleId: number) {
    return this.post(`/sales/sales/${saleId}/generate_invoice_pdf/`, {});
  }

  async sendInvoiceWhatsApp(saleId: number, data: { phone?: string; message?: string }) {
    return this.post(`/sales/sales/${saleId}/send_whatsapp/`, data);
  }

  async getProductionBatches() {
    return this.get('/production/batches/');
  }

  async createProductionBatch(data: any) {
    return this.post('/production/batches/', data);
  }

  async startProduction(id: number) {
    return this.post(`/production/batches/${id}/start_production/`, {});
  }

  async completeProduction(id: number, data: any) {
    return this.post(`/production/batches/${id}/complete_production/`, data);
  }

  async getEmployees() {
    return this.get('/hr/employees/');
  }

  async createEmployee(data: any) {
    return this.post('/hr/employees/', data);
  }

  async updateEmployee(id: number, data: any) {
    return this.put(`/hr/employees/${id}/`, data);
  }

  async getAttendance() {
    return this.get('/hr/attendance/');
  }

  async createAttendance(data: any) {
    return this.post('/hr/attendance/', data);
  }

  async getOutlets() {
    return this.get('/outlets/outlets/');
  }

  async createOutlet(data: any) {
    return this.post('/outlets/outlets/', data);
  }

  async getExpenses() {
    return this.get('/finance/expenses/');
  }

  async createExpense(data: any) {
    return this.post('/finance/expenses/', data);
  }

  async approveExpense(id: number) {
    return this.post(`/finance/expenses/${id}/approve_expense/`, {});
  }

  async getDashboardSummary() {
    return this.get('/reports/generated/dashboard_summary/');
  }

  async generateSalesReport(data: any) {
    return this.post('/reports/generated/generate_sales_report/', data);
  }

  async generateInventoryReport(data: any) {
    return this.post('/reports/generated/generate_inventory_report/', data);
  }

  async generateProductionReport(data: any) {
    return this.post('/reports/generated/generate_production_report/', data);
  }

  async generateFinancialReport(data: any) {
    return this.post('/reports/generated/generate_financial_report/', data);
  }

  // Dashboards & Widgets
  async getDashboards() {
    return this.get('/dashboard/dashboards/');
  }

  async getDashboard(id: number) {
    return this.get(`/dashboard/dashboards/${id}/`);
  }

  async createDashboard(data: any) {
    return this.post('/dashboard/dashboards/', data);
  }

  async setDefaultDashboard(id: number) {
    return this.post(`/dashboard/dashboards/${id}/set_default/`, {});
  }

  async cloneDashboard(id: number) {
    return this.post(`/dashboard/dashboards/${id}/clone_dashboard/`, {});
  }

  async getWidgets(params?: Record<string, any>) {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return this.get(`/dashboard/widgets/${query}`);
  }

  async createWidget(data: any) {
    return this.post('/dashboard/widgets/', data);
  }

  async updateWidget(id: number, data: any) {
    return this.put(`/dashboard/widgets/${id}/`, data);
  }

  async deleteWidget(id: number) {
    return this.delete(`/dashboard/widgets/${id}/`);
  }

  async getWidgetData(widgetId: number) {
    return this.get(`/dashboard/widgets/widget_data/?widget_id=${widgetId}`);
  }
}

export const apiService = new ApiService(API_BASE_URL);
export default apiService;
