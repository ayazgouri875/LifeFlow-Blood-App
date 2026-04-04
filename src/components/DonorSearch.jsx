import React, { useState, useEffect } from 'react';
import { 
  Search, MapPin, Filter, Phone, 
  Navigation, XCircle, HeartHandshake, 
  MessageCircle 
} from 'lucide-react';
import { db } from '../firebase'; 
import { collection, query, where, getDocs } from 'firebase/firestore';

const DonorSearch = ({ autoLocation, setAutoLocation }) => {
  const [donors, setDonors] = useState([]);
  const [bloodGroup, setBloodGroup] = useState('');
  const [location, setLocation] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  // Automatic Trigger: When App.jsx detects "Nearby" via Hero Button
  useEffect(() => {
    if (autoLocation) {
      handleSearch(true);
    }
  }, [autoLocation]);

  const handleSearch = async (isNearby = false) => {
    setLoading(true);
    setHasSearched(true);
    
    try {
      const donorsRef = collection(db, "donors");
      let q = query(donorsRef);
      
      if (bloodGroup) {
        q = query(donorsRef, where("bloodGroup", "==", bloodGroup));
      }

      const querySnapshot = await getDocs(q);
      let results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (isNearby && autoLocation) {
        results = results.filter(d => {
          if (!d.lat || !d.lng) return false;
          const dist = Math.sqrt(
            Math.pow(d.lat - autoLocation.lat, 2) + 
            Math.pow(d.lng - autoLocation.lng, 2)
          );
          return dist < 0.25; 
        });
      } else if (location) {
        results = results.filter(d => 
          (d.location || "").toLowerCase().includes(location.toLowerCase().trim())
        );
      }

      setDonors(results);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setDonors([]);
    setBloodGroup('');
    setLocation('');
    setAutoLocation(null);
    setHasSearched(false);
  };

  // 🛠️ Helper function to clean phone numbers for WhatsApp
  const cleanPhone = (num) => num.replace(/\D/g, '');

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Search Bar Section */}
      <div className="bg-white p-4 rounded-3xl shadow-xl shadow-gray-200 border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-2xl w-full md:w-1/4 border border-transparent focus-within:border-red-200 transition">
          <Filter className="text-red-600" size={20} />
          <select 
            className="bg-transparent w-full outline-none font-semibold text-gray-700" 
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
          >
            <option value="">Blood Group</option>
            <option>A+</option><option>B+</option><option>O+</option><option>AB+</option>
            <option>A-</option><option>B-</option><option>O-</option><option>AB-</option>
          </select>
        </div>

        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-2xl w-full md:w-2/4 border border-transparent focus-within:border-red-200 transition">
          <MapPin className="text-red-600" size={20} />
          <input 
            type="text" placeholder="Enter city (e.g. Pune)..." 
            className="bg-transparent w-full outline-none font-medium text-gray-700"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <button 
          onClick={() => handleSearch(false)}
          className="w-full md:w-1/4 bg-red-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition shadow-lg shadow-red-100 active:scale-95"
        >
          <Search size={20} />
          Search Donors
        </button>
      </div>

      {/* Results Header / Clear Button */}
      {hasSearched && (
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {autoLocation ? (
              <span className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-4 py-2 rounded-full text-xs border border-green-100 animate-in fade-in">
                <Navigation size={14} fill="currentColor" /> Live Nearby Mode
              </span>
            ) : (
              <span className="text-gray-500 font-bold text-sm bg-gray-100 px-4 py-1.5 rounded-full uppercase tracking-tight">
                {donors.length} Donors Found
              </span>
            )}
          </div>
          <button 
            onClick={clearFilters} 
            className="text-gray-400 hover:text-red-600 text-sm font-bold flex items-center gap-1 transition"
          >
            <XCircle size={18} /> Clear Search
          </button>
        </div>
      )}

      {/* Result Cards Grid */}
      <div className="mt-10">
        {!hasSearched ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
            <HeartHandshake className="mx-auto text-red-100 mb-4" size={64} />
            <p className="text-gray-400 font-medium text-lg">Enter a city or use GPS to find local heroes.</p>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="h-48 bg-gray-100 rounded-2xl"></div>)}
          </div>
        ) : donors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
            {donors.map((donor) => (
              <div key={donor.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition group">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-red-600 transition">{donor.name}</h3>
                    <p className="text-gray-500 text-sm flex items-center gap-1">
                      <MapPin size={14} /> {donor.location}
                    </p>
                  </div>
                  <span className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-black text-xl border border-red-100">
                    {donor.bloodGroup}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  {/* Call Button */}
                  <a 
                    href={`tel:${donor.phone}`} 
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition text-sm"
                  >
                    <Phone size={16} /> Call
                  </a>

                  {/* 📍 Corrected WhatsApp Button */}
                  <a 
                    href={`https://api.whatsapp.com/send?phone=${cleanPhone(donor.phone)}&text=${encodeURIComponent(`EMERGENCY: Blood needed for ${donor.bloodGroup} in ${donor.location}. Can you help?`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition text-sm"
                  >
                    <MessageCircle size={16} /> WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-red-50/20 rounded-3xl border border-red-100">
            <p className="text-red-600 font-bold text-xl mb-1">No matches found.</p>
            <p className="text-red-400 text-sm">Try broadening your search or blood group.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorSearch;