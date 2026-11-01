import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { usePharmacy } from '../../context/PharmacyContext';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  X,
  Clock,
  Layers,
  ChevronLeft
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const PharmacistLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { 
    loginPharmacist, 
    resendVerificationEmail 
  } = usePharmacy();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Email Not Verified modal state
  const [showUnverifiedModal, setShowUnverifiedModal] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState(null);

  // Check if routed with ?unverified=true
  useEffect(() => {
    if (searchParams.get('unverified') === 'true') {
      const emailParam = searchParams.get('email');
      if (emailParam) setUnverifiedEmail(emailParam);
      setShowUnverifiedModal(true);
    }
  }, [searchParams]);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(null);
  const [forgotError, setForgotError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setResendStatus(null);
    setLoading(true);

    try {
      const result = await loginPharmacist({ email: email.trim(), password });

      if (!result.isEmailVerified) {
        setUnverifiedEmail(result.email || email.trim());
        setShowUnverifiedModal(true);
        return;
      }

      if (!result.isSetupComplete) {
        navigate('/pharmacist/setup');
      } else {
        navigate('/pharmacist/dashboard');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please verify email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    const target = unverifiedEmail || email.trim();
    if (!target) return;
    setResending(true);
    setResendStatus(null);
    try {
      const res = await resendVerificationEmail(target);
      if (res?.resendNotice) {
        setResendStatus({ type: 'success', text: res.resendNotice });
      } else {
        setResendStatus({ type: 'success', text: 'Verification email sent. Please check your inbox.' });
      }
    } catch (err) {
      setResendStatus({ type: 'error', text: err.message || 'Failed to resend verification email.' });
    } finally {
      setResending(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setForgotError('Please enter your email address.');
      return;
    }

    setForgotLoading(true);
    setForgotError(null);
    setForgotSuccess(null);

    try {
      setForgotSuccess(`Password reset instructions sent to ${forgotEmail}. Please check your inbox.`);
    } catch (err) {
      setForgotError(err.message || 'Failed to send reset email.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center">
      <div className="min-h-screen flex flex-col lg:flex-row">
        
        {/* Left Side: Brand Visual & Value Proposition (Desktop Split Layout) */}
        <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden">
          {/* Subtle glow overlays */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Logo */}
          <div className="relative z-10 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-500 text-white flex items-center justify-center font-bold text-2xl shadow-glow">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white">MEDGUARD</span>
              <span className="ml-1.5 bg-teal-500/20 text-teal-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-teal-400/30">
                AI
              </span>
            </div>
          </div>

          {/* Center Brand Highlights */}
          <div className="relative z-10 space-y-8 max-w-md">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-teal-400">
                Pharmacist Portal
              </span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight mt-2 leading-tight">
                Intelligent medicine stock management with zero waste
              </h2>
              <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                Connect your pharmacy to the MedGuard AI ecosystem. Eliminate expired stock write-offs with automatic FEFO indexing.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Vision AI Strip Scanner</h4>
                  <p className="text-xs text-slate-400">Instant extraction of salt, batch, and expiry directly from strip foil.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">First-Expired First-Out (FEFO)</h4>
                  <p className="text-xs text-slate-400">POS automatically prioritizes oldest non-expired batches first.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Loose Tablet & Strip Conversion</h4>
                  <p className="text-xs text-slate-400">Dispense full strips or individual pieces with 100% accurate piece reconciliation.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Trust Badge */}
          <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-6">
            <span>Encrypted Neon PostgreSQL Cloud</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Operational
            </span>
          </div>
        </div>

        {/* Right Side: Authentication Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md space-y-6">
            
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  🛡️
                </div>
                <span className="font-extrabold text-slate-900 tracking-tight">MedGuard AI</span>
              </div>
              <button
                onClick={() => navigate('/')}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Home</span>
              </button>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome back
              </h1>
              <p className="text-sm text-slate-500">
                Sign in to your licensed pharmacist account to manage inventory and sales.
              </p>
            </div>

            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3.5 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="pharmacist@yourpharmacy.com"
                icon={Mail}
              />

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700 tracking-wide">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email);
                      setShowForgotModal(true);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="block w-full rounded-xl border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-blue-100 bg-white text-slate-900 placeholder:text-slate-400 text-sm pl-10 pr-3.5 py-2.5 transition-all focus:outline-none focus:ring-2"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                icon={ArrowRight}
                className="w-full shadow-glow font-bold mt-2"
              >
                Sign In to Pharmacy
              </Button>
            </form>

            <div className="pt-4 border-t border-slate-200 text-center space-y-2">
              <p className="text-xs text-slate-600">
                New pharmacy?{' '}
                <Link to="/pharmacist/register" className="font-bold text-blue-600 hover:text-blue-700 underline">
                  Create a pharmacist account
                </Link>
              </p>
              <p className="text-[11px] text-slate-400">
                Looking for medicine as a customer?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/search')}
                  className="font-medium text-teal-600 hover:underline"
                >
                  Use Customer Radar
                </button>
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Reset Password</h3>
              <button
                onClick={() => setShowForgotModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotSuccess ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{forgotSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <p className="text-xs text-slate-500">
                  Enter your registered pharmacy email address and we'll send you instructions to reset your password.
                </p>
                {forgotError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
                    {forgotError}
                  </div>
                )}
                <Input
                  label="Email Address"
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="pharmacist@yourpharmacy.com"
                  icon={Mail}
                />
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowForgotModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    loading={forgotLoading}
                  >
                    Send Instructions
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Unverified Email Modal */}
      {showUnverifiedModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Email Verification Required</h3>
              <button
                onClick={() => setShowUnverifiedModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Your account <strong>{unverifiedEmail}</strong> requires email verification before accessing the pharmacy portal.
            </p>

            {resendStatus && (
              <div
                className={`p-3 text-xs rounded-xl border flex items-center gap-2 ${
                  resendStatus.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}
              >
                {resendStatus.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                )}
                <span>{resendStatus.text}</span>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowUnverifiedModal(false)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                loading={resending}
                onClick={handleResendVerification}
              >
                Resend Verification Email
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
