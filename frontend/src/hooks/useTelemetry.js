import { useEffect, useState } from "react";

export function useTelemetry(url) {
  const [telemetry, settelemetry] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!url) return;

    const ws = new WebSocket(url);

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        settelemetry(parsedData);
      } catch {
        settelemetry(event.data);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      if (ws.readyState === WebSocket.OPEN) {
        console.error("WebSocket hatası:", error);
      }
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [url]);

  return { telemetry, isConnected };
}