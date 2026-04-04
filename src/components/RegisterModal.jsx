import React, { useState } from 'react';
import { X } from 'lucide-react';
import { db } from '../firebase'; 
import { collection, addDoc } from 'firebase/firestore'; 

const RegisterModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    bloodGroup: '',
    phone: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await addDoc(collection(db, "donors"), {
            ...formData,
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            createdAt: new Date()
          });
          alert("Hero Registered Successfully!");
          setLoading(false);
          onClose();
        } catch (error) {
          alert("Error saving data.");
          setLoading(false);
        }
      },
      () => {
        alert("Please enable location to register.");
        setLoading(false);
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full text-gray-400"><X size={24} /></button>
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Become a Donor</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input type="text" required placeholder="Full Name" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-600" onChange={(e) => setFormData({...formData, name: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
              <select className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}>
                <option>A+</option><option>B+</option><option>O+</option><option>AB+</option>
                <option>A-</option><option>B-</option><option>O-</option><option>AB-</option>
              </select>
              {/* 📍 Added maxLength and pattern for clean 10-digit numbers */}
              <input 
                type="tel" required placeholder="10-Digit Phone" 
                maxLength="10" pattern="[0-9]{10}"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" 
                onChange={(e) => setFormData({...formData, phone: e.target.value})} 
              />
            </div>
            <input type="text" required placeholder="City (e.g. Pune)" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" onChange={(e) => setFormData({...formData, location: e.target.value})} />
            <button type="submit" disabled={loading} className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition disabled:bg-gray-400">
              {loading ? "Saving..." : "Complete Registration"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;