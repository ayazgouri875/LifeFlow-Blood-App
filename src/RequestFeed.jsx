import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { Clock, MapPin, Activity } from 'lucide-react';

const RequestFeed = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "requests"), orderBy("createdAt", "desc"), limit(5));
    return onSnapshot(q, (snapshot) => {
      setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <div className="flex items-center gap-2 mb-6 text-red-600 font-bold uppercase tracking-widest text-sm">
        <Activity size={18} />
        Live Emergency Feed
      </div>
      <div className="space-y-4">
        {requests.map(req => (
          <div key={req.id} className="bg-red-50/50 p-5 rounded-2xl border border-red-100 flex justify-between items-center animate-pulse-slow">
            <div>
              <div className="flex items-center gap-2 text-red-700 font-black text-xl mb-1">
                <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                {req.bloodGroup} Needed
              </div>
              <p className="text-gray-600 flex items-center gap-1 text-sm font-medium">
                <MapPin size={14} /> {req.hospital}, {req.location}
              </p>
            </div>
            <div className="text-right">
               <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-gray-400 border border-gray-100 flex items-center gap-1">
                 <Clock size={12} /> Live
               </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequestFeed;