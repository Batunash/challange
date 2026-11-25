import React from "react";
import { useTelemetry } from "./hooks/useTelemetry";
import { RocketCard } from "./components/RocketCard";

function App() {
  const { telemetry, isConnected } = useTelemetry("ws://localhost:8000/ws");
  const rockets = telemetry ? Object.values(telemetry) : [];

  return (
    <>
      <div>
        {rockets.map((rocket) => (
          <RocketCard key={rocket.rocket_id} telemetry={rocket} />
        ))}
      </div>
    </>
  );
}

export default App;