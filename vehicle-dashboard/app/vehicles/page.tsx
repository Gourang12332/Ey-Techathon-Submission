'use client'

import React from 'react';

const VEHICLES = ["XYZ789", "LMN456", "PQR999"];

const Vehicles: React.FC = () => {
    
    const handleSelectVehicle = (v: string) => {
        window.location.href = `?vehicleId=${v}`;
    }

    return (
        <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4 sm:p-8 font-sans">
            <div className="w-full max-w-md mx-auto bg-white p-8 rounded-xl shadow-2xl border border-gray-200 transition duration-500 ease-in-out transform hover:shadow-3xl">
                
                <h2 className="text-3xl font-extrabold text-center text-blue-600 mb-8 border-b-2 pb-3 border-blue-100">
                    Select Fleet Vehicle
                </h2>
                
                <div className="space-y-4">
                    {VEHICLES.map(v => (
                        <button 
                            key={v} 
                            onClick={() => handleSelectVehicle(v)}
                            className="w-full flex justify-between items-center px-6 py-4 
                                       bg-white text-gray-800 text-xl font-semibold 
                                       rounded-xl shadow-lg border border-gray-100 
                                       transition-all duration-300 ease-in-out
                                       transform hover:scale-[1.02] hover:bg-blue-50 
                                       hover:text-blue-700 hover:shadow-xl hover:border-blue-200
                                       focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
                        >
                            <span>Vehicle ID:</span>
                            <span className="font-mono bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-lg shadow-inner">
                                {v}
                            </span>
                        </button>
                    ))}
                </div>
                
                <p className="text-center text-sm text-gray-500 mt-8 pt-4 border-t border-gray-100">
                    Select a vehicle to access its live telemetry and service history dashboard.
                </p>

            </div>
        </div>
    );
};

export default Vehicles;