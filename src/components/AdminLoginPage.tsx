import React, { useState } from 'react';
import { Lock, Mail, Key, Eye, EyeOff, AlertCircle, ArrowRight, ArrowLeft, Shield } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Logo } from './Logo';

interface AdminLoginPageProps {
  onBackToStore?: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onBackToStore }) => {
  const { loginAdmin, showToast, setIsAdminOpen } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg('Please enter both administrative email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const result = await loginAdmin(email.trim(), password);
    setLoading(false);

    if (result.success) {
      showToast('Admin authorized successfully. Opening Dashboard...');
      setIsAdminOpen(true);
    } else {
      setErrorMsg(result.message || 'Access Denied: Invalid credentials.');
    }
  };

  const handleReturnToStore = () => {
    if (onBackToStore) {
      onBackToStore();
    } else {
      window.history.pushState({}, '', '/');
      window.location.hash = '';
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f11] text-stone-100 flex flex-col justify-between p-4 sm:p-6 font-sans">
      {/* Top Bar with small "Admin Login" link / indicator */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between py-4 border-b border-stone-800/80">
        <button
          onClick={handleReturnToStore}
          className="flex items-center gap-2 text-xs font-semibold text-stone-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#d4af37]" />
          <span>Return to Storefront</span>
        </button>

        {/* Small "Admin Login" link/indicator only on the login page */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-stone-900 border border-stone-800 rounded-full text-xs text-[#d4af37] font-mono font-medium">
          <Lock className="w-3 h-3 text-[#d4af37]" />
          <span>Admin Login</span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-md bg-[#18181b] border border-stone-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
          
          <div className="text-center space-y-2">
            <div className="inline-flex w-12 h-12 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#8f6927] text-stone-950 items-center justify-center shadow-lg mb-2">
              <Shield className="w-6 h-6" />
            </div>
            
            <h1 className="font-serif text-2xl font-bold text-white tracking-tight">
              ZEE TRENDS STORE
            </h1>
            
            <p className="text-xs text-stone-400 max-w-xs mx-auto">
              Private Administrative Portal. Please verify your identity with your server-configured <code className="text-[#d4af37]">ADMIN_EMAIL</code> and <code className="text-[#d4af37]">ADMIN_PASSWORD</code>.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-950/60 border border-red-800 rounded-xl flex items-start gap-2.5 text-xs text-red-200 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
                Admin Email Address (ADMIN_EMAIL)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-500" />
                <input
                  type="email"
                  required
                  autoComplete="username"
                  placeholder="admin@zeetrendsstore.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-stone-900/90 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-[#d4af37] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
                Admin Password (ADMIN_PASSWORD)
              </label>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-stone-900/90 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-[#d4af37] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-stone-500 hover:text-stone-300 p-0.5"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#d4af37] to-[#b2883b] text-stone-950 text-xs font-bold uppercase tracking-widest rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Verifying Credentials on Server...</span>
              ) : (
                <>
                  <span>Sign In & Open Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={handleReturnToStore}
              className="text-xs text-stone-400 hover:text-stone-200 hover:underline"
            >
              Not an administrator? Back to Public Store
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full text-center py-4 text-[11px] text-stone-500 border-t border-stone-800/80">
        🔒 Backend protected routes with 256-bit server token verification.
      </footer>
    </div>
  );
};
