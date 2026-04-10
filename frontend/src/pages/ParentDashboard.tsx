import React, { useEffect, useRef, useState, useCallback } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RefreshCw, CheckCircle, Clock, MapPin, Wifi, WifiOff, Users, UserCheck, UserX, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Fix default marker icons broken by Vite/webpack bundling
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow });

const API_BASE_URL = import.meta.env.VITE_API_URL as string;
const MOCK_BUS_ID = '609b11111111111111111111';
const POLL_INTERVAL = 5000;

// Component to fly the map to updated coords
const MapPanner: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], map.getZoom(), { animate: true, duration: 1.2 });
  }, [lat, lng, map]);
  return null;
};

type AttendanceStatus = 'PRESENT' | 'ABSENT' | null;

interface Student {
  id: string;
  name: string;
  email: string;
}

const ParentDashboard: React.FC = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceStatus>>({});
  const [attendanceLoading, setAttendanceLoading] = useState<Record<string, boolean>>({});
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { user } = useAuth();

  const fetchLocation = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/tracking/${MOCK_BUS_ID}`);
      if (res.data?.lat) {
        setLocation({ lat: res.data.lat, lng: res.data.lng });
        setLastUpdated(new Date());
        setIsLive(true);
      }
    } catch {
      setIsLive(false);
    }
  }, []);

  const fetchStudentsAndAttendance = useCallback(async () => {
    try {
      // Fetch students assigned to this bus (this also triggers seeding on backend if empty)
      let res = await axios.get(`${API_BASE_URL}/buses/${MOCK_BUS_ID}/students`);
      let studentList = Array.isArray(res.data?.presentStudents || res.data) ? (res.data?.presentStudents || res.data) : [];

      if (user && user.role === 'PARENT') {
        const hasMatchingChild = studentList.some((s: any) => s.email === user.email || s.name === user.name);
        if (!hasMatchingChild) {
           await axios.post(`${API_BASE_URL}/buses/${MOCK_BUS_ID}/students`, {
             name: user.name,
             email: user.email
           });
           res = await axios.get(`${API_BASE_URL}/buses/${MOCK_BUS_ID}/students`);
           studentList = Array.isArray(res.data?.presentStudents || res.data) ? (res.data?.presentStudents || res.data) : [];
        }
      }

      setStudents(studentList);

      // Fetch attendance for these students
      for (const student of studentList) {
        try {
          const attRes = await axios.get(`${API_BASE_URL}/attendance/${student.id}`);
          if (attRes.data?.status) {
            setAttendanceMap(prev => ({ ...prev, [student.id]: attRes.data.status }));
          }
        } catch (err) {
          // No attendance for today yet, which is fine
        }
      }
    } catch (err) {
      console.error('Failed to fetch students/attendance:', err);
    }
  }, [user]);

  useEffect(() => {
    const init = async () => {
      await Promise.allSettled([fetchLocation(), fetchStudentsAndAttendance()]);
      setLoading(false);
    };
    init();
    intervalRef.current = setInterval(fetchLocation, POLL_INTERVAL);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [fetchLocation, fetchStudentsAndAttendance]);

  const markAttendance = async (studentId: string, status: 'PRESENT' | 'ABSENT') => {
    setAttendanceLoading(prev => ({ ...prev, [studentId]: true }));
    try {
      await axios.post(`${API_BASE_URL}/attendance/mark`, { studentId, status });
      setAttendanceMap(prev => ({ ...prev, [studentId]: status }));
    } catch (err) {
      console.error('Attendance update failed:', err);
      alert('Failed to update attendance. Please try again.');
    } finally {
      setAttendanceLoading(prev => ({ ...prev, [studentId]: false }));
    }
  };

  // For the demo: Find the student matching the parent if it exists, otherwise fallback to the first student
  const parentChild = students.find(s => s.name === user?.name);
  const myChild = parentChild || (students.length > 0 ? students[0] : null);

  const defaultCenter: [number, number] = location ? [location.lat, location.lng] : [40.7128, -74.0060];

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Parent Portal</h2>
          <p className="text-gray-500">Live bus tracking, boarding status and attendance for your child.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border ${isLive ? 'bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
            {isLive ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            {isLive ? 'Live' : 'Offline'}
          </div>
          <button
            onClick={() => { fetchLocation(); fetchStudentsAndAttendance(); }}
            className="p-2 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-medium pr-1">Refresh</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Map - takes 3 cols */}
        <section className="lg:col-span-3 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col min-h-[480px]">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0 bg-gray-50/50">
            <div className="flex items-center gap-2 text-gray-800 font-bold">
              <MapPin className="w-5 h-5 text-[#FFC107]" />
              Live Map
              {isLive && <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse ml-1" />}
            </div>
            {location && (
              <div className="text-xs font-mono text-gray-500 bg-white px-3 py-1 rounded-lg border border-gray-200 flex gap-3 shadow-sm">
                <span><span className="text-yellow-600 font-bold">LAT</span> {location.lat.toFixed(5)}</span>
                <span><span className="text-yellow-600 font-bold">LNG</span> {location.lng.toFixed(5)}</span>
              </div>
            )}
          </div>

          <div className="flex-1 relative">
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 gap-3">
                <div className="w-8 h-8 border-2 border-[#FFC107] border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-500 text-sm font-medium">Acquiring bus signal...</p>
              </div>
            ) : (
              <MapContainer
                center={defaultCenter}
                zoom={13}
                style={{ height: '100%', width: '100%', minHeight: '400px' }}
                className="z-0"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                {location && (
                  <>
                    <MapPanner lat={location.lat} lng={location.lng} />
                    <Marker position={[location.lat, location.lng]}>
                      <Popup className="font-sans">
                        <div className="text-center py-1">
                          <strong className="text-gray-900">🚌 School Bus</strong>
                          <p className="text-xs text-gray-500 mt-1">
                            {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                          </p>
                          {lastUpdated && (
                            <p className="text-xs text-gray-400 mt-1">
                              Updated {lastUpdated.toLocaleTimeString()}
                            </p>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  </>
                )}
              </MapContainer>
            )}
          </div>

          {!location && !loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm gap-3 z-10 pointer-events-none">
              <MapPin className="w-12 h-12 text-gray-300" />
              <p className="text-gray-500 text-sm font-medium text-center px-4">No GPS signal yet.<br />Waiting for driver to update location.</p>
            </div>
          )}
        </section>

        {/* Child card - takes 2 cols */}
        <section className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col">
          <h3 className="text-lg font-extrabold text-gray-900 mb-5 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#FFC107]" />
            My Child
          </h3>

          <div className="space-y-4 flex-1">
            {myChild ? (
              <div
                key={myChild.id}
                className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 transition-all hover:border-gray-200 hover:bg-gray-50"
              >
                {/* Top row: avatar + name */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-yellow-200 bg-yellow-100 text-yellow-700 font-black text-lg shadow-sm">
                    {myChild.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-bold text-gray-900 truncate">{myChild.name}</h4>
                    <p className="text-xs text-gray-500 font-medium">{myChild.email}</p>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1 font-semibold">
                      <Clock className="w-3 h-3 text-gray-400" />
                      Morning Route
                    </p>
                  </div>
                </div>

                {/* Attendance toggle row */}
                <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Today's Attendance</span>
                  
                  <div className="flex items-center gap-2">
                    {attendanceLoading[myChild.id] ? (
                      <div className="flex items-center gap-2 text-gray-500 text-xs py-2 px-1 font-medium">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Updating status...
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => markAttendance(myChild.id, 'PRESENT')}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all border ${attendanceMap[myChild.id] === 'PRESENT' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900 shadow-sm'}`}
                        >
                          <UserCheck className="w-4 h-4" />
                          Present
                        </button>
                        <button
                          onClick={() => markAttendance(myChild.id, 'ABSENT')}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all border ${attendanceMap[myChild.id] === 'ABSENT' ? 'bg-red-50 text-red-600 border-red-200 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900 shadow-sm'}`}
                        >
                          <UserX className="w-4 h-4" />
                          Absent
                        </button>
                      </>
                    )}
                  </div>

                  {attendanceMap[myChild.id] && (
                    <p className={`text-[10px] uppercase font-black tracking-widest mt-1 text-center ${attendanceMap[myChild.id] === 'PRESENT' ? 'text-emerald-500' : 'text-red-500'}`}>
                      Confirmed {attendanceMap[myChild.id]} for today
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                <Users className="w-10 h-10 text-gray-300 mb-3" />
                <p className="text-gray-500 text-sm font-medium">No child information found.<br/>Please contact administrator.</p>
              </div>
            )}
          </div>

          {lastUpdated && (
            <p className="text-[10px] font-semibold text-gray-400 mt-6 text-center">
              LIVE TRACKING ENABLED · LAST BEACON: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

export default ParentDashboard;
