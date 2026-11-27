import React, { useState, useEffect } from "react";
import api from "../hooks/api";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import SatelliteAltIcon from "@mui/icons-material/SatelliteAlt";
import CancelIcon from "@mui/icons-material/Cancel";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SensorsOutlinedIcon from "@mui/icons-material/SensorsOutlined";
import { blueGrey } from "@mui/material/colors";

const statusColors = {
  launched: "success",
  deployed: "info",
  cancelled: "warning",
  failed: "error",
};

function InfoRow({ label, value }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
      <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
        {label}:
      </Typography>
      {typeof value === "string" || typeof value === "number" ? (
        <Typography
          variant="body2"
          fontWeight="medium"
          textAlign="right"
          sx={{ fontVariantNumeric: "tabular-nums" }}
        >
          {value}
        </Typography>
      ) : (
        value
      )}
    </Stack>
  );
}

export function RocketCard({ telemetry, data, onActionSuccess }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [warningMsg, setWarningMsg] = useState("");
  const [localStatus, setLocalStatus] = useState(data?.status);

  const currentStatus = localStatus?.toLowerCase();

  

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
  } = telemetry || {};

  const altitudeKm = altitude != null ? (altitude / 1000).toFixed(2) : "-";
  const speedKmh = speed != null ? (speed * 3.6).toFixed(1) : "-";
  const accelKmhPerSec = acceleration != null ? (acceleration * 3.6).toFixed(1) : "-";
  const thurstkgn =
    thrust != null
      ? (thrust / 1000).toLocaleString("tr-TR", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })
      : "-";

  async function handleActionError(err, fallbackText) {
    if (err.response?.status === 409) {
      const serverMsg = err.response?.data?.detail || err.response?.data?.message;
      setWarningMsg(serverMsg || fallbackText);
      await onActionSuccess?.();
    } else {
      console.error("Action error:", err);
    }
  }

  async function handleLaunch() {
    if (currentStatus === "launched") {
      setWarningMsg("Rocket is already launched.");
      return;
    }
    if (currentStatus === "deployed") {
      setWarningMsg("Rocket is already deployed, cannot launch again.");
      return;
    }

    setIsUpdating(true);
    try {
      await api.put(`/rocket/${rocket_id}/status/launched`);
      setLocalStatus("launched");
      await onActionSuccess?.();
    } catch (err) {
      await handleActionError(err, "Cannot launch rocket in its current state.");
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDeploy() {
    if (currentStatus === "deployed") {
      setWarningMsg("Rocket is already deployed.");
      return;
    }
    if (currentStatus !== "launched") {
      setWarningMsg("Rocket must be launched before deploying.");
      return;
    }

    setIsUpdating(true);
    try {
      await api.put(`/rocket/${rocket_id}/status/deployed`);
      setLocalStatus("deployed");
      await onActionSuccess?.();
    } catch (err) {
      await handleActionError(err, "Cannot deploy rocket in its current state.");
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleCancelLaunch() {
    if (currentStatus === "deployed") {
      setWarningMsg("Cannot cancel launch after deployment.");
      return;
    }
    if (currentStatus === "cancelled") {
      setWarningMsg("Launch is already cancelled.");
      return;
    }
    if (currentStatus !== "launched") {
      setWarningMsg("There is no active launch to cancel.");
      return;
    }

    setIsUpdating(true);
    try {
      await api.delete(`/rocket/${rocket_id}/status/launched`);
      setLocalStatus("cancelled");
      await onActionSuccess?.();
    } catch (err) {
      await handleActionError(err, "Cannot cancel launch in its current state.");
    } finally {
      setIsUpdating(false);
    }
  }
  const altitudeInKmNumeric = altitude != null ? altitude / 1000 : 0;
  useEffect(() => {
    if (rocket_id === "FvxKSGLkVC" && connected === false && altitudeInKmNumeric >= 48000) {
      setLocalStatus("failed");
    } else {
      setLocalStatus(data?.status);
    }
  }, [data?.status, rocket_id, connected, altitudeInKmNumeric]);
   if (!telemetry) return null;



  return (
    <>
      <Card
        elevation={2}
        sx={{
          borderRadius: 3,
          bgcolor: blueGrey[200],
        }}
      >
        <CardHeader
          sx={{
            bgcolor: blueGrey[100],
          }}
          title={data?.model || rocket_id}
          action={
            <Chip
              label={connected ? "Connected" : "Disconnected"}
              color={connected ? "success" : "error"}
              size="small"
            />
          }
        />
        <Divider />
        <CardContent>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                <InfoOutlinedIcon fontSize="small" color="action" />
                <Typography variant="subtitle1" fontWeight="bold">
                  General Information
                </Typography>
              </Stack>
              <Stack spacing={0.75}>
                <InfoRow label="Id" value={rocket_id} />
                <InfoRow
                  label="Status"
                  value={
                    <Chip
                      label={localStatus || "-"}
                      color={statusColors[currentStatus] || "default"}
                      size="small"
                    />
                  }
                />
                <InfoRow label="Mass" value={`${data?.mass} kg`} />
                <InfoRow label="Payload" value={data?.payload?.description || "-"} />
                <InfoRow label="Payload Mass" value={`${data?.payload?.weight ?? "-"} kg`} />
                <InfoRow label="Launched" value={data?.timestamps?.launched || "-"} />
                <InfoRow label="Deployed" value={data?.timestamps?.deployed || "-"} />
                <InfoRow label="Failed" value={data?.timestamps?.failed || "-"} />
                <InfoRow label="Cancelled" value={data?.timestamps?.cancelled || "-"} />
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }} sx={{ bgcolor: blueGrey[100], p: 2, borderRadius: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                <SensorsOutlinedIcon fontSize="small" color="action" />
                <Typography variant="subtitle1" fontWeight="bold">
                  Telemetry
                </Typography>
              </Stack>
              <Stack spacing={0.75}>
                <InfoRow label="Altitude" value={`${altitudeKm} km`} />
                <InfoRow label="Speed" value={`${speedKmh} km/h`} />
                <InfoRow label="Temp" value={`${temperature} °C`} />
                <InfoRow label="Thrust" value={`${thurstkgn} KgN`} />
                <InfoRow label="Accel" value={`${accelKmhPerSec} km/s²`} />
                <InfoRow label="Pack" value={`#${pack_no}`} />
                <InfoRow label="Last" value={`${(seconds_since_last_packet * 1000).toFixed(1)} ms`} />
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Actions
                </Typography>
              </Stack>
              <Stack direction="column" spacing={2}>
                <Button
                  fullWidth
                  color="success"
                  variant="outlined"
                  disabled={isUpdating}
                  onClick={handleLaunch}
                  startIcon={<RocketLaunchIcon />}
                >
                  launch
                </Button>
                <Button
                  fullWidth
                  color="warning"
                  variant="outlined"
                  disabled={isUpdating}
                  onClick={handleDeploy}
                  startIcon={<SatelliteAltIcon />}
                >
                  deploy
                </Button>
                <Button
                  fullWidth
                  color="error"
                  variant="outlined"
                  disabled={isUpdating}
                  onClick={handleCancelLaunch}
                  startIcon={<CancelIcon />}
                >
                  cancel
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Snackbar
        open={Boolean(warningMsg)}
        autoHideDuration={3000}
        onClose={() => setWarningMsg("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="warning" variant="filled" onClose={() => setWarningMsg("")}>
          {warningMsg}
        </Alert>
      </Snackbar>
    </>
  );
}