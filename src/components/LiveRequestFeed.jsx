import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { Clock, MapPin, Activity, Phone } from 'lucide-react';

const LiveRequestFeed = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "requests"), orderBy("createdAt", "desc"), limit(6));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  if (requests.length === 0) return null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-red-600 p-2 rounded-lg animate-pulse">
          <Activity className="text-white" size={20} />
        </div>
        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Live Emergency Requests</h2>
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
                <Clock size={14} /> Just now
              </div>
              <div className="text-red-600 font-bold text-sm bg-red-50 px-3 py-1 rounded-full">
                {req.units} Units Required
              </div>
            </div>

            <a href={`tel:${req.contact}`} className="w-full bg-red-50 text-red-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition group-hover:scale-105">
              <Phone size={16} /> Contact Family
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveRequestFeed;