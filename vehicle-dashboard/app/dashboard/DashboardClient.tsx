'use client'

import React, { useEffect, useState } from "react";

// --- TypeScript Interfaces ---

interface PredictionData {
  vehicleId: string;
  status: 'OK' | 'ALERT';
  message?: string;
  recommendedAction?: string;
  // Assuming other arbitrary data fields are present in the actual response
  [key: string]: any; 
}

interface Booking {
  dateTime: string;
  serviceCenterName: string;
  status: 'Completed' | 'Scheduled' | 'Cancelled' | string;
}

interface DataDisplayProps {
  data: PredictionData;
  isAlert: boolean;
}

interface BookingsListProps {
  bookings: Booking[];
  isLoadingBookings: boolean;
  errorBookings: string | null;
  vehicleId: string;
}

// --- Constants ---
const VEHICLES = ["XYZ789", "LMN456", "PQR999"];
const USER_NAME = "Gourang Jain";
const API_URL = "https://prediction-32w1.onrender.com/predict";
const BOOKING_API_URL = "https://booking-api.onrender.com/bookings";
const SPEAK_API_URL = "https://speak-api-qzzw.onrender.com/speak";
const SERVICE_UI_URL = "https://service-booking-ui.onrender.com/";
const POLLING_INTERVAL = 600000;

// --- Components ---

