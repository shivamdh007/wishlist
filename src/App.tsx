import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LocationProvider } from './context/LocationContext';
import Sidebar from './components/Sidebar';
import Map from './components/Map';
import LocationModal from './components/LocationModal';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <LocationProvider>
      <div className="h-screen w-screen flex flex-col overflow-hidden">
        <main className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div
            className={`lg:w-96 w-full md:w-80 flex-shrink-0 transition-all duration-300 ease-in-out ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0'
            }`}
          >
            <Sidebar />
          </div>

          {/* Map and sidebar toggle */}
          <div className="relative flex-1">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="absolute top-4 left-4 z-10 p-2 bg-white rounded-md shadow-md lg:hidden"
              aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
              {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
            <Map />
          </div>
        </main>

        {/* Modal for adding/editing locations */}
        <LocationModal />
      </div>
    </LocationProvider>
  );
}

export default App;