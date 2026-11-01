import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { usePharmacy } from '../../context/PharmacyContext';
import { LocationPicker } from './LocationPicker';
import { 
  Building2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  AlertTriangle 
} from 'lucide-react';

const checkCityCoordinateConsistency = (cityStr, latVal, lngVal) => {
  if (!cityStr || latVal === null || lngVal === null) return null;
  const c = cityStr.trim().toLowerCase();

  // Hyderabad: roughly lat 16.5 - 18.0, lng 77.8 - 79.2
  if (c.includes('hyderabad') || c.includes('secunderabad')) {
    if (latVal < 16.5 || latVal > 18.2 || lngVal < 77.5 || lngVal > 79.5) {
      return `Your address specifies "${cityStr}", but the selected map coordinates (${latVal.toFixed(4)}, ${lngVal.toFixed(4)}) appear to be outside the Hyderabad region. Please position your map pin within your actual city.`;
    }
  }
  // Bengaluru: roughly lat 12.5 - 13.5, lng 77.0 - 78.2
  if (c.includes('bengaluru') || c.includes('bangalore')) {
    if (latVal < 12.5 || latVal > 13.5 || lngVal < 77.0 || lngVal > 78.2) {
      return `Your address specifies "${cityStr}", but the selected map coordinates (${latVal.toFixed(4)}, ${lngVal.toFixed(4)}) appear to be outside the Bengaluru region. Please position your map pin within your actual city.`;
    }
  }
  // Visakhapatnam: roughly lat 17.2 - 18.2, lng 82.8 - 83.8
  if (c.includes('visakhapatnam') || c.includes('vizag')) {
    if (latVal < 17.2 || latVal > 18.2 || lngVal < 82.8 || lngVal > 83.8) {
      return `Your address specifies "${cityStr}", but the selected map coordinates (${latVal.toFixed(4)}, ${lngVal.toFixed(4)}) appear to be outside the Visakhapatnam region.`;
    }
  }
  return null;
};

