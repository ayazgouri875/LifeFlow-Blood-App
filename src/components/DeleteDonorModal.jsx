import React, { useState } from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';

const DeleteDonorModal = ({ isOpen, onClose }) => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const donorsRef = collection(db, "donors");
      const q = query(donorsRef, where("phone", "==", phone));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("No donor found with this phone number.");
      } else {
        // Delete the found document(s)
        const deletePromises = querySnapshot.docs.map((document) => 
          deleteDoc(doc(db, "donors", document.id))
        );
        await Promise.all(deletePromises);
        alert("Your information has been successfully removed from LifeFlow.");
        onClose();
      }
    } catch (error) {
      console.error("Error deleting donor:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative p-8">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full text-gray-400">
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <div className="bg-red-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Trash2 className="text-red-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Opt-Out</h2>
          <p className="text-gray-500 mt-2 text-sm">
            Enter your registered phone number to remove your donor profile from our live directory.
          </p>
        </div>

        <form onSubmit={handleDelete} className="space-y-4">
          <input 
            type="tel" 
            required 
            maxLength="10"
            placeholder="10-Digit Registered Phone" 
            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-red-600"
            onChange={(e) => setPhone(e.target.value)}
          />
          
          <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 flex gap-3">
            <AlertTriangle className="text-amber-600 shrink-0" size={20} />
            <p className="text-xs text-amber-800 font-medium leading-tight">
              Action is permanent. You will need to re-register if you wish to donate again.
            </p>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-600 transition disabled:bg-gray-300"
          >
            {loading ? "Removing..." : "Remove My Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DeleteDonorModal;