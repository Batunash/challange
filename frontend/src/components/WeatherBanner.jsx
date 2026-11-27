import React, { useEffect, useState } from "react";
import api from "../hooks/api";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import { blueGrey } from "@mui/material/colors";

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
      <Stack sx={{ width: "100%", padding: "12px 16px", borderBottom: "1px solid #ccc", boxSizing: "border-box" }}>
        <Typography
          variant="body2"
          fontWeight="medium"
          textAlign="right"
        >
        Weather loading...
        </Typography>
      </Stack>
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
    <Stack
      sx={{
        width: "100%",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px",
        bgcolor: blueGrey[200],
        padding: "12px 16px",
      }}
      direction="row"
      divider={<Divider orientation="vertical" flexItem />}
      spacing={2}
    >
      <Typography variant="subtitle1" fontWeight="bold">
                  Temp: {temperature?.toFixed(1)} °C
      </Typography>
      <Typography variant="subtitle1" fontWeight="bold">
                  Humidity: %{(humidity * 100).toFixed(0)}
      </Typography>
      <Typography variant="subtitle1" fontWeight="bold">
                  Pressure: {pressure?.toFixed(1)} hPa
      </Typography>
      <Typography variant="subtitle1" fontWeight="bold">
                  Wind: {wind?.speed?.toFixed(1)} m/s ({wind?.direction} / {wind?.angle?.toFixed(0)}°)
      </Typography>
      <Typography variant="subtitle1" fontWeight="bold">
                  Precipitation: (%{(precipitation?.probability * 100).toFixed(0)})
      </Typography>
      <Stack alignItems="center" direction="row" gap={4}>
        <AccessTimeOutlinedIcon />
        <Typography variant="subtitle1" fontWeight="bold">
                    Time: {new Date(time).toLocaleTimeString("tr-TR")}
        </Typography>
      </Stack >
    </Stack>
  );
}