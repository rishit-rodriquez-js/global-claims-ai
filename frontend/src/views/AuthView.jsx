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
    <div className="min-h-screen bg-[#081018] biolum-bg text-[#F5F8FF] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans select-none">
      {/* Floating Bioluminescent Particle Elements */}
      <div className="absolute top-12 left-20 w-4 h-4 rounded-full bg-[#4DFFB4] blur-sm animate-float opacity-60 shadow-[0_0_20px_#4DFFB4]"></div>
      <div className="absolute bottom-24 right-32 w-6 h-6 rounded-full bg-[#3BCBFF] blur-sm animate-float opacity-50 shadow-[0_0_25px_#3BCBFF]"></div>
      <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-[#FF8761] blur-xs animate-float opacity-40 shadow-[0_0_15px_#FF8761]"></div>

      {/* Main Glassmorphic Container */}
      <div className="w-full max-w-5xl stripe-card bg-[#10252E]/70 border border-[#4DFFB4]/30 rounded-3xl shadow-[0_0_80px_rgba(77,255,180,0.15)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 backdrop-blur-2xl z-10">
        
        {/* Left Side: Animated AI Globe & Insurance Network (5 columns) */}
        <div className="lg:col-span-5 p-8 lg:p-10 bg-gradient-to-b from-[#10252E] to-[#081018] border-r border-white/10 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-6 relative z-10">
            {/* Brand Header */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#4DFFB4] via-[#3BCBFF] to-[#FF8761] flex items-center justify-center text-[#081018] shadow-[0_0_25px_rgba(77,255,180,0.4)] font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="font-extrabold text-lg text-white tracking-tight flex items-center gap-2">
                  GlobalClaims <span className="text-[#4DFFB4] text-xs px-2 py-0.5 rounded-full bg-[#4DFFB4]/10 border border-[#4DFFB4]/30 font-mono">AI OS</span>
                </div>
                <p className="text-xs text-[#3BCBFF] font-semibold">Autonomous GenAI Claims Operating System</p>
              </div>
            </div>

            {/* Futuristic 3D AI Globe & Insurance Circuit Graphic */}
            <div className="relative w-full py-6 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-[#4DFFB4]/20 via-[#3BCBFF]/20 to-[#FF8761]/20 rounded-full blur-3xl pointer-events-none"></div>
              <svg className="w-48 h-48 drop-shadow-[0_0_30px_rgba(77,255,180,0.4)] relative z-10 animate-float" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="aiGlobeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4DFFB4" />
                    <stop offset="50%" stopColor="#3BCBFF" />
                    <stop offset="100%" stopColor="#FF8761" />
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r="70" stroke="url(#aiGlobeGrad)" strokeWidth="2" strokeDasharray="6 4" />
                <ellipse cx="100" cy="100" rx="70" ry="25" stroke="#4DFFB4" strokeWidth="1.5" opacity="0.6" />
                <ellipse cx="100" cy="100" rx="25" ry="70" stroke="#3BCBFF" strokeWidth="1.5" opacity="0.6" />
                
                {/* Central AI Nucleus */}
                <circle cx="100" cy="100" r="18" fill="#10252E" stroke="#4DFFB4" strokeWidth="2.5" />
                <circle cx="100" cy="100" r="8" fill="#4DFFB4" />
                
                {/* Orbiting Policy Node Signals */}
                <circle cx="30" cy="100" r="6" fill="#4DFFB4" />
                <circle cx="170" cy="100" r="6" fill="#FF8761" />
                <circle cx="100" cy="30" r="6" fill="#3BCBFF" />
                <circle cx="100" cy="170" r="6" fill="#FFC857" />

                <line x1="36" y1="100" x2="82" y2="100" stroke="#4DFFB4" strokeWidth="1.5" strokeDasharray="2 2" />
                <line x1="118" y1="100" x2="164" y2="100" stroke="#FF8761" strokeWidth="1.5" strokeDasharray="2 2" />
                <line x1="100" y1="36" x2="100" y2="82" stroke="#3BCBFF" strokeWidth="1.5" strokeDasharray="2 2" />
                <line x1="100" y1="118" x2="100" y2="164" stroke="#FFC857" strokeWidth="1.5" strokeDasharray="2 2" />
              </svg>
            </div>

            {/* 3 Feature Badges */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4DFFB4]/10 border border-[#4DFFB4]/30 text-[#4DFFB4] text-xs font-semibold font-mono shadow-[0_0_12px_rgba(77,255,180,0.2)]">
                <Check className="w-3.5 h-3.5" />
                <span>Azure OpenAI</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3BCBFF]/10 border border-[#3BCBFF]/30 text-[#3BCBFF] text-xs font-semibold font-mono shadow-[0_0_12px_rgba(59,203,255,0.2)]">
                <Check className="w-3.5 h-3.5" />
                <span>Azure AI Search</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF8761]/10 border border-[#FF8761]/30 text-[#FF8761] text-xs font-semibold font-mono shadow-[0_0_12px_rgba(255,135,97,0.2)]">
                <Check className="w-3.5 h-3.5" />
                <span>Document Intelligence</span>
              </div>
            </div>
          </div>

          {/* Quick Demo Login Cards */}
          <div className="mt-6 pt-4 border-t border-[#7C5CFF]/20 relative z-10">
            <p className="text-[10px] uppercase font-bold tracking-wider text-[#00E5FF] mb-2 text-left">Quick Demo Access Roles:</p>
            <div className="grid grid-cols-2 gap-2 text-left">
              {/* Claims Officer Card */}
              <button
                type="button"
                onClick={() => handleQuickDemoFill('Officer')}
                className="p-3 rounded-2xl bg-[#060816]/90 hover:bg-[#7C5CFF]/20 border border-[#7C5CFF]/30 hover:border-[#7C5CFF] text-left transition-all group shadow-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white group-hover:text-[#7C5CFF] transition-colors">👤 Claims Officer</span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono truncate">sarah.vance@globalclaims.ai</p>
                <div className="mt-1.5 text-[10px] font-bold text-[#7C5CFF] flex items-center gap-0.5">
                  <span>Autofill</span> <ChevronRight className="w-3 h-3" />
                </div>
              </button>

              {/* Customer Card */}
              <button
                type="button"
                onClick={() => handleQuickDemoFill('Customer')}
                className="p-3 rounded-2xl bg-[#060816]/90 hover:bg-[#00E5FF]/20 border border-[#00E5FF]/30 hover:border-[#00E5FF] text-left transition-all group shadow-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white group-hover:text-[#00E5FF] transition-colors">👤 Customer</span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono truncate">emily.carter@example.com</p>
                <div className="mt-1.5 text-[10px] font-bold text-[#00E5FF] flex items-center gap-0.5">
                  <span>Autofill</span> <ChevronRight className="w-3 h-3" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Primary Login / Register Form (7 columns) */}
        <div className="lg:col-span-7 p-8 lg:p-10 flex flex-col justify-between bg-[#0F1326]">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#7C5CFF]/20 pb-4 mb-6">
              <div>
                <h2 className="text-xl font-extrabold text-white tracking-tight">
                  {isLogin ? 'Enterprise Sign In' : 'Create Account'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isLogin ? 'Sign in to access your autonomous claims OS workspace' : 'Register a Customer or Claim Officer account'}
                </p>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30">
                v2.0 AI-OS
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

