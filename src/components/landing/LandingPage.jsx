import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Sparkles, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Camera, 
  Clock, 
  TrendingUp, 
  Layers, 
  MapPin, 
  Zap, 
  ChevronRight, 
  Menu, 
  X, 
  Building2, 
  Activity,
  FileText,
  Lock,
  ChevronDown
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const LandingPage = ({ onExploreCustomerSearch }) => {
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const trustBadges = [
    { icon: Sparkles, label: 'Vision AI Strip Recognition' },
    { icon: Clock, label: 'FEFO Expiry Protection' },
    { icon: Layers, label: 'Strip & Piece Conversion' },
    { icon: MapPin, label: 'Verified Pharmacy Discovery' },
  ];

  const features = [
    {
      icon: Camera,
      title: 'AI Medicine Recognition',
      desc: 'Scan blister strips and packaging using advanced vision intelligence. Automatically detects medicine brand, generic salt, batch number, and expiry date.',
      tag: 'Vision AI',
      color: 'blue'
    },
    {
      icon: Clock,
      title: 'Automated FEFO Inventory',
      desc: 'First-Expired, First-Out prioritization ensures older inventory batches are dispensed before newer stock, drastically eliminating expired write-offs.',
      tag: 'Zero Waste',
      color: 'teal'
    },
    {
      icon: Layers,
      title: 'Loose Tablet & Strip POS',
      desc: 'Seamless dual-unit inventory. Dispense whole strips or cut loose tablets while maintaining 100% accurate piece-level balance reconciliation.',
      tag: 'Precision POS',
      color: 'indigo'
    },
    {
      icon: MapPin,
      title: 'Customer Medicine Radar',
      desc: 'Patients and caregivers can search medicine availability in real-time across licensed pharmacies nearby, with verified GPS distances.',
      tag: 'Public Access',
      color: 'emerald'
    },
    {
      icon: Activity,
      title: 'Expiry Radar & Alerts',
      desc: 'Proactive 30, 60, and 90-day expiry triage categories with automated notifications to return or discount stock before losses occur.',
      tag: 'Proactive Alert',
      color: 'amber'
    },
    {
      icon: FileText,
      title: 'Audit-Proof Movement Logs',
      desc: 'Every inward stock intake, POS sale, and return is permanently recorded with timestamped audit trails for complete compliance.',
      tag: 'Compliance',
      color: 'cyan'
    }
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Snap Strip Photo',
      desc: 'Upload or capture a medicine blister pack or packaging directly from any mobile camera or desktop scanner.',
      detail: 'Supports JPEG, PNG & WebP with automated client-side downscaling and compression.'
    },
    {
      step: '02',
      title: 'Vision AI Extraction',
      desc: 'Multi-modal neural models read printed text, batch numbers, manufacturing dates, and expiration timelines.',
      detail: 'Parses complex multi-salt names, pack sizes, and manufacturer details in seconds.'
    },
    {
      step: '03',
      title: 'Pharmacist Verification',
      desc: 'Extracted fields are presented in an editable review sheet. Pharmacists confirm or fine-tune details before saving.',
      detail: 'Ensures human-in-the-loop safety without ever blindly trusting raw machine readings.'
    },
    {
      step: '04',
      title: 'Smart Stock & Discovery',
      desc: 'Stock enters active inventory with FEFO indexing and becomes discoverable to local customers seeking that medicine.',
      detail: 'Instantly synced with Point-of-Sale billing and nearest customer search.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-teal-500 text-white flex items-center justify-center font-bold text-2xl shadow-glow">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">MEDGUARD</span>
                <span className="bg-teal-50 text-teal-700 text-xs font-bold px-2 py-0.5 rounded-full border border-teal-200 tracking-wider">
                  AI
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 tracking-wide">Intelligent Pharmacy System</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
              How It Works
            </a>
            <a href="#ai-showcase" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
              Vision AI
            </a>
            <button
              onClick={() => {
                if (onExploreCustomerSearch) onExploreCustomerSearch();
                else navigate('/search');
              }}
              className="text-sm font-medium text-slate-600 hover:text-teal-600 flex items-center gap-1.5 transition-colors"
            >
              <Search className="w-4 h-4 text-teal-600" />
              Find Medicine
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/pharmacist/login')}
              className="border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold"
            >
              Pharmacist Login
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/pharmacist/register')}
              icon={ArrowRight}
              className="shadow-glow font-semibold"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileNavOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-6 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
            <div className="space-y-3">
              <a
                href="#features"
                onClick={() => setMobileNavOpen(false)}
                className="block text-base font-semibold text-slate-800 hover:text-blue-600"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileNavOpen(false)}
                className="block text-base font-semibold text-slate-800 hover:text-blue-600"
              >
                How It Works
              </a>
              <a
                href="#ai-showcase"
                onClick={() => setMobileNavOpen(false)}
                className="block text-base font-semibold text-slate-800 hover:text-blue-600"
              >
                Vision AI Showcase
              </a>
              <button
                onClick={() => {
                  setMobileNavOpen(false);
                  if (onExploreCustomerSearch) onExploreCustomerSearch();
                  else navigate('/search');
                }}
                className="w-full text-left text-base font-semibold text-teal-700 flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Find Medicine Nearby
              </button>
            </div>
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
              <Button
                variant="outline"
                onClick={() => {
                  setMobileNavOpen(false);
                  navigate('/pharmacist/login');
                }}
              >
                Pharmacist Login
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setMobileNavOpen(false);
                  navigate('/pharmacist/register');
                }}
              >
                Register Pharmacy Free
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32 bg-gradient-to-b from-blue-50/50 via-slate-50 to-white">
        {/* Subtle decorative glow spots */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-400/15 to-teal-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-24 right-10 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Hero Text Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Product Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold shadow-sm">
                <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
                <span>Next-Gen Pharmacy SaaS & Vision AI</span>
              </div>

              {/* Primary Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Smarter medicine <br />
                <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-teal-600 bg-clip-text text-transparent">
                  inventory management
                </span>
              </h1>

              {/* Supporting Text */}
              <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Recognize medicines with AI, manage pharmacy inventory intelligently, monitor expiry dates, and help customers find medicines nearby in real time.
              </p>

              {/* Primary Call To Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    if (onExploreCustomerSearch) onExploreCustomerSearch();
                    else navigate('/search');
                  }}
                  icon={Search}
                  className="w-full sm:w-auto shadow-glow font-bold text-base px-7"
                >
                  Find a Medicine
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/pharmacist/register')}
                  icon={Building2}
                  className="w-full sm:w-auto bg-white hover:bg-slate-50 border-slate-300 text-slate-800 font-bold text-base px-7"
                >
                  For Pharmacies
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
                {trustBadges.map((badge, idx) => {
                  const Icon = badge.icon;
                  return (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-sm flex-shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700 leading-tight">
                        {badge.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Hero Visual: Conceptual Workflow Diagram (No Fake Medicine Data) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Process Architecture Diagram */}
                <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />
                  
                  {/* Window Bar */}
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-slate-700" />
                      <div className="w-3 h-3 rounded-full bg-slate-700" />
                      <div className="w-3 h-3 rounded-full bg-slate-700" />
                    </div>
                    <span className="text-[11px] text-teal-400 font-mono bg-teal-950/60 px-2.5 py-1 rounded-full border border-teal-800/60">
                      Process Workflow Architecture
                    </span>
                  </div>

                  {/* Pipeline Steps */}
                  <div className="space-y-3 relative z-10 text-xs">
                    <div className="bg-slate-800/90 rounded-2xl p-3.5 border border-slate-700/80 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold flex-shrink-0">
                        1
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-white text-xs">Image Upload & Compression</p>
                        <p className="text-[11px] text-slate-400">Client-side validation and canvas downscaling</p>
                      </div>
                    </div>

                    <div className="bg-slate-800/90 rounded-2xl p-3.5 border border-slate-700/80 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold flex-shrink-0">
                        2
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-white text-xs">Neural OCR Extraction</p>
                        <p className="text-[11px] text-slate-400">Extracts brand, API salt, batch number, and expiry date</p>
                      </div>
                    </div>

                    <div className="bg-slate-800/90 rounded-2xl p-3.5 border border-slate-700/80 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold flex-shrink-0">
                        3
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-white text-xs">Pharmacist Review</p>
                        <p className="text-[11px] text-slate-400">Mandatory verification and editing before saving</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-900/40 to-teal-900/40 p-3.5 rounded-2xl border border-blue-700/30 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Clock className="w-5 h-5 text-teal-400 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-white">Automated FEFO Indexing</p>
                          <p className="text-[11px] text-slate-400">Stock queued by expiration timeline</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-teal-300 bg-teal-900/60 px-2 py-0.5 rounded-md border border-teal-700/50">
                        Active
                      </span>
                    </div>
                  </div>
                </div>

                {/* Explanatory Pill */}
                <div className="mt-3 text-center">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Illustrative process diagram • All stock data is loaded from your database
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="py-24 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-blue-600">
              Enterprise Healthcare Grade
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Designed for modern pharmacy precision
            </h3>
            <p className="text-base sm:text-lg text-slate-600">
              Everything pharmacists need to streamline medicine inventory, minimize stock expiration losses, and serve patients faster.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-50/80 hover:bg-white rounded-3xl p-8 border border-slate-200/80 hover:border-blue-200 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-blue-100/60 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 flex items-center justify-center shadow-sm">
                        <Icon className="w-6 h-6" />
                      </div>
                      <Badge variant="default" size="sm" className="font-semibold">
                        {feat.tag}
                      </Badge>
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                      {feat.title}
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-teal-600">
              End-to-End Workflow
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              From strip packaging to dispensed sale in four steps
            </h3>
            <p className="text-base sm:text-lg text-slate-600">
              Eliminate manual data entry errors. Keep inventory up-to-date with minimal friction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((step, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft relative flex flex-col justify-between"
              >
                <div>
                  <span className="text-3xl font-black text-blue-100 group-hover:text-blue-600 transition-colors">
                    {step.step}
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 mt-2 mb-2 tracking-tight">
                    {step.title}
                  </h4>
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs font-medium text-slate-500 italic">
                    {step.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision AI Showcase Section */}
      <section id="ai-showcase" className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Multi-Modal Medicine Extraction</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Designed to handle complex real-world medicine strips
              </h3>
              <p className="text-base text-slate-300 leading-relaxed">
                Indian and international pharmaceutical strips frequently print critical batch and expiration information on reflective foils, tiny fonts, or embossed backgrounds.
              </p>

              <div className="space-y-3.5">
                {[
                  'Automatic extraction of Brand Name & Active Generic Salts',
                  'Batch number and Manufacturer Identification',
                  'Flexible expiration handling (YYYY-MM-DD, MM/YY, or Month/Year)',
                  'Packaging strip ratio configuration (e.g. 1 strip = 15 capsules)',
                  'Pharmacist review & editing screen before any inventory commitment',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-sm text-slate-200 font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Button
                  variant="teal"
                  size="md"
                  onClick={() => navigate('/pharmacist/register')}
                  icon={ArrowRight}
                  className="font-bold shadow-glow-teal"
                >
                  Try AI Scanner in Portal
                </Button>
              </div>
            </div>

            {/* Showcase Visual: Extraction Schema & Safety Controls */}
            <div className="lg:col-span-6">
              <div className="bg-slate-800/80 rounded-3xl p-6 border border-slate-700 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                  <span className="text-xs font-bold text-slate-300 tracking-wider uppercase">Extracted Schema Fields</span>
                  <span className="text-[11px] text-teal-400 font-mono">Backend Vision Parser</span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700/60 flex justify-between items-center">
                    <span className="text-slate-400 font-sans">Commercial Brand:</span>
                    <span className="text-teal-400 font-semibold">medicine_name</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700/60 flex justify-between items-center">
                    <span className="text-slate-400 font-sans">Active Composition:</span>
                    <span className="text-teal-400 font-semibold">generic_name & strength</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700/60 flex justify-between items-center">
                    <span className="text-slate-400 font-sans">Traceability:</span>
                    <span className="text-emerald-400 font-semibold">batch_number & manufacturer</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700/60 flex justify-between items-center">
                    <span className="text-slate-400 font-sans">Timeline & Unit:</span>
                    <span className="text-blue-400 font-semibold">expiry_date & pieces_per_strip</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/40 text-[11px] text-blue-300 flex items-center gap-2">
                  <Lock className="w-4 h-4 flex-shrink-0 text-blue-400" />
                  <span>Human-in-the-loop: Pharmacists review every field before committing to database.</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Customer Radar Callout Banner */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-blue-700 to-teal-600 text-white relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Badge variant="teal" size="md" className="bg-white/10 text-white border-white/20">
            For Patients & Caregivers
          </Badge>
          <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Need to locate a specific medicine right now?
          </h3>
          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Search genuine medicine inventory across nearby pharmacies with live distance calculations and contact details. No login required.
          </p>
          <div className="pt-2">
            <Button
              variant="dark"
              size="lg"
              onClick={() => {
                if (onExploreCustomerSearch) onExploreCustomerSearch();
                else navigate('/search');
              }}
              icon={Search}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-xl px-8"
            >
              Open Medicine Radar
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  🛡️
                </div>
                <span className="font-extrabold text-white text-lg tracking-tight">MedGuard AI</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Smarter medicine inventory intelligence, FEFO expiry management, and community medicine discovery.
              </p>
              <div className="flex items-center gap-2 text-xs text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Backend API Live & Operational</span>
              </div>
            </div>

            <div>
              <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Pharmacist Portal</h5>
              <ul className="space-y-2.5 text-xs">
                <li><button onClick={() => navigate('/pharmacist/login')} className="hover:text-white transition-colors">Sign In</button></li>
                <li><button onClick={() => navigate('/pharmacist/register')} className="hover:text-white transition-colors">Register Pharmacy</button></li>
                <li><button onClick={() => navigate('/pharmacist/dashboard')} className="hover:text-white transition-colors">Dashboard</button></li>
                <li><button onClick={() => navigate('/pharmacist/pos')} className="hover:text-white transition-colors">Point of Sale (POS)</button></li>
              </ul>
            </div>

            <div>
              <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Public Discovery</h5>
              <ul className="space-y-2.5 text-xs">
                <li><button onClick={() => { if (onExploreCustomerSearch) onExploreCustomerSearch(); else navigate('/search'); }} className="hover:text-white transition-colors">Find Medicine</button></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#ai-showcase" className="hover:text-white transition-colors">Vision AI Model</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Security & Trust</h5>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                All pharmacist transactions, stock movements, and customer queries are handled securely with Neon PostgreSQL encryption.
              </p>
              <p className="text-[11px] text-slate-500">
                © {new Date().getFullYear()} MedGuard AI. All rights reserved.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
            MedGuard AI — Built for Healthcare Accuracy, Compliance & Zero Stock Wastage.
          </div>
        </div>
      </footer>
    </div>
  );
};
