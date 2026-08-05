import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  Sparkles, 
  HelpCircle,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { loginApi, registerApi } from '../services/api.js';

export default function AuthView({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Claim Officer');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Real-time password strength checks
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const emailPrefix = email.split('@')[0]?.toLowerCase() || '';
  const isNameInPassword = name && name.length >= 3 && password.toLowerCase().includes(name.toLowerCase());
  const isEmailInPassword = emailPrefix && emailPrefix.length >= 3 && password.toLowerCase().includes(emailPrefix);
  const isCommonWeak = ['password123', '12345678', 'admin123', 'globalclaims'].some(w => password.toLowerCase().includes(w));

  const passwordStrengthScore = [hasMinLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
  const isPasswordValid = passwordStrengthScore === 5 && !isNameInPassword && !isEmailInPassword && !isCommonWeak;
  const doPasswordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleKeyUp = (e) => {
    if (e.getModifierState) {
      setIsCapsLockOn(e.getModifierState('CapsLock'));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please enter both email address and password.");
      return;
    }

    if (!isLogin && !isPasswordValid) {
      if (isNameInPassword || isEmailInPassword) {
        setErrorMessage("Password cannot contain your name or email prefix.");
        return;
      }
      if (isCommonWeak) {
        setErrorMessage("Password is too common. Choose a unique password.");
        return;
      }
      setErrorMessage("Password must meet all complexity requirements (min 8 chars, uppercase, lowercase, number, special char).");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setErrorMessage("Password and Confirm Password do not match.");
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        const res = await loginApi(email, password);
        setIsLoading(false);
        if (res.user) {
          onLoginSuccess(res.user);
        }
      } else {
        const res = await registerApi(name, email, password, confirmPassword, role);
        setIsLoading(false);
        if (res.user) {
          onLoginSuccess(res.user);
        }
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Authentication failed. Please check credentials.');
    }
  };

  const handleQuickDemoFill = (demoRole) => {
    if (demoRole === 'Officer') {
      setEmail('sarah.vance@globalclaims.ai');
      setPassword('GlobalClaims@2026');
      setRole('Claim Officer');
      setIsLogin(true);
    } else if (demoRole === 'Customer') {
      setEmail('emily.carter@example.com');
      setPassword('GlobalClaims@2026');
      setRole('Customer');
      setIsLogin(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex items-center justify-center p-4 md:p-8 font-sans relative overflow-hidden">
      {/* Dynamic Background Glow Elements */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Glassmorphic Container */}
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 rounded-2xl border border-slate-800 bg-[#0f172a]/90 backdrop-blur-xl shadow-2xl overflow-hidden relative z-10">
        
        {/* Left Side: Clean Enterprise Hero Showcase (5 columns) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-950/60 via-slate-900/80 to-[#0b0f19] p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800/80 text-center lg:text-left">
          <div className="space-y-4">
            {/* Header Brand */}
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold text-lg text-white tracking-tight flex items-center gap-2">
                  GlobalClaims <span className="text-blue-400 text-xs px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 font-mono">AI</span>
                </div>
                <p className="text-xs text-blue-300 font-medium">Explainable AI Insurance Claims Platform</p>
              </div>
            </div>

            {/* Hero Graphic (Shield + AI + Cloud Vector Illustration) */}
            <div className="relative w-full py-4 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-cyan-500/10 rounded-3xl blur-2xl pointer-events-none"></div>
              <svg className="w-40 h-40 drop-shadow-2xl relative z-10" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#4f46e5" />
                  </linearGradient>
                </defs>
                {/* Outer Shield Outline */}
                <path d="M100 20 L160 50 V110 C160 150 100 180 100 180 C100 180 40 150 40 110 V50 L100 20 Z" fill="url(#shieldGrad)" fillOpacity="0.15" stroke="url(#shieldGrad)" strokeWidth="3" />
                {/* Inner AI Circuit Node Graphic */}
                <path d="M100 45 L145 68 V110 C145 138 100 160 100 160 C100 160 55 138 55 110 V68 L100 45 Z" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 2" />
                {/* Central Cloud Core */}
                <circle cx="100" cy="100" r="26" fill="#1e293b" stroke="#60a5fa" strokeWidth="2" />
                {/* Cloud Icon path */}
                <path d="M88 103 C86 103 84 101 84 98 C84 95 86 93 89 93 C90 89 94 87 98 88 C102 85 107 87 109 91 C112 91 114 93 114 96 C116 96 117 98 117 100 C117 103 115 105 112 105 L88 103 Z" fill="#3b82f6" opacity="0.9" />
                {/* Orbiting Points */}
                <circle cx="100" cy="50" r="5" fill="#60a5fa" />
                <circle cx="145" cy="100" r="5" fill="#818cf8" />
                <circle cx="100" cy="150" r="5" fill="#34d399" />
                <circle cx="55" cy="100" r="5" fill="#f59e0b" />
                <line x1="100" y1="55" x2="100" y2="74" stroke="#60a5fa" strokeWidth="1.5" />
                <line x1="140" y1="100" x2="126" y2="100" stroke="#818cf8" strokeWidth="1.5" />
                <line x1="100" y1="145" x2="100" y2="126" stroke="#34d399" strokeWidth="1.5" />
                <line x1="60" y1="100" x2="74" y2="100" stroke="#f59e0b" strokeWidth="1.5" />
              </svg>
            </div>

            {/* 3 Tech Chips */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs font-medium">
                <Check className="w-3.5 h-3.5 text-blue-400" />
                <span>Azure OpenAI</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-medium">
                <Check className="w-3.5 h-3.5 text-indigo-400" />
                <span>AI Search (RAG)</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-medium">
                <Check className="w-3.5 h-3.5 text-cyan-400" />
                <span>Document Intelligence</span>
              </div>
            </div>
          </div>

          {/* Quick Demo Section (2 Roles: Officer & Customer) */}
          <div className="mt-6 pt-4 border-t border-slate-800/80">
            <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 mb-2 text-left">Quick Demo Login:</p>
            <div className="grid grid-cols-2 gap-2 text-left">
              {/* Claims Officer Card */}
              <button
                type="button"
                onClick={() => handleQuickDemoFill('Officer')}
                className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-purple-500/10 border border-slate-800 hover:border-purple-500/40 text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-white group-hover:text-purple-300 transition-colors">👤 Claims Officer</span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono truncate">sarah.vance@globalclaims.ai</p>
                <div className="mt-1.5 text-[10px] font-semibold text-purple-400 flex items-center gap-0.5">
                  <span>Use Demo</span> <ChevronRight className="w-3 h-3" />
                </div>
              </button>

              {/* Customer Card */}
              <button
                type="button"
                onClick={() => handleQuickDemoFill('Customer')}
                className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-blue-500/10 border border-slate-800 hover:border-blue-500/40 text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-white group-hover:text-blue-300 transition-colors">👤 Customer</span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono truncate">emily.carter@example.com</p>
                <div className="mt-1.5 text-[10px] font-semibold text-blue-400 flex items-center gap-0.5">
                  <span>Use Demo</span> <ChevronRight className="w-3 h-3" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Primary Login / Register Form (7 columns) */}
        <div className="lg:col-span-7 p-8 lg:p-10 flex flex-col justify-between bg-[#0f172a]">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  {isLogin ? 'Enterprise Sign In' : 'Create Account'}
                </h2>
                <p className="text-xs text-slate-400">
                  {isLogin ? 'Sign in to access your claims workspace' : 'Register a Customer or Claim Officer account'}
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                v1.0.0
              </span>
            </div>

            {/* Error Notification */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span className="leading-snug">{errorMessage}</span>
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-xs text-slate-400 font-medium mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Emily Carter"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs text-slate-400 font-medium mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah.vance@globalclaims.ai"
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-slate-400 font-medium">Password</label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => setShowForgotPasswordModal(true)}
                      className="text-[11px] text-blue-400 hover:text-blue-300 font-medium transition-colors"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyUp={handleKeyUp}
                    placeholder="••••••••"
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-9 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {isCapsLockOn && (
                  <p className="text-[10px] text-amber-400 font-medium mt-1 flex items-center gap-1">
                    <span>⚠️ Caps Lock is ON</span>
                  </p>
                )}
              </div>

              {!isLogin && (
                <>
                  {/* Password Strength Meter */}
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-[11px]">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Password Complexity</span>
                      <span className={`font-semibold ${passwordStrengthScore === 5 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {passwordStrengthScore === 5 ? 'Strong' : `${passwordStrengthScore}/5 Requirements`}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex gap-1">
                      <div className={`h-full transition-all duration-300 ${passwordStrengthScore >= 1 ? (passwordStrengthScore === 5 ? 'bg-emerald-500' : 'bg-amber-500') : 'bg-slate-700'}`} style={{ width: '20%' }}></div>
                      <div className={`h-full transition-all duration-300 ${passwordStrengthScore >= 2 ? (passwordStrengthScore === 5 ? 'bg-emerald-500' : 'bg-amber-500') : 'bg-slate-700'}`} style={{ width: '20%' }}></div>
                      <div className={`h-full transition-all duration-300 ${passwordStrengthScore >= 3 ? (passwordStrengthScore === 5 ? 'bg-emerald-500' : 'bg-amber-500') : 'bg-slate-700'}`} style={{ width: '20%' }}></div>
                      <div className={`h-full transition-all duration-300 ${passwordStrengthScore >= 4 ? (passwordStrengthScore === 5 ? 'bg-emerald-500' : 'bg-amber-500') : 'bg-slate-700'}`} style={{ width: '20%' }}></div>
                      <div className={`h-full transition-all duration-300 ${passwordStrengthScore === 5 ? 'bg-emerald-500' : 'bg-slate-700'}`} style={{ width: '20%' }}></div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-slate-400 pt-1">
                      <div className="flex items-center gap-1.5">
                        {hasMinLength ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-slate-600" />}
                        <span>8+ characters</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {hasUpper ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-slate-600" />}
                        <span>Uppercase letter</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {hasLower ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-slate-600" />}
                        <span>Lowercase letter</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {hasNumber ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-slate-600" />}
                        <span>Number (0-9)</span>
                      </div>
                      <div className="flex items-center gap-1.5 col-span-2">
                        {hasSpecial ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-slate-600" />}
                        <span>Special character (!@#$%^&*)</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 font-medium mb-1">Confirm Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-9 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      />
                      {confirmPassword.length > 0 && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {doPasswordsMatch ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <X className="w-4 h-4 text-rose-400" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 font-medium mb-1">Account Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    >
                      <option value="Customer">Customer (Submit Claims & Track Status)</option>
                      <option value="Claim Officer">Claim Officer (Review, Audit & AI Copilot)</option>
                    </select>
                  </div>
                </>
              )}

              {isLogin && (
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300 select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                    <span>Remember Me</span>
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Authenticating with Azure AI...</span>
                  </>
                ) : (
                  <>
                    <span>{isLogin ? 'Sign In to Workspace' : 'Register Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Subtle Footer inside Form Box */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
              <p className="text-[10px] text-slate-500 font-mono tracking-wide">
                Powered by <span className="text-slate-400">Azure OpenAI</span> • <span className="text-slate-400">Azure AI Search</span> • <span className="text-slate-400">Azure Document Intelligence</span> • <span className="text-slate-400">Azure SQL</span>
              </p>
            </div>
          </div>

          {/* Toggle Login/Register Link */}
          <div className="pt-4 border-t border-slate-800 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setErrorMessage(null);
              }}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              {isLogin ? "Don't have an account? Register" : "Already have an account? Sign In"}
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Demo Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="max-w-md w-full rounded-2xl bg-[#0f172a] border border-slate-800 p-6 space-y-4 shadow-2xl relative">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>

            <h3 className="text-base font-bold text-white">Password Recovery Notice</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Self-service password reset is disabled in this demonstration environment. Please contact your System Administrator to reset your credentials.
            </p>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1 font-mono">
              <p><strong className="text-slate-300">Support Email:</strong> support@globalclaims.ai</p>
              <p><strong className="text-slate-300">Demo Password:</strong> GlobalClaims@2026</p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowForgotPasswordModal(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Close & Return to Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

