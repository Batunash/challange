from telemetry.telemetry import read_telemetry
from state.store import update, snapshot
from launchsite.client import fetch_rocket
from contextlib import asynccontextmanager
import asyncio
from fastapi  import FastAPI
BASE_URL='http://localhost:5000'

async def watch(host, port):
    async for t in read_telemetry(host, port):
        update(t)
@asynccontextmanager
async def lifespan(app: FastAPI):
    watchers = []
    rockets = await fetch_rocket(BASE_URL)
    for rocket in rockets:
        host = rocket["telemetry"]["host"]
        port = rocket["telemetry"]["port"]
        if host == '0.0.0.0':
            host ='127.0.0.1'
        watchers.append(asyncio.create_task(watch(host, port)))     
    yield 
    for watcher in watchers:
        watcher.cancel()
app = FastAPI(lifespan=lifespan)        
