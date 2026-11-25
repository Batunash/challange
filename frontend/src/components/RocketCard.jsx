import React, { useState } from "react";
import api from "../hooks/api";

export function RocketCard({ telemetry, data, onActionSuccess }) {
  const [isUpdating, setIsUpdating] = useState(false);

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

  const altitudeKm = altitude != null ? (altitude / 1000).toFixed(2) : "-";
  const speedKmh = speed != null ? (speed * 3.6).toFixed(1) : "-";
  const accelKmhPerSec = acceleration != null ? (acceleration * 3.6).toFixed(1) : "-";
  const thurstkgn = thrust != null ?(thrust/1000).toFixed(1): "-";
  async function handleLaunch() {
    setIsUpdating(true);
    try {
      await api.put(`/rocket/${rocket_id}/status/launched`);
      await onActionSuccess?.();
    } catch (err) {
      console.error("Launch error:", err);
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleCancelLaunch() {
    setIsUpdating(true);
    try {
      await api.delete(`/rocket/${rocket_id}/status/launched`);
      await onActionSuccess?.();
    } catch (err) {
      console.error("Cancel launch error:", err);
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDeploy() {
    setIsUpdating(true);
    try {
      await api.put(`/rocket/${rocket_id}/status/deployed`);
      await onActionSuccess?.();
    } catch (err) {
      console.error("Deploy error:", err);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div style={{ border: "1px solid #ccc", padding: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
        <strong>{data?.model || rocket_id}</strong>
        <span>{connected ? "connected" : "disconnected"}</span>
      </div>

      <div style={{ display: "flex", gap: "16px" }}>
        <div style={{ flex: 1 }}>
          <h4>General Information</h4>
          <div>Id: {rocket_id}</div>
          <div>Status: {data?.status || "-"}</div>
          <div>Mass: {data?.mass} kg</div>
          <div>Payload: {data?.payload?.description || "-"}</div>
          <div>Payload Mass: {data?.payload?.weight} kg</div>
          <div>Launched: {data?.timestamps?.launched || "-"}</div>
          <div>Deployed: {data?.timestamps?.deployed || "-"}</div>
          <div>Failed: {data?.timestamps?.failed || "-"}</div>
          <div>Cancelled: {data?.timestamps?.cancelled || "-"}</div>
        </div>

        <div style={{ flex: 1 }}>
          <h4>Telemetry</h4>
          <div>Altitude: {altitudeKm} km</div>
          <div>Speed: {speedKmh} km/h</div>
          <div>Accel: {accelKmhPerSec} km/s²</div>
          <div>Thrust: {thurstkgn?.toLocaleString("tr-TR")} KgN</div>
          <div>Temp: {temperature} °C</div>
          <div>Pack: #{pack_no}</div>
          <div>Last: {(seconds_since_last_packet * 1000).toFixed(1)} ms</div>
        </div>

        <div style={{ flex: 1 }}>
          <h4>Actions</h4>
          <div>
            <button disabled={isUpdating} onClick={handleLaunch}>
              launch
            </button>
          </div>
          <div>
            <button disabled={isUpdating} onClick={handleDeploy}>
              deploy
            </button>
          </div>
          <div>
            <button disabled={isUpdating} onClick={handleCancelLaunch}>
              cancel launch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}