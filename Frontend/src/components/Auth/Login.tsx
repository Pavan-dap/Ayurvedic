import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Package, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Please enter both username and password');
      return;
    }

    setLoading(true);
    try {
      await login(username, password);
      toast.success('Welcome to AyurERP!');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Demo login function
  const handleDemoLogin = async () => {
    setUsername('admin');
    setPassword('admin123');
    setLoading(true);
    
    // Simulate API delay
    setTimeout(async () => {
      try {
        await login('admin', 'admin123');
        toast.success('Welcome to AyurERP Demo!');
      } catch (error: any) {
        // For demo purposes, always succeed
        localStorage.setItem('accessToken', 'demo-token');
        window.location.reload();
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-sky-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex items-center">
            <Package className="w-12 h-12 text-emerald-600" />
            <span className="ml-3 text-3xl font-bold text-gray-900">AyurERP</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ayurvedic & Herbal Business Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="label">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="spinner w-4 h-4 mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleDemoLogin}
                disabled={loading}
                className="btn btn-secondary w-full disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="spinner w-4 h-4 mr-2"></div>
                    Loading Demo...
                  </div>
                ) : (
                  'Try Demo'
                )}
              </button>
            </div>
          </div>

          <div className="mt-6">
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>Demo Credentials:</strong></p>
              <p>Username: <code className="bg-gray-100 px-1 rounded">admin</code></p>
              <p>Password: <code className="bg-gray-100 px-1 rounded">admin123</code></p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="text-sm text-gray-600">
            <p className="font-semibold">Key Features:</p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div>• Customer Management</div>
              <div>• Inventory Control</div>
              <div>• Production Tracking</div>
              <div>• Sales & Billing</div>
              <div>• HR & Payroll</div>
              <div>• Financial Reports</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;