export const PharmacySetup = () => {
  const navigate = useNavigate();
  const { user, profile, pharmacy, setupPharmacy, isSetupComplete, isEmailVerified } = usePharmacy();

  // If already completed setup, redirect to dashboard
  if (isSetupComplete) {
    return <Navigate to="/pharmacist/dashboard" replace />;
  }

  // If not logged in at all, redirect to login
  if (!user && !profile) {
    return <Navigate to="/pharmacist/login" replace />;
  }

  // If email is not verified, redirect to login interface
  if (!isEmailVerified) {
    return <Navigate to="/pharmacist/login?unverified=true" replace />;
  }

  // Pharmacy Details State
  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [fullAddress, setFullAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');

  // Location State: Starts as NULL so no arbitrary city coordinates are silently used!
  const [latitude, setLatitude] = useState(pharmacy?.latitude ?? null);
  const [longitude, setLongitude] = useState(pharmacy?.longitude ?? null);
  const [isLocationConfirmed, setIsLocationConfirmed] = useState(!!pharmacy?.latitude);
  const [confirmedAddressSnapshot, setConfirmedAddressSnapshot] = useState(null);
  const [addressInvalidatedWarning, setAddressInvalidatedWarning] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [cityMismatchWarning, setCityMismatchWarning] = useState(null);

  useEffect(() => {
    if (profile?.full_name && !ownerName) setOwnerName(profile.full_name);
    if (profile?.phone && !phone) setPhone(profile.phone);
    if (user?.email && !email) setEmail(user.email);
  }, [profile, user]);

  // Check city consistency when city or coordinates change
  useEffect(() => {
    const warning = checkCityCoordinateConsistency(city, latitude, longitude);
    setCityMismatchWarning(warning);
  }, [city, latitude, longitude]);

  // Invalidate previous location confirmation if address details change after confirmation
  useEffect(() => {
    if (confirmedAddressSnapshot && isLocationConfirmed) {
      const isAddressChanged = 
        fullAddress.trim() !== confirmedAddressSnapshot.fullAddress ||
        city.trim() !== confirmedAddressSnapshot.city ||
        state.trim() !== confirmedAddressSnapshot.state ||
        pincode.trim() !== confirmedAddressSnapshot.pincode;

      if (isAddressChanged) {
        setIsLocationConfirmed(false);
        setLatitude(null);
        setLongitude(null);
        setAddressInvalidatedWarning(true);
      }
    }
  }, [fullAddress, city, state, pincode, confirmedAddressSnapshot, isLocationConfirmed]);

  const handleLocationConfirmed = (coords) => {
    setLatitude(coords.latitude);
    setLongitude(coords.longitude);
    setIsLocationConfirmed(true);
    setAddressInvalidatedWarning(false);
    setConfirmedAddressSnapshot({
      fullAddress: fullAddress.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    // Form validations
    if (!shopName.trim()) {
      setErrorMessage('Please provide the Pharmacy / Shop Trade Name.');
      return;
    }
    if (!ownerName.trim()) {
      setErrorMessage('Please provide the Owner / Pharmacist Name.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Please provide the Pharmacy contact phone number.');
      return;
    }
    if (!fullAddress.trim() || !city.trim() || !state.trim() || !pincode.trim()) {
      setErrorMessage('Please provide full address details including City, State, and Pincode.');
      return;
    }
    if (!licenseNumber.trim()) {
      setErrorMessage('Please provide the Drug License Number (e.g. DL-KA-2026-XXXX).');
      return;
    }

    // Strict Coordinate Validations
    if (latitude === null || longitude === null || isNaN(latitude) || isNaN(longitude)) {
      setErrorMessage('Please select and confirm your physical pharmacy coordinates on the map in Step 3 before saving.');
      return;
    }

    if (latitude < -90 || latitude > 90) {
      setErrorMessage('Invalid Latitude: Must be between -90.0 and 90.0 degrees.');
      return;
    }

    if (longitude < -180 || longitude > 180) {
      setErrorMessage('Invalid Longitude: Must be between -180.0 and 180.0 degrees.');
      return;
    }

    if (!isLocationConfirmed) {
      setErrorMessage('Please click "Confirm Shop Location" in Step 3 to explicitly lock your GPS coordinates.');
      return;
    }

    // Consistency check: block if city and coordinates mismatch severely
    const mismatch = checkCityCoordinateConsistency(city, latitude, longitude);
    if (mismatch) {
      setErrorMessage(mismatch);
      return;
    }

    setLoading(true);

    try {
      const res = await setupPharmacy({
        name: shopName.trim(),
        ownerName: ownerName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: `${fullAddress.trim()}, ${city.trim()}, ${state.trim()} - ${pincode.trim()}`,
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        licenseNumber: licenseNumber.trim(),
        latitude,
        longitude,
      });

      if (res?.success) {
        navigate('/pharmacist/dashboard', { replace: true });
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save pharmacy details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-2xl mx-auto w-full space-y-6">
        
        {/* Step Progress Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-blue-600 text-white items-center justify-center font-bold text-2xl shadow-xl shadow-blue-500/20 mb-1">
            🏥
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Pharmacy Setup & Physical Location
          </h1>
          <p className="text-xs text-slate-400">
            Account created for <strong>{profile?.full_name || user?.email}</strong>. Please complete shop details to activate your dashboard.
          </p>

          <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] font-semibold text-slate-400">
            <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>1. Account</span>
            </span>
            <span>→</span>
            <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">2. Pharmacy Details</span>
            <span>→</span>
            <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">3. Confirm Location</span>
            <span>→</span>
            <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">4. Dashboard</span>
          </div>
        </div>

        {errorMessage && (
          <div className="bg-rose-500/20 border border-rose-500/30 text-rose-200 text-xs p-3.5 rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {cityMismatchWarning && (
          <div className="bg-amber-500/20 border border-amber-500/30 text-amber-200 text-xs p-3.5 rounded-2xl flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">City & Map Pin Discrepancy</p>
              <p className="text-[11px] text-amber-100/90 mt-0.5">{cityMismatchWarning}</p>
            </div>
          </div>
        )}

        {addressInvalidatedWarning && (
          <div className="bg-rose-500/20 border border-rose-500/30 text-rose-200 text-xs p-3.5 rounded-2xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Address Modified — Location Re-Confirmation Required</p>
              <p className="text-[11px] text-rose-100/90 mt-0.5">
                You modified the pharmacy address fields after confirming your pin. To ensure address and GPS accuracy, the previous confirmation was invalidated. Please scroll to Step 3 and click <strong>Confirm Shop Location</strong> to lock the pin for the updated address.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 2: Shop Details Card */}
          <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-6 shadow-2xl text-white space-y-4">
            <div className="border-b border-slate-700 pb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />
                <span>Step 2 — Shop & License Details</span>
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                These details will appear on your customer tax invoices and public medicine discovery cards.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-medium text-slate-300 mb-1">
                  Shop / Pharmacy Trade Name *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="e.g. Care Pharmacy"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-xs text-white font-semibold placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Owner / Licensee Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Owner / Pharmacist Full Name"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Shop Contact Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-medium text-slate-300 mb-1">
                  Drug License Number *
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="e.g. 20B/21B DL-KA-2026-XXXX"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-medium text-slate-300 mb-1">
                  Street Address / Door No / Landmark *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullAddress}
                    onChange={(e) => setFullAddress(e.target.value)}
                    placeholder="Shop #12, Ground Floor, Main Road..."
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Hyderabad"
                  className="w-full px-3 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Telangana"
                  className="w-full px-3 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-medium text-slate-300 mb-1">
                  Pincode / Postal Code *
                </label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="e.g. 500081"
                  className="w-full px-3 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Interactive Location Confirmation Component */}
          <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-6 shadow-2xl text-white">
            <LocationPicker
              initialLat={latitude}
              initialLng={longitude}
              isConfirmed={isLocationConfirmed}
              setIsConfirmed={setIsLocationConfirmed}
              onLocationConfirmed={handleLocationConfirmed}
              addressHint={`${fullAddress} ${city} ${state} ${pincode}`.trim()}
            />
          </div>

          {/* Step 4: Submission */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <p className="text-xs text-slate-400">
              Only licensed pharmacists have access to inventory and billing for this pharmacy.
            </p>

            <button
              type="submit"
              disabled={loading || !isLocationConfirmed || latitude === null}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{loading ? 'Saving Pharmacy...' : 'Save Pharmacy & Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
