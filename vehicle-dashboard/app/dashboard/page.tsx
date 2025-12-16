"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const VEHICLES = ["XYZ789", "LMN456", "PQR999"];

export default function Dashboard() {
  const searchParams = useSearchParams();
  const initialVehicleId = searchParams.get("vehicleId");

  const [vehicleId, setVehicleId] = useState<string>(initialVehicleId || "");
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (initialVehicleId) {
      setVehicleId(initialVehicleId);
    }
  }, [initialVehicleId]);

  useEffect(() => {
    if (!vehicleId) return;

    fetchPrediction();

    const interval = setInterval(fetchPrediction, 600000);
    return () => clearInterval(interval);
  }, [vehicleId]);

  const fetchPrediction = async () => {
    const res = await fetch(
      `https://prediction-32w1.onrender.com/predict?vehicleId=${vehicleId}`
    );
    const json = await res.json();
    setData(json);
    speak(json);
  };

  const speak = async (json: any) => {
    const text =
      json.status === "OK"
        ? `Vehicle ${json.vehicleId} is functioning normally.`
        : `Alert for vehicle ${json.vehicleId}. ${json.recommendedAction}`;

    const audioRes = await fetch("https://your-speak.onrender.com/speak", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
    });

  const audioBlob = await audioRes.blob();
  const audioUrl = URL.createObjectURL(audioBlob);
  new Audio(audioUrl).play();

  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Vehicle Dashboard</h2>

      <label>Select Vehicle: </label>
      <select
        value={vehicleId}
        onChange={e => setVehicleId(e.target.value)}
      >
        <option value="" disabled>
          Select
        </option>
        {VEHICLES.map(v => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>

      <pre style={{ marginTop: 20 }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
