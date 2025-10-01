# Ayurvedic & Herbal ERP System

A comprehensive Enterprise Resource Planning (ERP) system designed specifically for Ayurvedic and Herbal businesses, built with Django REST Framework backend and React.js frontend.

## 🌿 Features

### Core Modules
- **Customer Management** - Track customers, loyalty points, purchase history
- **Vendor Management** - Manage suppliers with performance tracking
- **Multi-Outlet Inventory** - 1 main unit + 4 retail outlets with batch tracking
- **Production Management** - Raw materials → Semi-finished → Finished goods
- **Sales & Billing** - POS system with barcode scanning and split payments
- **Finance Management** - GST compliance, cash flow, expense tracking
- **HR & Payroll** - Attendance, payroll, role-based access
- **Stock Transfer** - Inter-outlet stock movement tracking
- **Custom Dashboards** - Build personalized dashboards with charts and tables
- **GST Reports** - GSTR-1, GSTR-3B, GSTR-9, HSN reports as per Indian norms

### Key Highlights
- **User-friendly for less educated staff** - Simple, visual interface
- **Barcode/QR scanning** for quick product selection
- **Partial payment support** - Cash/UPI/Card combinations
- **Real-time stock alerts** - Low stock and expiry notifications
- **Batch tracking** - Complete traceability from raw materials to sales
- **GST compliance** - All Indian GST filing requirements covered
- **Multi-device support** - Works on desktop, tablet, and mobile

## 🚀 Quick Start

### Backend Setup (Django)
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Configure your MySQL database in .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend Setup (React)
```bash
npm install
npm run dev
```

### Database Setup
```bash
# Import the complete schema
mysql -u root -p < database/ayurvedic_erp_complete_schema.sql
```

## 📊 Database Schema

The system includes comprehensive tables for:
- Customer and vendor management
- Multi-outlet inventory with batch tracking
- Production formulas and ingredient management
- Sales and payment tracking
- GST and HSN reporting
- Stock transfer management
- Custom dashboard configuration
- HR and payroll management

## 🎯 User Roles & Access

- **Admin** - Full system access
- **Store Manager** - Outlet-specific operations
- **Sales Staff** - POS and customer management
- **Production Manager** - Manufacturing and quality control
- **Accountant** - Finance and GST reporting
- **HR Manager** - Employee and payroll management

## 📱 Store-Friendly Features

### Simple POS System
- Large product buttons with images
- Quick customer lookup by phone
- Visual payment method selection
- One-click checkout process
- Automatic calculations

### Customer Management
- Phone number search → auto-fill details
- Quick add new customers
- Loyalty points tracking
- Purchase history

### Inventory Alerts
- Low stock notifications
- Expiry date warnings (3 months advance)
- Negative stock prevention
- Batch tracking

## 🏭 Production Management

Based on traditional Ayurvedic formulations:
- **Premium Coconut Oil** - 15 ingredient formula
- **Herbal Hair Oil** - Traditional recipe
- Cost calculation including materials, labor, utilities
- Quality control workflow
- Batch-wise production tracking

## 📈 GST Compliance (India)

Complete GST reporting as per Indian government norms:
- **GSTR-1** - Outward supplies (monthly)
- **GSTR-3B** - Monthly return with tax liability
- **GSTR-9** - Annual return
- **HSN Summary** - HSN code-wise reporting
- **Filing calendar** - Due date reminders
- **B2B/B2C segregation** - Automatic classification

## 🔧 Technical Stack

### Backend
- Django 4.2.7
- Django REST Framework
- MySQL Database
- JWT Authentication
- Django CORS Headers
- Django Filters

### Frontend
- React 18.3.1
- TypeScript
- Tailwind CSS
- React Router
- React Query
- Lucide React Icons

## 📋 API Endpoints

### Authentication
- `POST /api/auth/login/` - User login
- `POST /api/auth/refresh/` - Token refresh

### Core Modules
- `/api/customers/` - Customer management
- `/api/vendors/` - Vendor management
- `/api/inventory/` - Products, stock, purchase orders
- `/api/production/` - Batches, formulas, orders
- `/api/sales/` - Sales, payments, POS
- `/api/finance/` - Expenses, GST reports
- `/api/hr/` - Employees, attendance, payroll
- `/api/outlets/` - Outlet and stock transfer management
- `/api/dashboard/` - Custom dashboard management
- `/api/reports/` - Report generation

## 🎨 UI/UX Design

- **Apple-level aesthetics** - Clean, professional design
- **Consistent color system** - Emerald primary, blue secondary
- **Responsive layout** - Works on all screen sizes
- **Accessibility** - Proper contrast ratios and focus states
- **Micro-interactions** - Smooth transitions and hover effects
- **Visual hierarchy** - Clear typography and spacing

## 🔐 Security Features

- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS configuration

## 📊 Reporting & Analytics

- **Real-time dashboards** - Live data updates
- **Custom report builder** - Create personalized reports
- **Export options** - PDF, Excel, CSV formats
- **Scheduled reports** - Automated report generation
- **Visual analytics** - Charts and graphs
- **Drill-down capabilities** - Detailed data exploration

## 🛠️ Customization

The system is highly customizable:
- **Custom dashboard builder** - Drag-and-drop widgets
- **Configurable workflows** - Adapt to business processes
- **Custom fields** - Add business-specific data
- **Report templates** - Create custom report formats
- **Role permissions** - Fine-grained access control

## 📞 Support & Documentation

For technical support or customization requests, please refer to the documentation or contact the development team.

## 📄 License

This ERP system is proprietary software designed for Ayurvedic and Herbal businesses.