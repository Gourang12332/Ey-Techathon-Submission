'use client'

import { useRouter } from "next/navigation";

const vehicles = ["XYZ789", "LMN456", "PQR999"];

export default function Vehicles() {
  const router = useRouter();

  return (
    <div>
      <h2>Select Vehicle</h2>
      {vehicles.map(v => (
        <button key={v} onClick={() => router.push(`/dashboard?vehicleId=${v}`)}>
          {v}
        </button>
      ))}
    </div>
  );
}
