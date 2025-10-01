import React, { useState, useEffect } from 'react';
import { Search, Plus, Minus, ShoppingCart, User, Phone, CreditCard, Banknote, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  barcode?: string;
}

interface CartItem extends Product {
  quantity: number;
  total: number;
}

interface Customer {
  id: number;
  name: string;
  phone: string;
  loyalty_points: number;
}

const POSSystem: React.FC = () => {
  const [products] = useState<Product[]>([
    { id: 1, name: 'Brahmi Hair Oil', price: 120, stock: 50, barcode: '8901234567890' },
    { id: 2, name: 'Triphala Churna', price: 200, stock: 30, barcode: '8901234567891' },
    { id: 3, name: 'Neem Face Cream', price: 250, stock: 25, barcode: '8901234567892' },
    { id: 4, name: 'Ashwagandha Capsules', price: 350, stock: 40, barcode: '8901234567893' },
  ]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'upi' | 'card' | 'split'>('cash');
  const [cashAmount, setCashAmount] = useState(0);
  const [upiAmount, setUpiAmount] = useState(0);
  const [cardAmount, setCardAmount] = useState(0);
  const [discount, setDiscount] = useState(0);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode?.includes(searchTerm)
  );

  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
            : item
        ));
      } else {
        toast.error('Not enough stock available');
      }
    } else {
      setCart([...cart, { ...product, quantity: 1, total: product.price }]);
    }
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter(item => item.id !== id));
    } else {
      const product = products.find(p => p.id === id);
      if (product && quantity <= product.stock) {
        setCart(cart.map(item =>
          item.id === id
            ? { ...item, quantity, total: quantity * item.price }
            : item
        ));
      } else {
        toast.error('Not enough stock available');
      }
    }
  };

  const searchCustomer = async () => {
    if (customerPhone.length >= 10) {
      // Mock customer search
      const mockCustomer = {
        id: 1,
        name: 'Rajesh Kumar',
        phone: customerPhone,
        loyalty_points: 150
      };
      setCustomer(mockCustomer);
      setCustomerName(mockCustomer.name);
      toast.success('Customer found!');
    } else {
      setShowCustomerForm(true);
    }
  };

  const saveCustomer = () => {
    if (customerName && customerPhone) {
      const newCustomer = {
        id: Date.now(),
        name: customerName,
        phone: customerPhone,
        loyalty_points: 0
      };
      setCustomer(newCustomer);
      setShowCustomerForm(false);
      toast.success('Customer saved!');
    }
  };

  const processPayment = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    let totalPaid = 0;
    if (paymentMethod === 'split') {
      totalPaid = cashAmount + upiAmount + cardAmount;
    } else {
      totalPaid = total;
    }

    if (totalPaid < total) {
      toast.error('Insufficient payment amount');
      return;
    }

    // Process payment
    toast.success('Payment successful!');
    
    // Clear cart and reset
    setCart([]);
    setCustomer(null);
    setCustomerPhone('');
    setCustomerName('');
    setDiscount(0);
    setCashAmount(0);
    setUpiAmount(0);
    setCardAmount(0);
    setPaymentMethod('cash');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Product Selection */}
          <div className="lg:col-span-2 space-y-4">
            <div className="card p-4">
              <h2 className="text-lg font-semibold mb-4">Products</h2>
              
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products or scan barcode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10 text-lg"
                  autoFocus
                />
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className="p-4 border rounded-lg cursor-pointer hover:bg-emerald-50 hover:border-emerald-300 transition-colors"
                  >
                    <h3 className="font-medium text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-lg font-bold text-emerald-600">₹{product.price}</p>
                    <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cart & Checkout */}
          <div className="space-y-4">
            
            {/* Customer Section */}
            <div className="card p-4">
              <h3 className="font-semibold mb-3">Customer</h3>
              
              {!customer ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      placeholder="Phone number"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="input flex-1"
                    />
                    <button
                      onClick={searchCustomer}
                      className="btn btn-primary"
                    >
                      <User className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {showCustomerForm && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Customer name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="input"
                      />
                      <button
                        onClick={saveCustomer}
                        className="btn btn-secondary w-full"
                      >
                        Save Customer
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-emerald-50 p-3 rounded-lg">
                  <p className="font-medium">{customer.name}</p>
                  <p className="text-sm text-gray-600">{customer.phone}</p>
                  <p className="text-sm text-emerald-600">Points: {customer.loyalty_points}</p>
                </div>
              )}
            </div>

            {/* Cart */}
            <div className="card p-4">
              <h3 className="font-semibold mb-3">Cart ({cart.length} items)</h3>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-emerald-600">₹{item.price} each</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="w-16 text-right font-medium">
                      ₹{item.total}
                    </div>
                  </div>
                ))}
              </div>

              {cart.length === 0 && (
                <p className="text-gray-500 text-center py-8">Cart is empty</p>
              )}
            </div>

            {/* Discount */}
            <div className="card p-4">
              <label className="label">Discount (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="input"
              />
            </div>

            {/* Payment Method */}
            <div className="card p-4">
              <h3 className="font-semibold mb-3">Payment Method</h3>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`btn ${paymentMethod === 'cash' ? 'btn-primary' : 'btn-outline'}`}
                >
                  <Banknote className="w-4 h-4 mr-1" />
                  Cash
                </button>
                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`btn ${paymentMethod === 'upi' ? 'btn-primary' : 'btn-outline'}`}
                >
                  <Smartphone className="w-4 h-4 mr-1" />
                  UPI
                </button>
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`btn ${paymentMethod === 'card' ? 'btn-primary' : 'btn-outline'}`}
                >
                  <CreditCard className="w-4 h-4 mr-1" />
                  Card
                </button>
                <button
                  onClick={() => setPaymentMethod('split')}
                  className={`btn ${paymentMethod === 'split' ? 'btn-primary' : 'btn-outline'}`}
                >
                  Split
                </button>
              </div>

              {paymentMethod === 'split' && (
                <div className="space-y-2">
                  <div>
                    <label className="label">Cash Amount</label>
                    <input
                      type="number"
                      value={cashAmount}
                      onChange={(e) => setCashAmount(Number(e.target.value))}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">UPI Amount</label>
                    <input
                      type="number"
                      value={upiAmount}
                      onChange={(e) => setUpiAmount(Number(e.target.value))}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Card Amount</label>
                    <input
                      type="number"
                      value={cardAmount}
                      onChange={(e) => setCardAmount(Number(e.target.value))}
                      className="input"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Total & Checkout */}
            <div className="card p-4">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Discount ({discount}%):</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={processPayment}
                disabled={cart.length === 0}
                className="btn btn-primary w-full text-lg py-3 disabled:opacity-50"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Process Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSSystem;