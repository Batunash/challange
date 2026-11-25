from telemetry.telemetry import read_telemetry
from state.store import update
from launchsite.client import fetch_rocket
from contextlib import asynccontextmanager
from api.web_socket import wsrouter
from api.launchsite_api import launchrouter
import asyncio
from fastapi  import FastAPI
from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import httpx
from config import BASE_URL
async def watch(host, port):
    async for t in read_telemetry(host, port):
        update(t)
@asynccontextmanager
async def lifespan(app: FastAPI):
    watchers = []
    try:
        rockets = await fetch_rocket(BASE_URL)
    except httpx.HTTPError as e:
        print(f"Launch Site'a ulaşılamadı: {e}")
        rockets = []
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
app.include_router(wsrouter)
app.include_router(launchrouter)
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173"], allow_methods=["*"], allow_headers=["*"])
@app.exception_handler(httpx.HTTPError)
async def launchsite_http_error(req, exc: httpx.HTTPError):
    if isinstance(exc, httpx.HTTPStatusError):
        if exc.response.status_code == 304:
            return JSONResponse(
            status_code = 409,
            content ={"detail":"it's already in this state"}
        )
            
        return JSONResponse(
            status_code = exc.response.status_code,
            content ={"detail":str(exc.response.text)}
        )
    else:
        return JSONResponse(
            status_code = 502,
            content ={"detail":"could not reach to the launch site"}
        )
        
@app.get("/")
async def root():
    return {"statu":"ok"}