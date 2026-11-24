from fastapi import FastAPI, WebSocket
from telemetry.telemetry import read_telemetry
app = FastAPI()
HOST = '127.0.0.1'
@app.WebSocket("/ws")
async def telemetry(WebSocket: WebSocket):
    await websocket.accept()
    while True:
        PORT = await websocket.receive_text()
        data = await read_telemetry(HOST,PORT)
        await websocket.send_text(data)