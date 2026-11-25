import React from "react";

export function RocketCard({ telemetry }) {
  if (!telemetry) return null;

  const {
    rocket_id,
    pack_no,
    altitude,
    speed,
    acceleration,
    thrust,
    temperature,
    seconds_since_last_packet,
    connected,
  } = telemetry;

  return (
    <div>
      <div>
        <h3>{rocket_id}</h3>
        <span
          style={{
            backgroundColor: connected ? "#dcfce7" : "#fee2e2",
            color: connected ? "#166534" : "#991b1b",
          }}
        >
          {connected ? "connected" : "disconnected"}
        </span>
      </div>
      <div>
        <div>
          <span>Altitude: </span>
          <span>{altitude} m</span>
        </div>
        <div>
          <span>Speed: </span>
          <span>{speed} m/s</span>
        </div>
        <div>
          <span>Accel: </span>
          <span>{acceleration} m/s²</span>
        </div>
        <div>
          <span>Thrust: </span>
          <span>{thrust?.toLocaleString("tr-TR")} N</span>
        </div>
        <div>
          <span>Temperature: </span>
          <span>{temperature} °C</span>
        </div>
        <div>
          <span>Pack No: </span>
          <span>#{pack_no}</span>
        </div>
      </div>
      <div>
        last pack: {(seconds_since_last_packet * 1000).toFixed(1)} ms önce
      </div>
    </div>
  );
}