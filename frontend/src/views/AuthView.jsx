import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, User, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { loginApi, registerApi } from '../services/api.js';

export default function AuthView({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('sarah.vance@globalclaims.ai');
  const [password, setPassword] = useState('GlobalClaims@2026');
  const [name, setName] = useState('Senior Officer Sarah Vance');
  const [role, setRole] = useState('Claim Officer');
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        // REAL BACKEND API CALL -> POST /api/users/login
        const res = await loginApi(email, password);
        setIsLoading(false);
        onLoginSuccess(res.user);
      } else {
        // REAL BACKEND API CALL -> POST /api/users/register
        const res = await registerApi(name, email, password, role);
        setIsLoading(false);
        onLoginSuccess(res.user);
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Authentication failed');
    }
  };

  return (
    <div class="min-h-screen bg-[#0b0f19] text-slate-100 flex items-center justify-center p-6">
      <div class="stripe-card p-8 max-w-md w-full border border-slate-800 bg-[#0f172a] space-y-6">
        <div class="text-center space-y-2">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-blue-500/20">
            <ShieldCheck class="w-7 h-7" />
          </div>
          <h1 class="text-xl font-bold text-white tracking-tight">GlobalClaims AI</h1>
          <p class="text-xs text-slate-400">
            {isLogin ? 'Sign in to access your claims portal & AI workspace' : 'Register a new Customer or Claim Officer account'}
          </p>
        </div>

        {errorMessage && (
          <div class="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle class="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} class="space-y-4 text-xs">
          {!isLogin && (
            <div>
              <label class="block text-slate-400 font-medium mb-1">Full Name</label>
              <div class="relative">
                <User class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alexander Wright"
                  class="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          <div>
            <label class="block text-slate-400 font-medium mb-1">Email Address</label>
            <div class="relative">
              <Mail class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@globalclaims.ai"
                class="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-slate-400 font-medium mb-1">Password</label>
            <div class="relative">
              <Lock class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                class="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label class="block text-slate-400 font-medium mb-1">User Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Customer">Customer</option>
                <option value="Claim Officer">Claim Officer</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            class="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            <span>{isLoading ? 'Authenticating...' : isLogin ? 'Sign In' : 'Register Account'}</span>
            <ArrowRight class="w-4 h-4" />
          </button>
        </form>

        <div class="pt-4 border-t border-slate-800 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            class="text-xs text-blue-400 hover:text-blue-300 font-medium"
          >
            {isLogin ? "Don't have an account? Register" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
