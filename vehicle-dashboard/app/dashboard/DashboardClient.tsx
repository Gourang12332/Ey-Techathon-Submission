"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const VEHICLES = ["XYZ789", "LMN456", "PQR999"];
const USER_NAME = "Gourang Jain";

export default function DashboardClient() {
  const searchParams = useSearchParams();
  const initialVehicleId = searchParams.get("vehicleId");

  const [vehicleId, setVehicleId] = useState(initialVehicleId || "");
  const [data, setData] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    if (initialVehicleId) setVehicleId(initialVehicleId);
  }, [initialVehicleId]);

  useEffect(() => {
    if (!vehicleId) return;

    fetchPrediction();
    fetchBookings();

    const interval = setInterval(fetchPrediction, 600000);
    return () => clearInterval(interval);
  }, [vehicleId]);

  const fetchPrediction = async () => {
    const res = await fetch(
      `https://prediction-32w1.onrender.com/predict?vehicleId=${vehicleId}`
    );
    const json = await res.json();
    setData(json);
    if (json) speak(json);
  };

  const fetchBookings = async () => {
    const res = await fetch(
      `https://booking-api.onrender.com/bookings?vehicleId=${vehicleId}`
    );
    const json = await res.json();
    setBookings(json);
  };

  const speak = async (json: any) => {
    const text =
      json.status === "OK"
        ? `Vehicle ${json.vehicleId} is functioning normally.`
        : `Alert for vehicle ${json.vehicleId}. ${json.recommendedAction}`;

    const audioRes = await fetch("https://speak-api-qzzw.onrender.com/speak", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const audioBlob = await audioRes.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    new Audio(audioUrl).play();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Vehicle Dashboard</h2>
      <p><strong>User:</strong> {USER_NAME}</p>

      <label>Select Vehicle: </label>
      <select value={vehicleId} onChange={e => setVehicleId(e.target.value)}>
        <option value="" disabled>Select</option>
        {VEHICLES.map(v => (
          <option key={v} value={v}>{v}</option>
        ))}
      </select>

      <h3>Vehicle Status</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>

      <h3>Previous Bookings</h3>
      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        <ul>
          {bookings.map((b, i) => (
            <li key={i}>
              {b.dateTime} — {b.serviceCenterName} ({b.status})
            </li>
          ))}
        </ul>
      )}

      <button
        style={{ marginTop: 20 }}
        onClick={() =>
          window.location.href =
            `https://service-booking-ui.onrender.com/?vehicleId=${vehicleId}`
        }
      >
        Schedule Service
      </button>
    </div>
  );
}
