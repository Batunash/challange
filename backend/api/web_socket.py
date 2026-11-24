from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from telemetry.telemetry import read_telemetry
router = APIRouter()
@router.WebSocket("/ws")
async def telemetry(WebSocket: WebSocket):
    await websocket.accept()
    while True:
