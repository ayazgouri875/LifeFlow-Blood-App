import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { db } from '../firebase'; 
import { collection, addDoc } from 'firebase/firestore'; 

const PostRequestModal = ({ isOpen, onClose }) => {
  const [requestData, setRequestData] = useState({
    hospital: '',
    bloodGroup: 'B+',
    units: '1',
    location: 'Pune',
    contact: ''
  });
  const [loading, setLoading] = useState(false);

  const handlePost = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "requests"), {
        ...requestData,
        createdAt: new Date(),
        status: 'open'
      });
      alert("Emergency request posted to the live feed!");
      onClose();
    } catch (error) {
      alert("Error posting request.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:bg-gray-100 rounded-full"><X /></button>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <AlertCircle className="text-red-600" /> Post Emergency
        </h2>
        <p className="text-gray-500 text-sm mb-6">This will alert all matching donors in your city.</p>

        <form onSubmit={handlePost} className="space-y-4">
          <input type="text" required placeholder="Hospital Name (e.g. Ruby Hall)" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-600" onChange={(e) => setRequestData({...requestData, hospital: e.target.value})} />
          
          <div className="grid grid-cols-2 gap-4">
            <select className="w-full px-4 py-3 rounded-xl border border-gray-100" onChange={(e) => setRequestData({...requestData, bloodGroup: e.target.value})}>
              <option>A+</option><option>B+</option><option>O+</option><option>AB+</option>
              <option>A-</option><option>B-</option><option>O-</option><option>AB-</option>
            </select>
            <input type="number" required placeholder="Units Needed" className="w-full px-4 py-3 rounded-xl border border-gray-200" onChange={(e) => setRequestData({...requestData, units: e.target.value})} />
          </div>

          <input type="text" required placeholder="City" className="w-full px-4 py-3 rounded-xl border border-gray-200" onChange={(e) => setRequestData({...requestData, location: e.target.value})} />
          <input type="tel" required placeholder="Contact Number" className="w-full px-4 py-3 rounded-xl border border-gray-200" onChange={(e) => setRequestData({...requestData, contact: e.target.value})} />

          <button type="submit" disabled={loading} className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition">
            {loading ? "Posting..." : "Broadcast Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostRequestModal;