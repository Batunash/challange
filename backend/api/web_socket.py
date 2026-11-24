from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from state.store import snapshot
import asyncio
wsrouter = APIRouter()
@wsrouter.websocket("/ws")
async def telemetry(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            await websocket.send_json(snapshot())
            await asyncio.sleep(0.2)
    except WebSocketDisconnect:
        pass
        
