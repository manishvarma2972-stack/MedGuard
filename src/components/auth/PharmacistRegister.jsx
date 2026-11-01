import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usePharmacy } from '../../context/PharmacyContext';
import { 
  Mail, 
  Phone, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2,
  ShieldCheck,
  UserCheck,
  Sparkles,
  ChevronLeft,
  Building2
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const PharmacistRegister = () => {
  const navigate = useNavigate();
  const { registerPharmacist, resendVerificationEmail } = usePharmacy();

  // Basic account info fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Registration success popup/modal
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [resendNotice, setResendNotice] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setResendNotice(null);

    // Validations
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify both password fields.');
      return;
    }
    const cleanPhone = mobileNumber.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);

    try {
      await registerPharmacist({
        fullName: fullName.trim(),
        name: fullName.trim(),
        email: email.trim(),
        password,
        phone: cleanPhone,
        mobileNumber: cleanPhone,
      });

      setRegisteredEmail(email.trim());
      setShowVerifyModal(true);
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleModalOk = () => {
    setShowVerifyModal(false);
    navigate('/pharmacist/setup');
  };

  const handleResend = async () => {
    const target = registeredEmail || email.trim();
    if (!target) return;
    setResending(true);
    setResendNotice(null);
    try {
      const res = await resendVerificationEmail(target);
      if (res?.resendNotice) {
        setResendNotice({ type: 'success', text: res.resendNotice });
      } else {
        setResendNotice({ type: 'success', text: 'Verification email sent. Please check your inbox.' });
      }
    } catch (err) {
      setResendNotice({ type: 'error', text: err.message || 'Failed to resend email.' });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center">
      <div className="min-h-screen flex flex-col lg:flex-row">
        
        {/* Left Side: Brand Visual (Desktop Split Layout) */}
        <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden">
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

          {/* Highlights */}
          <div className="relative z-10 space-y-6 max-w-md">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-teal-400">
                Pharmacy Onboarding
              </span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight mt-2 leading-tight">
                Modernize your medicine counter in under 3 minutes
              </h2>
              <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                Join licensed community pharmacies using MedGuard AI for automated stock inwarding, FEFO sales, and local customer visibility.
              </p>
            </div>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-xs text-slate-300 font-medium">Automatic Blister Strip Vision AI Scanning</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-xs text-slate-300 font-medium">Zero Waste FEFO Priority Billing</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-xs text-slate-300 font-medium">Loose Tablet vs. Strip Conversion POS</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-xs text-slate-300 font-medium">Live Customer Medicine Radar Discovery</span>
              </div>
            </div>
          </div>

          {/* Bottom Step Indicator */}
          <div className="relative z-10 border-t border-slate-800 pt-6">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                1
              </span>
              <span className="font-semibold text-white">Step 1: Pharmacist Registration</span>
              <span className="text-slate-600">→</span>
              <span className="text-slate-500">Step 2: Pharmacy Details & Location</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
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

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                Step 1 of 2
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Create Pharmacist Account
              </h1>
              <p className="text-sm text-slate-500">
                Register as a pharmacist to set up your store and inventory.
              </p>
            </div>

            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3.5 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <Input
                label="Full Name / Pharmacist Name *"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. Rajesh Sharma"
                icon={UserCheck}
              />

              <Input
                label="Email Address *"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="pharmacist@yourpharmacy.com"
                icon={Mail}
              />

              <Input
                label="Mobile Number (10 digits) *"
                type="tel"
                required
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="9876543210"
                icon={Phone}
              />

              <Input
                label="Password (min. 6 characters) *"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                icon={Lock}
              />

              <Input
                label="Confirm Password *"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                icon={Lock}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                icon={ArrowRight}
                className="w-full shadow-glow font-bold mt-4"
              >
                Create Account & Proceed
              </Button>
            </form>

            <div className="pt-4 border-t border-slate-200 text-center space-y-2">
              <p className="text-xs text-slate-600">
                Already registered?{' '}
                <Link to="/pharmacist/login" className="font-bold text-blue-600 hover:text-blue-700 underline">
                  Sign In
                </Link>
              </p>
              <p className="text-[11px] text-slate-400">
                Are you a patient looking for medicine?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/search')}
                  className="font-medium text-teal-600 hover:underline"
                >
                  Find Medicine
                </button>
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Verification Success / Setup Next Step Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-lg">Account Created Successfully!</h3>
              <p className="text-xs text-slate-600">
                Welcome to MedGuard AI, <strong>{fullName}</strong>.
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 text-left space-y-1">
              <p className="font-semibold text-slate-800">Next Step: Pharmacy Profile & GPS Location</p>
              <p className="text-[11px] text-slate-500">
                Set up your pharmacy name, license number, and map pin so customers nearby can discover your medicine inventory.
              </p>
            </div>

            {resendNotice && (
              <div
                className={`p-3 text-xs rounded-xl border flex items-center gap-2 ${
                  resendNotice.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}
              >
                <span>{resendNotice.text}</span>
              </div>
            )}

            <div className="flex flex-col gap-2 pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={handleModalOk}
                icon={ArrowRight}
                className="w-full shadow-glow font-bold"
              >
                Proceed to Pharmacy Setup
              </Button>
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-xs text-slate-500 hover:text-slate-800 underline py-1"
              >
                {resending ? 'Sending...' : 'Resend Verification Email'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
