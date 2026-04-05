import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, limit, deleteDoc, doc } from 'firebase/firestore';
import { Clock, MapPin, Activity, Phone, CheckCircle2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns'; // 📍 For real-time relative timing

const LiveRequestFeed = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "requests"), orderBy("createdAt", "desc"), limit(6));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // 📍 Function to let users delete their own request
  const handleFulfilled = async (requestId, originalPhone) => {
    const userInput = prompt("To remove this request, please enter the Contact Number used to post it:");
    
    if (userInput === originalPhone) {
      try {
        await deleteDoc(doc(db, "requests", requestId));
        alert("Emergency request marked as fulfilled and removed. Thank you!");
      } catch (error) {
        alert("Error removing request. Please try again.");
      }
    } else if (userInput !== null) {
      alert("Verification failed. Phone number does not match.");
    }
  };

  if (requests.length === 0) return null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-red-600 p-2 rounded-lg animate-pulse">
          <Activity className="text-white" size={20} />
        </div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Live Emergency Requests</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map(req => (
          <div key={req.id} className="bg-white border-2 border-red-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-red-600 text-white px-4 py-1 rounded-bl-2xl font-black text-sm">
              {req.bloodGroup}
            </div>
            
            <div className="mb-4">
              <h3 className="font-bold text-gray-900 text-lg mb-1">{req.hospital}</h3>
              <p className="text-gray-500 text-sm flex items-center gap-1 font-medium">
                <MapPin size={14} className="text-red-500" /> {req.location}
              </p>
            </div>

            <div className="flex justify-between items-center mb-6">
              <div className="text-sm font-bold text-gray-400 flex items-center gap-1">
                <Clock size={14} /> 
                {/* 📍 Dynamically calculates time like "2 hours ago" */}
                {req.createdAt?.toDate ? formatDistanceToNow(req.createdAt.toDate(), { addSuffix: true }) : 'Just now'}
              </div>
              <div className="text-red-600 font-bold text-sm bg-red-50 px-3 py-1 rounded-full">
                {req.units} Units
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <a href={`tel:${req.contact}`} className="w-full bg-red-50 text-red-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition">
                <Phone size={16} /> Contact Family
              </a>
              
              {/* 📍 Mark as Fulfilled Button */}
              <button 
                onClick={() => handleFulfilled(req.id, req.contact)}
                className="w-full text-gray-400 hover:text-green-600 py-2 rounded-xl font-bold flex items-center justify-center gap-2 transition text-xs border border-transparent hover:border-green-100 hover:bg-green-50"
              >
                <CheckCircle2 size={14} /> Mark as Fulfilled
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveRequestFeed;