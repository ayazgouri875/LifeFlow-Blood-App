import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, limit, deleteDoc, doc } from 'firebase/firestore';
import { Clock, MapPin, Activity, Phone, CheckCircle2, BellRing } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const LiveRequestFeed = ({ userBloodGroup, userCity }) => {
  const [requests, setRequests] = useState([]);
  const [urgentMatch, setUrgentMatch] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "requests"), orderBy("createdAt", "desc"), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allRequests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRequests(allRequests);

      // 📍 Logic: Find a request that matches the user's specific group and city
      const match = allRequests.find(req => 
        req.bloodGroup === userBloodGroup && 
        req.location?.toLowerCase().trim() === userCity?.toLowerCase().trim()
      );
      setUrgentMatch(match);
    });
    return () => unsubscribe();
  }, [userBloodGroup, userCity]);

  const handleFulfilled = async (requestId, originalPhone) => {
    const userInput = prompt("Enter the contact number used to post this request to remove it:");
    if (userInput === originalPhone) {
      try {
        await deleteDoc(doc(db, "requests", requestId));
        alert("Request removed. Thank you!");
      } catch (e) { alert("Error removing request."); }
    } else if (userInput !== null) {
      alert("Verification failed.");
    }
  };

  if (requests.length === 0) return null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* 📍 Targeted Banner for Matching Donors */}
      {urgentMatch && (
        <div className="mb-10 bg-red-600 border-4 border-white/20 p-8 rounded-[2rem] shadow-2xl animate-pulse flex flex-col md:flex-row items-center justify-between gap-6 text-white">
          <div className="flex items-center gap-5">
            <div className="bg-white p-4 rounded-2xl text-red-600">
              <BellRing size={40} />
            </div>
            <div className="text-left">
              <h2 className="text-3xl font-black italic tracking-tighter">URGENT MATCH FOUND!</h2>
              <p className="text-red-100 font-bold text-lg leading-tight">
                A patient needs {urgentMatch.bloodGroup} at {urgentMatch.hospital} in {urgentMatch.location}.
              </p>
            </div>
          </div>
          <a href={`tel:${urgentMatch.contact}`} className="bg-white text-red-600 px-10 py-5 rounded-2xl font-black text-xl hover:scale-105 transition shadow-xl">
            HELP NOW
          </a>
        </div>
      )}

      <div className="flex items-center gap-3 mb-8">
        <Activity className="text-red-600" size={24} />
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Recent Emergencies</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map(req => {
          const isMatch = req.bloodGroup === userBloodGroup && req.location?.toLowerCase() === userCity?.toLowerCase();
          return (
            <div key={req.id} className={`bg-white p-6 rounded-3xl shadow-sm relative overflow-hidden border-4 transition-all ${isMatch ? 'border-red-500 scale-105 z-10' : 'border-transparent opacity-90'}`}>
              <div className="absolute top-0 right-0 bg-red-600 text-white px-4 py-1 rounded-bl-2xl font-black text-sm">
                {req.bloodGroup}
              </div>
              <div className="mb-4">
                <h3 className="font-bold text-gray-900 text-lg">{req.hospital}</h3>
                <p className="text-gray-500 text-sm flex items-center gap-1 font-medium"><MapPin size={14} className="text-red-500" /> {req.location}</p>
              </div>
              <div className="flex justify-between items-center mb-6 text-sm font-bold text-gray-400">
                <div className="flex items-center gap-1"><Clock size={14} /> {req.createdAt?.toDate ? formatDistanceToNow(req.createdAt.toDate(), { addSuffix: true }) : 'Just now'}</div>
                <div className="text-red-600 bg-red-50 px-3 py-1 rounded-full">{req.units} Units</div>
              </div>
              <div className="flex flex-col gap-2">
                <a href={`tel:${req.contact}`} className="w-full bg-red-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition"><Phone size={16} /> Contact Family</a>
                <button onClick={() => handleFulfilled(req.id, req.contact)} className="text-gray-300 hover:text-green-600 py-1 text-[10px] font-bold uppercase transition">Mark as Fulfilled</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LiveRequestFeed;