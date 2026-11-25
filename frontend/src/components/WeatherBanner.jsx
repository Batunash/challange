import React, { useEffect, useState } from "react";
import api from "../hooks/api";

export function WeatherBanner() {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchWeather = () => {
      api.get("/weather")
        .then((r) => setWeatherData(r.data))
        .catch(() => {});
    };
    fetchWeather();
    const interval = setInterval(fetchWeather, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!weatherData) {
    return (
      <div style={{ width: "100%", padding: "12px 16px", borderBottom: "1px solid #ccc", boxSizing: "border-box" }}>
        Weather loading...
      </div>
    );
  }

  const { temperature, humidity, pressure, precipitation, wind, time } = weatherData;

  const activePrecip = [
    precipitation?.rain && "Rain",
    precipitation?.snow && "Snow",
    precipitation?.sleet && "Sleet",
    precipitation?.hail && "Hail",
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px",
        padding: "12px 16px",
        borderBottom: "1px solid #ccc",
      }}
    >
      <div><strong>Temp:</strong> {temperature?.toFixed(1)} °C</div>
      <div><strong>Humidity:</strong> %{(humidity * 100).toFixed(0)}</div>
      <div><strong>Pressure:</strong> {pressure?.toFixed(1)} hPa</div>
      <div>
        <strong>Wind:</strong> {wind?.speed?.toFixed(1)} m/s ({wind?.direction} / {wind?.angle?.toFixed(0)}°)
      </div>
      <div>
        <strong>Precipitation (%{(precipitation?.probability * 100).toFixed(0)}):</strong>{" "}
        {activePrecip || "None"}
      </div>
      <div><strong>Time:</strong> {new Date(time).toLocaleTimeString("tr-TR")}</div>
    </div>
  );
}