import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { MapPin, Navigation, UserCheck, UserX, Loader2, CheckCircle2, ChevronRight, Info, AlertCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL as string;
const MOCK_BUS_ID = '609b11111111111111111111';
const POLL_INTERVAL = 5000;

interface Student {
  id: string;
  name: string;
}

interface RouteStop {
  name: string;
  lat: number;
  lng: number;
  time: string;
}

interface BusData {
  presentStudents: Student[];
  absentStudents: Student[];
  route: RouteStop[];
}

const DriverDashboard: React.FC = () => {
  const [data, setData] = useState<BusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [boardingStatuses, setBoardingStatuses] = useState<Record<string, 'BOARDED' | 'NOT_BOARDED'>>({});
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchBusData = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/buses/${MOCK_BUS_ID}/students`);
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch bus data', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBusData();
    pollTimerRef.current = setInterval(fetchBusData, POLL_INTERVAL);
    return () => { if (pollTimerRef.current) clearInterval(pollTimerRef.current); };
  }, [fetchBusData]);

  const handleUpdateLocation = async () => {
    setIsUpdatingLocation(true);
    setUpdateStatus('idle');
    try {
      const lat = 40.7128 + (Math.random() * 0.01 - 0.005);
      const lng = -74.0060 + (Math.random() * 0.01 - 0.005);
      await axios.post(`${API_BASE_URL}/tracking/update-location`, {
        busId: MOCK_BUS_ID,
        lat,
        lng
      });
      setUpdateStatus('success');
      setTimeout(() => setUpdateStatus('idle'), 3000);
    } catch (error) {
      console.error("Location update failed:", error);
      setUpdateStatus('error');
    } finally {
      setIsUpdatingLocation(false);
    }
  };

  const markBoarding = async (studentId: string, status: 'BOARDED' | 'NOT_BOARDED') => {
    setBoardingStatuses(prev => ({ ...prev, [studentId]: status }));
    try {
      await axios.post(`${API_BASE_URL}/boarding/mark`, {
        studentId,
        busId: MOCK_BUS_ID,
        status
      });
    } catch (error) {
      console.error("Boarding update failed:", error);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        <p className="font-medium">Initializing Driver Dashboard...</p>
      </div>
    );
  }

  const presentCount = data?.presentStudents.length || 0;
  const boardedCount = Object.values(boardingStatuses).filter(s => s === 'BOARDED').length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 font-sans animate-in fade-in duration-700">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Driver Portal</h2>
          <p className="text-gray-500">Live manifest and route sync enabled.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono bg-white border border-gray-200 px-4 py-2 rounded-xl text-gray-500 shadow-sm">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          AUTO-SYNC: {POLL_INTERVAL/1000}S
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Actions & Manifest */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* GPS Control */}
          <section className="bg-white border border-gray-100 p-6 rounded-2xl relative overflow-hidden group shadow-sm">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#FFC107]/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-[#FFC107]/20 transition-all duration-500" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-200/50">
                  <Navigation className="w-6 h-6 text-[#FFC107]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Live GPS Link</h3>
                  <p className="text-xs text-gray-500 mt-0.5 font-medium">Broadcasting bus coordinates to Parent Portal</p>
                </div>
              </div>
              <button
                onClick={handleUpdateLocation}
                disabled={isUpdatingLocation}
                className="relative flex items-center justify-center gap-3 px-8 py-3.5 bg-[#FFC107] rounded-xl font-bold text-gray-900 transition-all hover:bg-yellow-400 hover:-translate-y-0.5 shadow-md shadow-[#FFC107]/20 disabled:opacity-50"
              >
                {isUpdatingLocation ? <Loader2 className="w-5 h-5 animate-spin" /> : updateStatus === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                {isUpdatingLocation ? 'Syncing...' : updateStatus === 'success' ? 'Location Refreshed' : 'Post Coordinates'}
              </button>
            </div>
          </section>

          {/* Student Manifest */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 px-2">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-gray-900">Today's Manifest</h3>
                <span className="text-[10px] font-bold bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded border border-yellow-200 uppercase tracking-widest">Live</span>
              </div>
              <div className="text-sm font-semibold text-gray-500">
                <span className="text-emerald-500">{boardedCount}</span> / {presentCount} Boarded
              </div>
            </div>

            <div className="grid gap-3">
              {data?.presentStudents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400">
                  <Info className="w-8 h-8 mb-3 opacity-50" />
                  <p className="font-medium">No students marked present for this bus today.</p>
                </div>
              ) : (
                data?.presentStudents.map(student => {
                  const status = boardingStatuses[student.id];
                  const isBoarded = status === 'BOARDED';
                  return (
                    <div key={student.id} className={`flex items-center justify-between p-4 bg-white border rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md ${isBoarded ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-100 hover:border-yellow-200'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm border-2 ${isBoarded ? 'border-emerald-200 bg-emerald-100 text-emerald-600' : 'border-gray-200 bg-gray-50 text-gray-600'}`}>
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className={`font-bold transition-colors ${isBoarded ? 'text-emerald-700' : 'text-gray-900'}`}>{student.name}</h4>
                          <p className="text-[10px] text-gray-400 font-mono tracking-tighter">ID: {student.id.toUpperCase()}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => markBoarding(student.id, 'NOT_BOARDED')}
                          className={`p-2.5 rounded-xl transition-all ${status === 'NOT_BOARDED' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-gray-100 text-gray-400 hover:text-gray-900 hover:bg-gray-200'}`}
                        >
                          <UserX className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => markBoarding(student.id, 'BOARDED')}
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${isBoarded ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-[#FFC107] text-gray-900 shadow-sm border border-transparent hover:bg-yellow-400'}`}
                        >
                          <UserCheck className="w-5 h-5" />
                          <span className="text-xs uppercase tracking-wider hidden sm:inline">{isBoarded ? 'On Bus' : 'Board'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Absent Students Section */}
            {data && data.absentStudents.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 px-2">Not Riding Today</h4>
                <div className="flex flex-wrap gap-2 px-2">
                  {data.absentStudents.map(s => (
                     <div key={s.id} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-500 font-medium opacity-80">
                      <UserX className="w-3 h-3 text-gray-400" />
                      {s.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Routing Sequence */}
        <section className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#FFC107]/10 rounded-full blur-[50px] pointer-events-none" />
            
            <h3 className="text-lg font-extrabold text-gray-900 mb-6 flex items-center gap-3 relative z-10">
              <div className="w-8 h-8 bg-[#FFC107] rounded-lg flex items-center justify-center">
                <ChevronRight className="w-5 h-5 text-gray-900" />
              </div>
              Optimized Sequence
            </h3>

            <div className="space-y-0 relative z-10">
              {data?.route.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <AlertCircle className="w-6 h-6 text-yellow-500" />
                  </div>
                  <p className="text-sm font-medium text-gray-500">Route not yet calculated.<br/>Waiting for attendance.</p>
                </div>
              ) : (
                data?.route.map((stop, i) => (
                  <div key={i} className="group relative pl-10 pb-8 last:pb-0">
                    {/* Vertical connecting line */}
                    {i < data.route.length - 1 && (
                      <div className="absolute left-[15px] top-[30px] bottom-0 w-0.5 bg-gradient-to-b from-yellow-300 to-gray-200 group-hover:from-yellow-400 transition-colors" />
                    )}
                    
                    {/* Sequence pulse node */}
                    <div className="absolute left-0 top-1.5 w-8 h-8 rounded-full bg-white border-2 border-yellow-400 flex items-center justify-center z-10 group-hover:scale-110 transition-transform shadow-sm">
                      <span className="text-[10px] font-black text-gray-800">{i + 1}</span>
                    </div>

                    <div className="bg-white border border-gray-100 p-4 rounded-2xl group-hover:border-yellow-300 transition-all shadow-sm group-hover:shadow-md">
                      <h5 className="font-bold text-gray-900 text-sm mb-1">{stop.name}</h5>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {stop.lat.toFixed(3)}, {stop.lng.toFixed(3)}
                        </span>
                        <span className="text-[10px] font-black text-gray-700 bg-yellow-50 px-2 py-0.5 rounded-md border border-yellow-200">
                          {stop.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {data?.route.length && data.route.length > 0 && (
              <p className="text-[10px] text-center text-gray-400 mt-8 uppercase tracking-[0.3em] font-black">End of Manifest</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DriverDashboard;
