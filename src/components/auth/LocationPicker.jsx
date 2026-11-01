import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Info,
  Loader2,
  X
} from 'lucide-react';

const COMMON_METRO_HUBS = [
  { city: 'Hyderabad', area: 'Hitec City', lat: 17.4435, lng: 78.3772 },
  { city: 'Hyderabad', area: 'Secunderabad', lat: 17.4399, lng: 78.4983 },
  { city: 'Bengaluru', area: 'Indiranagar', lat: 12.9719, lng: 77.6412 },
  { city: 'Bengaluru', area: 'Koramangala', lat: 12.9352, lng: 77.6245 },
  { city: 'Visakhapatnam', area: 'Dwaraka Nagar', lat: 17.7286, lng: 83.3188 },
  { city: 'Mumbai', area: 'Bandra West', lat: 19.0596, lng: 72.8295 },
  { city: 'Delhi', area: 'Connaught Place', lat: 28.6304, lng: 77.2177 },
  { city: 'Chennai', area: 'T. Nagar', lat: 13.0418, lng: 80.2341 },
];

export const LocationPicker = ({ 
  initialLat = null, 
  initialLng = null, 
  onLocationConfirmed, 
  isConfirmed = false, 
  setIsConfirmed,
  addressHint = ''
}) => {
  const [lat, setLat] = useState(initialLat);
  const [lng, setLng] = useState(initialLng);
  const [manualLatStr, setManualLatStr] = useState(initialLat !== null ? String(initialLat) : '');
  const [manualLngStr, setManualLngStr] = useState(initialLng !== null ? String(initialLng) : '');

  const [locating, setLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState(initialLat && initialLng ? 'manual' : null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [hubNotice, setHubNotice] = useState(null);
  const [geocodedNotice, setGeocodedNotice] = useState(null);

  // Address search & geocoding state
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Update if initial coordinates change externally
  useEffect(() => {
    if (initialLat !== null && initialLng !== null) {
      setLat(initialLat);
      setLng(initialLng);
      setManualLatStr(String(initialLat));
      setManualLngStr(String(initialLng));
    }
  }, [initialLat, initialLng]);

  // Scenario A, B, C: Handle browser GPS detection
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser. Please search your pharmacy address below.');
      setLocationStatus('gps_unavailable');
      return;
    }

    setLocating(true);
    setErrorMessage(null);
    setSearchResults([]);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // SCENARIO A: GPS Permission Granted
        const detectedLat = Math.round(pos.coords.latitude * 1000000) / 1000000;
        const detectedLng = Math.round(pos.coords.longitude * 1000000) / 1000000;

        setLat(detectedLat);
        setLng(detectedLng);
        setManualLatStr(String(detectedLat));
        setManualLngStr(String(detectedLng));
        setLocating(false);
        setLocationStatus('gps_granted');
        setHubNotice(null);
        setGeocodedNotice(null);
        // Unconfirm so pharmacist explicitly reviews the detected GPS pin before locking
        if (setIsConfirmed) setIsConfirmed(false);
      },
      (err) => {
        setLocating(false);
        setHubNotice(null);
        setGeocodedNotice(null);
        // SCENARIOS B & C: GPS Denied, Unavailable or Timeout
        // NEVER assign default coordinates!
        if (err.code === 1) { // PERMISSION_DENIED
          setLocationStatus('gps_denied');
          setErrorMessage('Location permission was denied in your browser. Please search your pharmacy address or select your city hub below.');
        } else if (err.code === 3) { // TIMEOUT
          setLocationStatus('gps_timeout');
          setErrorMessage('GPS request timed out. Please search your pharmacy address or enter coordinates manually.');
        } else { // POSITION_UNAVAILABLE
          setLocationStatus('gps_unavailable');
          setErrorMessage('Device GPS signal is unavailable. Please search your pharmacy address or choose a city below.');
        }
        // Do NOT assign arbitrary coordinates or auto-confirm!
        if (setIsConfirmed) setIsConfirmed(false);
      },
      { timeout: 10000, enableHighAccuracy: true, maximumAge: 0 }
    );
  };

  // Scenario D: Search place via OpenStreetMap Nominatim Geocoding
  const handleSearchAddress = async (e) => {
    e?.preventDefault();
    const query = searchQuery.trim() || addressHint.trim();
    if (!query) {
      setErrorMessage('Please type a city, area or street address to search.');
      return;
    }

    setSearching(true);
    setErrorMessage(null);
    setSearchResults([]);

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`;
      const res = await fetch(url, {
        headers: { 'Accept': 'application/json' }
      });

      if (!res.ok) throw new Error('Geocoding service unavailable');
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        setSearchResults(data);
        setShowDropdown(true);
      } else {
        setErrorMessage(`No matching location found for "${query}". Try searching by city or major landmark.`);
      }
    } catch (err) {
      setErrorMessage('Could not connect to geocoding service. Please select a city hub or enter coordinates manually.');
    } finally {
      setSearching(false);
    }
  };

  const handleSelectSearchResult = (item) => {
    const newLat = Math.round(parseFloat(item.lat) * 1000000) / 1000000;
    const newLng = Math.round(parseFloat(item.lon) * 1000000) / 1000000;

    setLat(newLat);
    setLng(newLng);
    setManualLatStr(String(newLat));
    setManualLngStr(String(newLng));
    setLocationStatus('geocoded');
    if (setIsConfirmed) setIsConfirmed(false);
    setShowDropdown(false);
    setSearchQuery(item.display_name.split(',').slice(0, 3).join(','));
    setErrorMessage(null);
    setHubNotice(null);
    setGeocodedNotice(`Geocoded coordinates loaded for "${item.display_name.split(',')[0]}": ${newLat}, ${newLng}. Please inspect the map pin and click "Confirm Shop Location" below to lock.`);
  };

  const handleSelectHub = (hub) => {
    setLat(hub.lat);
    setLng(hub.lng);
    setManualLatStr(String(hub.lat));
    setManualLngStr(String(hub.lng));
    setLocationStatus('manual');
    if (setIsConfirmed) setIsConfirmed(false);
    setErrorMessage(null);
    setGeocodedNotice(null);
    setHubNotice(`Map centered on regional hub: ${hub.city} (${hub.area}). This regional hub anchor is NOT saved as your shop's exact location. Please adjust the pin or search your street address, then click "Confirm Shop Location".`);
  };

  // Click on interactive map canvas to drop or adjust pin
  const handleMapClick = (e) => {
    const currentLat = lat !== null ? lat : 17.3850; // default view anchor if none set
    const currentLng = lng !== null ? lng : 78.4867;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xRatio = (x / rect.width) - 0.5;
    const yRatio = (y / rect.height) - 0.5;

    const newLat = Math.round((currentLat - yRatio * 0.04) * 1000000) / 1000000;
    const newLng = Math.round((currentLng + xRatio * 0.04) * 1000000) / 1000000;

    setLat(newLat);
    setLng(newLng);
    setManualLatStr(String(newLat));
    setManualLngStr(String(newLng));
    setLocationStatus('manual');
    if (setIsConfirmed) setIsConfirmed(false);
    setErrorMessage(null);
    setHubNotice(null);
  };

  // Nudge adjustment controls (~100m)
  const handleNudge = (dLat, dLng) => {
    if (lat === null || lng === null) {
      setErrorMessage('Please detect GPS or pick a city before nudging.');
      return;
    }
    const newLat = Math.round((lat + dLat) * 1000000) / 1000000;
    const newLng = Math.round((lng + dLng) * 1000000) / 1000000;
    setLat(newLat);
    setLng(newLng);
    setManualLatStr(String(newLat));
    setManualLngStr(String(newLng));
    if (setIsConfirmed) setIsConfirmed(false);
    setHubNotice(null);
  };

  // Direct numeric input change
  const handleManualCoordChange = (type, val) => {
    if (type === 'lat') {
      setManualLatStr(val);
      const parsed = parseFloat(val);
      if (!isNaN(parsed)) setLat(parsed);
      else setLat(null);
    } else {
      setManualLngStr(val);
      const parsed = parseFloat(val);
      if (!isNaN(parsed)) setLng(parsed);
      else setLng(null);
    }
    if (setIsConfirmed) setIsConfirmed(false);
    setHubNotice(null);
  };

  // Explicit confirmation button handler
  const handleConfirm = () => {
    setErrorMessage(null);

    if (lat === null || lng === null || isNaN(lat) || isNaN(lng)) {
      setErrorMessage('Please select your pharmacy location using GPS, address search, or coordinates.');
      return;
    }

    if (lat < -90 || lat > 90) {
      setErrorMessage('Invalid Latitude: Must be between -90.0 and 90.0 degrees.');
      return;
    }

    if (lng < -180 || lng > 180) {
      setErrorMessage('Invalid Longitude: Must be between -180.0 and 180.0 degrees.');
      return;
    }

    if (setIsConfirmed) setIsConfirmed(true);
    setHubNotice(null);
    setGeocodedNotice(null);
    if (onLocationConfirmed) {
      onLocationConfirmed({
        latitude: lat,
        longitude: lng,
      });
    }
  };

  return (
    <div className="space-y-4 bg-slate-50 border border-slate-200 rounded-2xl p-5 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-rose-500" />
            <span>Step 3 — Physical Pharmacy GPS Location *</span>
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Patients and nearby customers use this exact location to find your stock and get driving directions.
          </p>
        </div>

        {isConfirmed && lat !== null && lng !== null ? (
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Location Confirmed</span>
          </span>
        ) : (
          <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            <span>Confirmation Required</span>
          </span>
        )}
      </div>

      {/* Alert Messages */}
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3.5 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {locationStatus === 'gps_denied' && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs p-3.5 rounded-xl space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Browser GPS Permission Denied</span>
          </p>
          <p className="text-[11px] text-amber-800">
            No default coordinates were assigned. Please search your pharmacy address, pick your city hub, or enter latitude and longitude manually below.
          </p>
        </div>
      )}

      {locationStatus === 'gps_granted' && !isConfirmed && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 text-xs p-3 rounded-xl flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span>
            Device GPS coordinates retrieved ({lat?.toFixed(5)}, {lng?.toFixed(5)}). Please review the map pin and click <strong>Confirm Shop Location</strong> below.
          </span>
        </div>
      )}

      {hubNotice && !isConfirmed && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs p-3 rounded-xl flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Regional City Hub Centered</p>
            <p className="text-[11px] text-amber-800 mt-0.5">{hubNotice}</p>
          </div>
        </div>
      )}

      {geocodedNotice && !isConfirmed && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 text-xs p-3 rounded-xl flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Address Geocoded</p>
            <p className="text-[11px] text-blue-800 mt-0.5">{geocodedNotice}</p>
          </div>
        </div>
      )}

      {/* Primary Action Buttons: GPS & Manual Search */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={locating}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all shadow-sm"
          >
            {locating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Requesting Device GPS...</span>
              </>
            ) : (
              <>
                <Navigation className="w-3.5 h-3.5" />
                <span>Use Current Device GPS</span>
              </>
            )}
          </button>

          <span className="text-[11px] text-slate-400 font-medium">or search address below:</span>
        </div>

        {/* Address Search Bar */}
        <div className="relative">
          <form onSubmit={handleSearchAddress} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={addressHint ? `Search "${addressHint.slice(0, 35)}..."` : "Search city, street or area (e.g. Hitec City, Hyderabad)..."}
                className="w-full pl-9 pr-8 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={searching}
              className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              {searching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              <span>Search Place</span>
            </button>
          </form>

          {/* Autocomplete Results Dropdown */}
          {showDropdown && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-30 max-h-48 overflow-y-auto divide-y divide-slate-100 text-xs">
              {searchResults.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSearchResult(item)}
                  className="w-full text-left p-2.5 hover:bg-blue-50 transition-colors flex items-start gap-2"
                >
                  <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-800 line-clamp-1">{item.display_name.split(',')[0]}</p>
                    <p className="text-[10px] text-slate-500 line-clamp-1">{item.display_name}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick City Hub Anchors */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] text-slate-400 font-medium">Or center pin on a major city:</span>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_METRO_HUBS.map((hub, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectHub(hub)}
                className={`px-2.5 py-1 text-[11px] font-semibold border rounded-lg transition-colors cursor-pointer ${
                  lat === hub.lat && lng === hub.lng
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                {hub.city} ({hub.area})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Map Visualizer Canvas */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <span>Click on the map to reposition pin:</span>
          <span>
            Coordinates: {lat !== null && lng !== null ? (
              <strong className="font-mono text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                {lat.toFixed(6)}, {lng.toFixed(6)}
              </strong>
            ) : (
              <span className="text-rose-600 font-semibold">Not Set</span>
            )}
          </span>
        </div>

        <div
          onClick={handleMapClick}
          className="relative h-56 w-full rounded-2xl overflow-hidden cursor-crosshair border-2 border-slate-300 shadow-inner bg-slate-900 group select-none"
          title="Click to reposition pharmacy pin"
        >
          {/* Faux Map Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none" 
            style={{
              backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px), linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)`,
              backgroundSize: `24px 24px, 48px 48px, 48px 48px`
            }} 
          />

          {/* Map Landmarks Visuals */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-40 h-40 rounded-full border border-blue-500/20 bg-blue-500/5 animate-pulse" />
          </div>

          <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${lat !== null ? 'bg-emerald-400' : 'bg-rose-400'}`} />
            <span>{lat !== null ? 'Interactive Map Canvas' : 'Click to Set Initial Pin'}</span>
          </div>

          {/* Centered Target Pin */}
          {lat !== null && lng !== null ? (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full pointer-events-none flex flex-col items-center">
              <div className={`px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-md mb-1 whitespace-nowrap ${
                isConfirmed ? 'bg-emerald-600' : 'bg-amber-600 animate-pulse'
              }`}>
                {isConfirmed ? '✓ Pharmacy Confirmed' : '📍 Unconfirmed Pin'}
              </div>
              <MapPin className={`w-8 h-8 drop-shadow-lg ${isConfirmed ? 'text-emerald-400' : 'text-amber-400'}`} />
              <div className="w-2.5 h-1 bg-black/60 rounded-full blur-[1px] mt-[-2px]" />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-slate-800/90 text-slate-300 border border-slate-700 px-4 py-2 rounded-xl text-xs text-center space-y-0.5">
                <p className="font-bold text-white">No Coordinates Selected</p>
                <p className="text-[10px] text-slate-400">Click anywhere on the map or use GPS / Place Search above</p>
              </div>
            </div>
          )}

          <div className="absolute bottom-2 right-2 bg-slate-900/90 text-slate-300 text-[10px] px-2 py-0.5 rounded font-mono border border-slate-700">
            Click anywhere to move pin
          </div>
        </div>
      </div>

      {/* Direct Coordinate Inputs & Nudge Pad */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center pt-1">
        {/* Direct Latitude & Longitude Inputs */}
        <div className="md:col-span-7 grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
              Latitude (-90 to 90) *
            </label>
            <input
              type="text"
              value={manualLatStr}
              onChange={(e) => handleManualCoordChange('lat', e.target.value)}
              placeholder="e.g. 17.4435"
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl font-mono text-xs text-slate-800 font-bold focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
              Longitude (-180 to 180) *
            </label>
            <input
              type="text"
              value={manualLngStr}
              onChange={(e) => handleManualCoordChange('lng', e.target.value)}
              placeholder="e.g. 78.3772"
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl font-mono text-xs text-slate-800 font-bold focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Nudge Adjust Pad */}
        <div className="md:col-span-5 flex items-center justify-end gap-1.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mr-1">Fine Nudge:</span>
          <button
            type="button"
            onClick={() => handleNudge(0, -0.001)}
            disabled={lat === null}
            className="p-1.5 bg-white hover:bg-slate-100 disabled:opacity-40 border border-slate-200 rounded-lg text-slate-600"
            title="Nudge West (~100m)"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => handleNudge(0.001, 0)}
              disabled={lat === null}
              className="p-1.5 bg-white hover:bg-slate-100 disabled:opacity-40 border border-slate-200 rounded-lg text-slate-600"
              title="Nudge North (~100m)"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleNudge(-0.001, 0)}
              disabled={lat === null}
              className="p-1.5 bg-white hover:bg-slate-100 disabled:opacity-40 border border-slate-200 rounded-lg text-slate-600"
              title="Nudge South (~100m)"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => handleNudge(0, 0.001)}
            disabled={lat === null}
            className="p-1.5 bg-white hover:bg-slate-100 disabled:opacity-40 border border-slate-200 rounded-lg text-slate-600"
            title="Nudge East (~100m)"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Explicit Confirmation Bar */}
      <div className="pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-slate-200">
        <div className="text-xs">
          {isConfirmed && lat !== null && lng !== null ? (
            <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Location locked: {lat.toFixed(5)}, {lng.toFixed(5)}</span>
            </span>
          ) : (
            <span className="text-amber-700 font-medium flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span>{lat !== null ? 'Pin placed. Click confirm to lock coordinates.' : 'No coordinates selected yet.'}</span>
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleConfirm}
          className={`w-full sm:w-auto text-xs font-bold py-2.5 px-5 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm ${
            isConfirmed && lat !== null
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-slate-900 hover:bg-slate-800 text-white'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{isConfirmed ? 'Re-Confirm Location' : 'Confirm Shop Location'}</span>
        </button>
      </div>
    </div>
  );
};
