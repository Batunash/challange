from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from launchsite.client import *
import asyncio
BASE_URL='http://localhost:5000'
launchrouter = APIRouter()
@launchrouter.get("/rockets")
async def fetch_rocket_api():
    data = await fetch_rocket(BASE_URL)
    return JSONResponse(content=jsonable_encoder(data))