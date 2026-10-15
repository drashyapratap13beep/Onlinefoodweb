import React, { useState } from 'react';
import { useBakery } from '../context/BakeryContext';
import {
  X,
  Lock,
  ShieldCheck,
  User as UserIcon,
  Sparkles,
  ArrowRight,
  AlertCircle,
  KeyRound,
  Check,
} from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, login, register, setActiveView } = useBakery();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleFillAdmin = () => {
    setEmail('admin@zaikadarbar.com');
    setPassword('admin');
    setError('');
  };

  const handleFillCustomer = () => {
    setEmail('aarav@example.com');
    setPassword('password123');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'login') {
      const result = await login(email, password);
      setLoading(false);
      if (result.success) {
        // If they were trying to access dashboard, check role
        if (email.toLowerCase().includes('admin')) {
          setActiveView('dashboard');
        }
      } else {
        setError(result.message || 'Login failed. Please verify credentials.');
      }
    } else {
      if (!name.trim()) {
        setError('Please provide your name');
        setLoading(false);
        return;
      }
      const result = await register(name, email, password);
      setLoading(false);
      if (!result.success) {
        setError(result.message || 'Registration failed');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full shadow-2xl border border-[#DECDB8] overflow-hidden my-0 sm:my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-[#2C241E] text-[#FAF7F2] p-5 relative">
          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="absolute top-4 right-4 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
              Access Control & Authentication
            </span>
          </div>

          <h3 className="font-serif font-bold text-xl text-white">
            {mode === 'login' ? 'Sign In to Zaika Darbar' : 'Create Royal Dining Account'}
          </h3>
          <p className="text-xs text-[#DECBC0] mt-1">
            {mode === 'login'
              ? 'Only verified Administrators can access the Sales & Category Dashboard.'
              : 'Sign up to place faster orders and manage your pickup preferences.'}
          </p>
        </div>

        {/* Demo Quick Fills Banner */}
        <div className="bg-[#FAF7F2] p-4 border-b border-[#EBE1D3] space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
            ⚡ Quick 1-Click Demo Accounts:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleFillAdmin}
              className="bg-white hover:bg-amber-50 border border-amber-300/80 rounded-xl p-2.5 text-left transition-colors cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-amber-900 group-hover:text-amber-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  Admin Login
                </span>
                <span className="text-[9px] bg-amber-100 text-amber-800 font-extrabold px-1.5 py-0.2 rounded">
                  Full Access
                </span>
              </div>
              <span className="text-[10px] text-stone-500 block truncate mt-0.5">
                admin@zaikadarbar.com
              </span>
            </button>

            <button
              type="button"
              onClick={handleFillCustomer}
              className="bg-white hover:bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-left transition-colors cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-stone-800 flex items-center gap-1">
                  <UserIcon className="w-3.5 h-3.5 text-stone-600" />
                  Customer Login
                </span>
                <span className="text-[9px] bg-stone-100 text-stone-600 font-extrabold px-1.5 py-0.2 rounded">
                  Menu Only
                </span>
              </div>
              <span className="text-[10px] text-stone-500 block truncate mt-0.5">
                aarav@example.com
              </span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="font-bold text-stone-700 block mb-1">Your Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Diya Sen"
                className="w-full bg-[#FAF7F2] border border-[#D5C5B2] rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C97A2B]"
              />
            </div>
          )}

          <div>
            <label className="font-bold text-stone-700 block mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@painetmiel.com"
              className="w-full bg-[#FAF7F2] border border-[#D5C5B2] rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C97A2B]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-stone-700">Password</label>
              {mode === 'login' && (
                <span className="text-[10px] text-stone-400">Default for admin: "admin"</span>
              )}
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#FAF7F2] border border-[#D5C5B2] rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C97A2B]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C97A2B] hover:bg-[#B2651F] text-white py-3 rounded-xl font-bold text-sm shadow-md shadow-[#C97A2B]/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : mode === 'login' ? (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Create Account</span>
                <Check className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="text-center pt-2">
            {mode === 'login' ? (
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError('');
                }}
                className="text-stone-500 hover:text-stone-800 text-xs underline cursor-pointer"
              >
                Need a customer account? Register here
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
                className="text-stone-500 hover:text-stone-800 text-xs underline cursor-pointer"
              >
                Already have an account? Sign In
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
