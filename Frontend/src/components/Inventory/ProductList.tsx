import React, { useState, useEffect } from 'react';
import { Plus, Search, CreditCard as Edit, Trash2, Package, Barcode } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import apiService from '../../services/api';

interface Product {
  id: number;
  product_code: string;
  name: string;
  category: string;
  product_type: string;
  unit_price: number;
  selling_price: number;
  unit_of_measure: string;
  barcode?: string;
  is_active: boolean;
  stock_quantity?: number;
}

const ProductList: React.FC = () => {
  const { refreshTrigger } = useData();
  const { isDemo } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadProducts();
  }, [refreshTrigger]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      if (isDemo) {
        const mock: Product[] = [
          { id: 1, product_code: 'PROD-0001', name: 'Brahmi Hair Oil', category: 'Herbal Oils', product_type: 'FINISHED', unit_price: 120, selling_price: 199, unit_of_measure: 'ml', barcode: '890123456001', is_active: true, stock_quantity: 150 },
          { id: 2, product_code: 'PROD-0002', name: 'Triphala Churna', category: 'Herbal Powders', product_type: 'FINISHED', unit_price: 80, selling_price: 149, unit_of_measure: 'gm', barcode: '890123456002', is_active: true, stock_quantity: 85 },
          { id: 3, product_code: 'RM-NEEM', name: 'Neem Leaves', category: 'Raw Materials', product_type: 'RAW_MATERIAL', unit_price: 45, selling_price: 0, unit_of_measure: 'kg', is_active: true, stock_quantity: 320 },
        ];
        setProducts(mock);
        return;
      }
      const data = await apiService.getProducts();
      const normalized = (data?.results || data || []).map((p: any) => ({
        id: p.id,
        product_code: p.product_code,
        name: p.name,
        category: p.category_name || p.category || '',
        product_type: p.product_type,
        unit_price: Number(p.unit_price || 0),
        selling_price: Number(p.selling_price || 0),
        unit_of_measure: p.unit_of_measure,
        barcode: p.barcode,
        is_active: Boolean(p.is_active),
        stock_quantity: Number(p.stock_quantity || 0),
      })) as Product[];
      setProducts(normalized);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.product_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterType || product.product_type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        if (isDemo) {
          setProducts(prev => prev.filter(p => p.id !== id));
          toast.success('Product deleted successfully');
          return;
        }
        await apiService.deleteProduct(id);
        await loadProducts();
        toast.success('Product deleted successfully');
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const ProductForm = ({ product, onClose }: { product?: Product; onClose: () => void }) => {
    const [formData, setFormData] = useState({
      name: product?.name || '',
      category: product?.category || 'Herbal Oils',
      product_type: product?.product_type || 'FINISHED',
      unit_price: product?.unit_price || 0,
      selling_price: product?.selling_price || 0,
      unit_of_measure: product?.unit_of_measure || 'ml',
      barcode: product?.barcode || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (isDemo) {
          if (product) {
            const updated: Product = { ...product, ...formData } as Product;
            setProducts(prev => prev.map(p => (p.id === product.id ? updated : p)));
            toast.success('Product updated successfully');
          } else {
            const newProduct: Product = {
              id: Date.now(),
              product_code: `PROD-${String(Date.now()).slice(-4)}`,
              is_active: true,
              stock_quantity: 0,
              ...formData,
            } as Product;
            setProducts(prev => [newProduct, ...prev]);
            toast.success('Product added successfully');
          }
          onClose();
          return;
        }
        if (product) {
          await apiService.updateProduct(product.id, formData);
          toast.success('Product updated successfully');
        } else {
          await apiService.createProduct({ ...formData, is_active: true });
          toast.success('Product added successfully');
        }
        await loadProducts();
        onClose();
      } catch (error) {
        toast.error('Failed to save product');
      }
    };

    return (
      <div className="modal-overlay">
        <div className="modal-content max-w-2xl">
          <div className="modal-header">
            <h2 className="text-xl font-semibold">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body space-y-4">
              <div className="form-row">
                <div>
                  <label className="label">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input"
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <label className="label">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input"
                  >
                    <option value="Herbal Oils">Herbal Oils</option>
                    <option value="Herbal Powders">Herbal Powders</option>
                    <option value="Herbal Creams">Herbal Creams</option>
                    <option value="Raw Materials">Raw Materials</option>
                    <option value="Packaging Materials">Packaging Materials</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div>
                  <label className="label">Product Type</label>
                  <select
                    value={formData.product_type}
                    onChange={(e) => setFormData({ ...formData, product_type: e.target.value })}
                    className="input"
                  >
                    <option value="FINISHED">Finished Goods</option>
                    <option value="RAW_MATERIAL">Raw Material</option>
                    <option value="SEMI_FINISHED">Semi-Finished</option>
                    <option value="PACKAGING">Packaging</option>
                  </select>
                </div>
                <div>
                  <label className="label">Unit of Measure</label>
                  <select
                    value={formData.unit_of_measure}
                    onChange={(e) => setFormData({ ...formData, unit_of_measure: e.target.value })}
                    className="input"
                  >
                    <option value="ml">ml</option>
                    <option value="gm">gm</option>
                    <option value="kg">kg</option>
                    <option value="liter">liter</option>
                    <option value="pieces">pieces</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div>
                  <label className="label">Unit Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.unit_price}
                    onChange={(e) => setFormData({ ...formData, unit_price: parseFloat(e.target.value) })}
                    className="input"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="label">Selling Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.selling_price}
                    onChange={(e) => setFormData({ ...formData, selling_price: parseFloat(e.target.value) })}
                    className="input"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className="label">Barcode</label>
                <input
                  type="text"
                  value={formData.barcode}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                  className="input"
                  placeholder="Enter barcode"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" onClick={onClose} className="btn btn-outline">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {product ? 'Update' : 'Add'} Product
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input"
            >
              <option value="">All Types</option>
              <option value="FINISHED">Finished Goods</option>
              <option value="RAW_MATERIAL">Raw Material</option>
              <option value="SEMI_FINISHED">Semi-Finished</option>
              <option value="PACKAGING">Packaging</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product List */}
      <div className="card">
        {loading ? (
          <div className="p-8 text-center">
            <div className="spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Pricing</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="flex items-center">
                        <Package className="w-8 h-8 text-emerald-600 mr-3" />
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.product_code}</div>
                          {product.barcode && (
                            <div className="flex items-center text-xs text-gray-400">
                              <Barcode className="w-3 h-3 mr-1" />
                              {product.barcode}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm">{product.category}</span>
                    </td>
                    <td>
                      <span className={`badge ${
                        product.product_type === 'FINISHED' ? 'badge-success' :
                        product.product_type === 'RAW_MATERIAL' ? 'badge-primary' :
                        product.product_type === 'SEMI_FINISHED' ? 'badge-warning' :
                        'badge-secondary'
                      }`}>
                        {product.product_type.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <div className="text-sm">
                        <div>Cost: ₹{product.unit_price.toFixed(2)}</div>
                        {product.selling_price > 0 && (
                          <div className="text-emerald-600">Sale: ₹{product.selling_price.toFixed(2)}</div>
                        )}
                        <div className="text-gray-500">per {product.unit_of_measure}</div>
                      </div>
                    </td>
                    <td>
                      <div className={`font-medium ${
                        (product.stock_quantity || 0) < 20 ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {product.stock_quantity || 0} {product.unit_of_measure}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${product.is_active ? 'badge-success' : 'badge-error'}`}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredProducts.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No products found matching your criteria.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <ProductForm onClose={() => setShowAddModal(false)} />
      )}

      {editingProduct && (
        <ProductForm
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}
    </div>
  );
};

export default ProductList;
