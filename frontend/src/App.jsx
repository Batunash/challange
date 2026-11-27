import React, { useEffect, useState, useCallback } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { useTelemetry } from "./hooks/useTelemetry";
import { RocketCard } from "./components/RocketCard";
import { WeatherBanner } from "./components/WeatherBanner";
import api from "./hooks/api";

function App() {
  const { telemetry } = useTelemetry("ws://localhost:8000/ws");
  const rockets = telemetry ? Object.values(telemetry) : [];
  const [rocketData, setRocketData] = useState([]);

  const fetchRockets = useCallback(async () => {
    try {
      const r = await api.get("/rockets");
      setRocketData(Array.isArray(r.data) ? r.data : []);
    } catch (err) {
      console.error("Rockets fetch error:", err);
    }
  }, []);

  useEffect(() => {
    fetchRockets();
  }, [fetchRockets]);

  return (
    <>
      <CssBaseline />
      <div style={{ width: "100%", margin: 0, padding: 0,backgroundColor: "#444f53"}}>
        <WeatherBanner />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
            padding: "20px",
            bgcolor: "#263238"
          }}
        >
          {rockets.map((rocket) => (
            <RocketCard
              key={rocket.rocket_id}
              telemetry={rocket}
              data={rocketData.find((r) => r.id === rocket.rocket_id)}
              onActionSuccess={fetchRockets}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default App;