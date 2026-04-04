import { useState } from 'react';
import { Droplet, AlertCircle, Search, Trash2 } from 'lucide-react';
import DonorSearch from './components/DonorSearch';
import RegisterModal from './components/RegisterModal';
import DeleteDonorModal from './components/DeleteDonorModal';
import PostRequestModal from './components/PostRequestModal'; 
import LiveRequestFeed from './components/LiveRequestFeed';   

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false); 
  const [detectedCoords, setDetectedCoords] = useState(null);

  const handleNearbySearch = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
      setDetectedCoords(coords);
      document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' });
    });
  };

  return (
    // 🎨 NEW: Deep Slate Background (Dark Mode Style)
    <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-red-500 selection:text-white">
      
      {/* Navbar - Dark Glass Effect */}
      <nav className="bg-slate-900/80 backdrop-blur-md px-8 py-5 flex justify-between items-center shadow-xl border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-2 text-red-500 font-bold text-2xl tracking-tight">
          <Droplet fill="currentColor" size={32} />
          <span>LifeFlow</span>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-red-600 text-white px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-red-500 transition active:scale-95"
        >
          Register as Donor
        </button>
      </nav>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto text-center py-28 px-6">
        <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 px-4 py-2 rounded-full text-red-400 text-sm font-bold mb-8 shadow-inner">
           <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          Live Emergency Support
        </div>

        <h1 className="text-5xl md:text-8xl font-black text-white mb-8 leading-tight tracking-tighter">
          Every Drop <span className="text-red-600">Saves a Life.</span>
        </h1>
        
        <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
          The fastest way to find blood donors in your area. Connect instantly and save lives when every second counts.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
          <button 
            onClick={() => setIsRequestModalOpen(true)} 
            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-red-600 text-white px-10 py-5 rounded-2xl text-xl font-bold shadow-2xl shadow-red-900/20 hover:scale-105 transition-all"
          >
            <AlertCircle size={24} /> Emergency Request
          </button>
          
          <button 
            onClick={handleNearbySearch} 
            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-slate-800 border-2 border-slate-700 text-slate-200 px-10 py-5 rounded-2xl text-xl font-bold hover:border-red-600 hover:text-white transition-all shadow-lg"
          >
            <Search size={24} /> Find Nearby Donors
          </button>
        </div>
      </main>

      {/* Live Emergency Feed Section */}
      <section className="py-12 bg-slate-900/50">
        <LiveRequestFeed />
      </section>

      {/* Donor Search Section */}
      <section id="search-section" className="bg-slate-900 border-t border-slate-800 py-20 scroll-mt-20">
        <DonorSearch autoLocation={detectedCoords} setAutoLocation={setDetectedCoords} />
      </section>

      {/* Footer */}
      <footer className="py-20 text-center bg-[#0b1120] border-t border-slate-800">
        <p className="text-slate-500 text-sm mb-6 font-medium tracking-wide">© 2026 LifeFlow Platform • Built for Social Impact</p>
        <button 
          onClick={() => setIsDeleteModalOpen(true)}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-red-500 text-xs font-bold uppercase tracking-widest transition-all duration-300 group"
        >
          <Trash2 size={14} className="group-hover:rotate-12" />
          Want to stop donating? Opt-out here
        </button>
      </footer>

      {/* Modals */}
      <RegisterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <PostRequestModal isOpen={isRequestModalOpen} onClose={() => setIsRequestModalOpen(false)} />
      <DeleteDonorModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} />
    </div>
  );
}

export default App;