const DataDisplay: React.FC<DataDisplayProps> = ({ data, isAlert }) => (
  <div className={`p-6 rounded-xl border transition-all duration-300 shadow-md h-full
    ${isAlert
      ? 'bg-red-50 border-red-300 shadow-red-200/50'
      : 'bg-white border-gray-200 shadow-blue-100/50'
    }
  `}>
    <h3 className={`text-xl font-bold mb-4 pb-2 border-b 
      ${isAlert ? 'text-red-600 border-red-200' : 'text-gray-800 border-gray-200'}
    `}>
        {isAlert ? '🚨 CRITICAL ALERT' : '✅ Operational Status'}
    </h3>

    <div className="space-y-4">
        <p className="flex justify-between items-center text-base">
            <span className="font-medium text-gray-500">Vehicle ID:</span>
            <span className={`font-mono px-3 py-1 rounded text-sm font-semibold
              ${isAlert ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}
            `}>{data.vehicleId}</span>
        </p>

        <p className="flex justify-between items-center text-base">
            <span className="font-medium text-gray-500">System Status:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-bold shadow-sm
              ${isAlert ? 'bg-red-500 text-white animate-pulse' : 'bg-green-500 text-white'}
            `}>
                {data.status}
            </span>
        </p>

        {isAlert && (
            <>
                <div className="border-t border-red-200 pt-4 mt-4">
                    <p className="text-base font-semibold text-red-700 mb-1">Issue Detected:</p>
                    <p className="text-sm text-red-600 italic">{data.message}</p>
                </div>
                <div className="border-t border-red-200 pt-4 mt-4">
                    <p className="text-base font-semibold text-orange-600 mb-1">Recommended Action:</p>
                    <p className="text-sm text-gray-700 font-medium">{data.recommendedAction}</p>
                </div>
            </>
        )}

        {!isAlert && (
             <p className="text-green-600 pt-2 italic text-sm">Operating within normal parameters.</p>
        )}

        <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-500 mb-1">Raw Data:</p>
            <pre className="bg-gray-50 p-2 text-xs rounded-lg overflow-x-auto text-gray-600 max-h-32 border border-gray-200">
                {/* Ensure data is safely stringified */}
                {data ? JSON.stringify(data, null, 2) : 'No data available.'}
            </pre>
        </div>
    </div>
  </div>
);

const BookingsList: React.FC<BookingsListProps> = ({ bookings, isLoadingBookings, errorBookings, vehicleId }) => (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 h-full">
        <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            Service History ({vehicleId || 'N/A'})
        </h3>

        {isLoadingBookings && <p className="text-blue-500 italic">Loading booking history...</p>}
        {errorBookings && <p className="text-red-500">Error loading bookings: {errorBookings}</p>}

        {!vehicleId ? (
            <p className="text-gray-500 italic">Select a vehicle to view its service history.</p>
        ) : (
            <>
                {bookings.length === 0 && !isLoadingBookings ? (
                    <p className="text-gray-500 italic">No previous service bookings found.</p>
                ) : (
                    <ul className="space-y-3 max-h-60 overflow-y-auto">
                        {bookings.map((b, i) => (
                            <li key={i} className="p-3 bg-gray-50 border border-gray-100 rounded-lg text-sm shadow-sm hover:shadow-md transition duration-150">
                                <div className="flex justify-between items-start">
                                    <span className="font-semibold text-gray-700">{b.serviceCenterName || 'Unknown Center'}</span>
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${b.status === 'Completed' ? 'bg-green-100 text-green-700' : b.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {b.status || 'N/A'}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Date: {b.dateTime || 'N/A'}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </>
        )}
    </div>
);


const DashboardClient: React.FC = () => {
  const [vehicleId, setVehicleId] = useState<string>("");
  const [data, setData] = useState<PredictionData | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingPrediction, setIsLoadingPrediction] = useState<boolean>(false);
  const [errorPrediction, setErrorPrediction] = useState<string | null>(null);
  const [isLoadingBookings, setIsLoadingBookings] = useState<boolean>(false);
  const [errorBookings, setErrorBookings] = useState<string | null>(null);

  useEffect(() => {
    if (!vehicleId) return;

    const fetchAllData = () => {
      fetchPrediction();
      fetchBookings();
    };

    fetchAllData();

    const intervalId = setInterval(fetchAllData, POLLING_INTERVAL);

    return () => clearInterval(intervalId);
  }, [vehicleId]);

  const speak = async (json: PredictionData | null) => {
    if (!json) return;

    const text =
      json.status === "OK"
        ? `Vehicle ${json.vehicleId} is functioning normally. All systems green.`
        : `Urgent Alert for vehicle ${json.vehicleId}. Recommended action: ${json.recommendedAction}`;

    try {
      const audioRes = await fetch(SPEAK_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!audioRes.ok) throw new Error("Failed to fetch audio from TTS API");

      const audioBlob = await audioRes.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      new Audio(audioUrl).play();

    } catch (e) {
      console.error("TTS Error:", e);
    }
  };

  const fetchPrediction = async () => {
    if (!vehicleId) return;

    setIsLoadingPrediction(true);
    setErrorPrediction(null);
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        const res = await fetch(`${API_URL}?vehicleId=${vehicleId}`);
        if (!res.ok) throw new Error(`API returned status ${res.status}`);

        const json: PredictionData = await res.json();
        setData(json);
        setIsLoadingPrediction(false);
        speak(json);
        return;
      } catch (e) {
        attempt++;
        if (attempt >= maxRetries) {
          console.error("Failed to fetch prediction after multiple retries:", e);
          setErrorPrediction(`Failed to fetch status for ${vehicleId}.`);
          setData(null);
          setIsLoadingPrediction(false);
          return;
        }
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  };

  const fetchBookings = async () => {
    if (!vehicleId) return;

    setIsLoadingBookings(true);
    setErrorBookings(null);

    try {
      const res = await fetch(`${BOOKING_API_URL}?vehicleId=${vehicleId}`);
      if (!res.ok) throw new Error(`Booking API returned status ${res.status}`);

      const json: Booking[] = await res.json();
      setBookings(json || []);
    } catch (e) {
      console.error("Booking fetch error:", e);
      setErrorBookings("Could not load booking history.");
      setBookings([]);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  const isAlert = data && (data.status !== "OK") || false;

  const handleScheduleService = () => {
    if (vehicleId) {
        window.location.href = `${SERVICE_UI_URL}?vehicleId=${vehicleId}`;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900 p-4 sm:p-8 font-sans">
      <div className="w-full max-w-5xl mx-auto">
        
        <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-8">
          <h1 className="text-3xl font-extrabold text-blue-600">
            Fleet Telemetry Console
          </h1>
          <div className="text-right">
            <p className="text-sm text-gray-500">Welcome back,</p>
            <p className="text-lg font-semibold text-gray-800">{USER_NAME}</p>
          </div>
        </header>

        
        <div className="mb-8 p-4 bg-white rounded-xl shadow-md border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="mb-4 sm:mb-0 w-full sm:w-1/2">
            <label htmlFor="vehicle-select" className="block text-sm font-medium text-gray-600 mb-1">
              Select Vehicle ID:
            </label>
            <div className="relative">
              <select
                id="vehicle-select"
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 text-gray-800 py-2 px-3 pr-8 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 cursor-pointer text-base"
              >
                <option value="" disabled>
                  -- Choose Vehicle --
                </option>
                {VEHICLES.map((v) => (
                  <option key={v} value={v} className="bg-white">
                    {v}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
          
          {vehicleId && (
            <div className="text-sm font-medium flex items-center space-x-2">
                <span className={`w-3 h-3 rounded-full ${isAlert ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></span>
                <span className="text-gray-600">
                    Last Update: {isAlert ? 'ALERT' : 'Normal'}
                </span>
            </div>
          )}
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            <div className="lg:col-span-1">
                {isLoadingPrediction && (
                  <div className="text-center p-8 bg-white rounded-xl shadow-md border border-gray-200 flex flex-col items-center justify-center space-y-3">
                    <div className="w-8 h-8 border-4 border-t-4 border-blue-500 border-opacity-75 rounded-full animate-spin"></div>
                    <p className="text-lg text-blue-600">Loading prediction for {vehicleId || 'selected vehicle'}...</p>
                  </div>
                )}

                {errorPrediction && (
                  <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg" role="alert">
                    <span className="font-semibold">Prediction Error:</span> {errorPrediction}
                  </div>
                )}

                {data && !isLoadingPrediction && (
                  <DataDisplay data={data} isAlert ={isAlert} />
                )}

                {!vehicleId && !data && (
                  <div className="text-center p-8 bg-white rounded-xl border border-dashed border-gray-300 shadow-inner">
                    <p className="text-xl text-gray-500">Select a Vehicle to view live telemetry status.</p>
                    <p className="text-sm text-gray-400 mt-2">Data refreshes every 10 minutes.</p>
                  </div>
                )}
            </div>

            
            <div className="lg:col-span-1 flex flex-col space-y-6">
                <div className="flex-grow">
                    <BookingsList
                        bookings={bookings}
                        isLoadingBookings={isLoadingBookings}
                        errorBookings={errorBookings}
                        vehicleId={vehicleId}
                    />
                </div>
                
                <button
                    onClick={handleScheduleService}
                    disabled={!vehicleId}
                    className={`w-full py-3 rounded-lg text-white font-bold transition duration-300 shadow-lg
                        ${vehicleId ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/50' : 'bg-gray-400 cursor-not-allowed'}
                    `}
                >
                    Schedule New Service
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardClient;