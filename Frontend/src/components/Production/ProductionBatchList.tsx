import React, { useState, useEffect } from 'react';
import { Plus, Search, Play, CheckCircle, Clock, Factory } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import toast from 'react-hot-toast';

interface ProductionBatch {
  id: number;
  batch_number: string;
  product_name: string;
  formula_name: string;
  planned_quantity: number;
  actual_quantity: number;
  status: string;
  production_date: string;
  completion_date?: string;
  total_cost: number;
  ingredients: Ingredient[];
}

interface Ingredient {
  id: number;
  name: string;
  required_quantity: number;
  unit: string;
  cost_per_unit: number;
}

const ProductionBatchList: React.FC = () => {
  const { refreshTrigger } = useData();
  const [batches, setBatches] = useState<ProductionBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<ProductionBatch | null>(null);

  // Mock data based on the handwritten formulas from attachments
  const mockBatches: ProductionBatch[] = [
    {
      id: 1,
      batch_number: 'PB20240101',
      product_name: 'Premium Coconut Oil',
      formula_name: 'Premium Coconut Oil Formula',
      planned_quantity: 900,
      actual_quantity: 880,
      status: 'COMPLETED',
      production_date: '2024-01-15',
      completion_date: '2024-01-16',
      total_cost: 15000,
      ingredients: [
        { id: 1, name: 'Sprig Twist', required_quantity: 900, unit: 'gm', cost_per_unit: 5 },
        { id: 2, name: 'Shea Butter Extract', required_quantity: 100, unit: 'gm', cost_per_unit: 15 },
        { id: 3, name: 'Coconut Milk', required_quantity: 350, unit: 'gm', cost_per_unit: 8 },
        { id: 4, name: 'Aloe Vera Gel', required_quantity: 150, unit: 'gm', cost_per_unit: 12 },
        { id: 5, name: 'Rose Water', required_quantity: 50, unit: 'gm', cost_per_unit: 10 },
        { id: 6, name: 'Mandela Pulp', required_quantity: 75, unit: 'gm', cost_per_unit: 20 },
        { id: 7, name: 'Green Tea Extract', required_quantity: 50, unit: 'gm', cost_per_unit: 25 },
        { id: 8, name: 'Onion Seed Extract', required_quantity: 37.5, unit: 'gm', cost_per_unit: 30 },
        { id: 9, name: 'Argan Oil', required_quantity: 20, unit: 'ml', cost_per_unit: 50 },
        { id: 10, name: 'Grape Seed Oil', required_quantity: 20, unit: 'ml', cost_per_unit: 40 },
        { id: 11, name: 'Neem Oil', required_quantity: 10, unit: 'ml', cost_per_unit: 35 },
        { id: 12, name: 'Jasmin Oil', required_quantity: 10, unit: 'ml', cost_per_unit: 60 },
        { id: 13, name: 'Tea Tree Oil', required_quantity: 10, unit: 'ml', cost_per_unit: 45 },
        { id: 14, name: 'Ethylene', required_quantity: 35, unit: 'gm', cost_per_unit: 15 },
        { id: 15, name: 'Pyridoxine', required_quantity: 35, unit: 'gm', cost_per_unit: 25 }
      ]
    },
    {
      id: 2,
      batch_number: 'PB20240102',
      product_name: 'Herbal Hair Oil',
      formula_name: 'Traditional Hair Oil',
      planned_quantity: 500,
      actual_quantity: 0,
      status: 'IN_PROGRESS',
      production_date: '2024-01-20',
      total_cost: 8500,
      ingredients: [
        { id: 1, name: 'Coconut Oil Base', required_quantity: 300, unit: 'ml', cost_per_unit: 20 },
        { id: 2, name: 'Brahmi Extract', required_quantity: 50, unit: 'gm', cost_per_unit: 40 },
        { id: 3, name: 'Amla Powder', required_quantity: 75, unit: 'gm', cost_per_unit: 25 },
        { id: 4, name: 'Fenugreek Seeds', required_quantity: 25, unit: 'gm', cost_per_unit: 15 }
      ]
    }
  ];

  useEffect(() => {
    loadBatches();
  }, [refreshTrigger]);

  const loadBatches = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setBatches(mockBatches);
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast.error('Failed to load production batches');
      setLoading(false);
    }
  };

  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.batch_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.product_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterStatus || batch.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'IN_PROGRESS': return 'warning';
      case 'PLANNED': return 'secondary';
      case 'QUALITY_CHECK': return 'primary';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return CheckCircle;
      case 'IN_PROGRESS': return Play;
      case 'PLANNED': return Clock;
      case 'QUALITY_CHECK': return Factory;
      default: return Clock;
    }
  };

  const startProduction = async (id: number) => {
    try {
      setBatches(batches.map(batch =>
        batch.id === id ? { ...batch, status: 'IN_PROGRESS' } : batch
      ));
      toast.success('Production started successfully');
    } catch (error) {
      toast.error('Failed to start production');
    }
  };

  const completeProduction = async (id: number, actualQuantity: number) => {
    try {
      setBatches(batches.map(batch =>
        batch.id === id ? { 
          ...batch, 
          status: 'COMPLETED', 
          actual_quantity: actualQuantity,
          completion_date: new Date().toISOString().split('T')[0]
        } : batch
      ));
      toast.success('Production completed successfully');
    } catch (error) {
      toast.error('Failed to complete production');
    }
  };

  const BatchDetailsModal = ({ batch, onClose }: { batch: ProductionBatch; onClose: () => void }) => {
    const [actualQuantity, setActualQuantity] = useState(batch.actual_quantity || batch.planned_quantity);

    return (
      <div className="modal-overlay">
        <div className="modal-content max-w-4xl">
          <div className="modal-header">
            <h2 className="text-xl font-semibold">Production Batch Details</h2>
          </div>
          <div className="modal-body space-y-6">
            {/* Batch Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Batch Information</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Batch Number:</strong> {batch.batch_number}</div>
                  <div><strong>Product:</strong> {batch.product_name}</div>
                  <div><strong>Formula:</strong> {batch.formula_name}</div>
                  <div><strong>Status:</strong> 
                    <span className={`badge badge-${getStatusColor(batch.status)} ml-2`}>
                      {batch.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Production Details</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Planned Quantity:</strong> {batch.planned_quantity} units</div>
                  <div><strong>Actual Quantity:</strong> {batch.actual_quantity} units</div>
                  <div><strong>Production Date:</strong> {new Date(batch.production_date).toLocaleDateString()}</div>
                  {batch.completion_date && (
                    <div><strong>Completion Date:</strong> {new Date(batch.completion_date).toLocaleDateString()}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Ingredients List */}
            <div>
              <h3 className="font-semibold mb-3">Ingredients Required</h3>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Ingredient</th>
                      <th>Required Qty</th>
                      <th>Unit</th>
                      <th>Cost/Unit</th>
                      <th>Total Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batch.ingredients.map((ingredient) => (
                      <tr key={ingredient.id}>
                        <td>{ingredient.name}</td>
                        <td>{ingredient.required_quantity}</td>
                        <td>{ingredient.unit}</td>
                        <td>₹{ingredient.cost_per_unit}</td>
                        <td>₹{(ingredient.required_quantity * ingredient.cost_per_unit).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="font-semibold">
                      <td colSpan={4}>Total Material Cost:</td>
                      <td>₹{batch.ingredients.reduce((sum, ing) => sum + (ing.required_quantity * ing.cost_per_unit), 0).toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Production Actions */}
            {batch.status === 'IN_PROGRESS' && (
              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Complete Production</h3>
                <div className="flex items-center gap-4">
                  <div>
                    <label className="label">Actual Quantity Produced</label>
                    <input
                      type="number"
                      value={actualQuantity}
                      onChange={(e) => setActualQuantity(Number(e.target.value))}
                      className="input w-32"
                    />
                  </div>
                  <button
                    onClick={() => {
                      completeProduction(batch.id, actualQuantity);
                      onClose();
                    }}
                    className="btn btn-success"
                  >
                    Complete Production
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button onClick={onClose} className="btn btn-outline">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const NewBatchForm = ({ onClose }: { onClose: () => void }) => {
    const [formData, setFormData] = useState({
      product_name: '',
      formula_name: '',
      planned_quantity: 0,
      production_date: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const newBatch: ProductionBatch = {
          id: Date.now(),
          batch_number: `PB${Date.now()}`,
          ...formData,
          actual_quantity: 0,
          status: 'PLANNED',
          total_cost: 0,
          ingredients: []
        };
        setBatches([...batches, newBatch]);
        toast.success('Production batch created successfully');
        onClose();
      } catch (error) {
        toast.error('Failed to create production batch');
      }
    };

    return (
      <div className="modal-overlay">
        <div className="modal-content max-w-2xl">
          <div className="modal-header">
            <h2 className="text-xl font-semibold">Create New Production Batch</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body space-y-4">
              <div>
                <label className="label">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.product_name}
                  onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                  className="input"
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className="label">Formula Name *</label>
                <input
                  type="text"
                  required
                  value={formData.formula_name}
                  onChange={(e) => setFormData({ ...formData, formula_name: e.target.value })}
                  className="input"
                  placeholder="Enter formula name"
                />
              </div>
              <div className="form-row">
                <div>
                  <label className="label">Planned Quantity *</label>
                  <input
                    type="number"
                    required
                    value={formData.planned_quantity}
                    onChange={(e) => setFormData({ ...formData, planned_quantity: Number(e.target.value) })}
                    className="input"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="label">Production Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.production_date}
                    onChange={(e) => setFormData({ ...formData, production_date: e.target.value })}
                    className="input"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" onClick={onClose} className="btn btn-outline">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create Batch
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
          <h1 className="text-2xl font-bold text-gray-900">Production Batches</h1>
          <p className="text-gray-600">Manage production batches and track progress</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Batch
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
                placeholder="Search batches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input"
            >
              <option value="">All Status</option>
              <option value="PLANNED">Planned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="QUALITY_CHECK">Quality Check</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Batch List */}
      <div className="card">
        {loading ? (
          <div className="p-8 text-center">
            <div className="spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading production batches...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Batch Details</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Dates</th>
                  <th>Cost</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBatches.map((batch) => {
                  const StatusIcon = getStatusIcon(batch.status);
                  return (
                    <tr key={batch.id}>
                      <td>
                        <div>
                          <div className="font-medium text-gray-900">{batch.batch_number}</div>
                          <div className="text-sm text-gray-500">{batch.formula_name}</div>
                        </div>
                      </td>
                      <td>
                        <span className="font-medium">{batch.product_name}</span>
                      </td>
                      <td>
                        <div className="text-sm">
                          <div>Planned: {batch.planned_quantity}</div>
                          {batch.actual_quantity > 0 && (
                            <div className="text-emerald-600">Actual: {batch.actual_quantity}</div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          <div>Start: {new Date(batch.production_date).toLocaleDateString()}</div>
                          {batch.completion_date && (
                            <div>End: {new Date(batch.completion_date).toLocaleDateString()}</div>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="font-medium text-emerald-600">
                          ₹{batch.total_cost.toLocaleString()}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-${getStatusColor(batch.status)} flex items-center`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {batch.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedBatch(batch)}
                            className="btn btn-outline btn-sm"
                          >
                            View Details
                          </button>
                          {batch.status === 'PLANNED' && (
                            <button
                              onClick={() => startProduction(batch.id)}
                              className="btn btn-primary btn-sm"
                            >
                              <Play className="w-3 h-3 mr-1" />
                              Start
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredBatches.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No production batches found matching your criteria.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <NewBatchForm onClose={() => setShowAddModal(false)} />
      )}

      {selectedBatch && (
        <BatchDetailsModal
          batch={selectedBatch}
          onClose={() => setSelectedBatch(null)}
        />
      )}
    </div>
  );
};

export default ProductionBatchList;