from fastapi import APIRouter
from launchsite.client import fetch_rocket, fetch_weather, launch_rocket,deploy_rocket,cancel_launch
import asyncio
from config import BASE_URL
launchrouter = APIRouter()
@launchrouter.get("/rockets")
async def fetch_rocket_api():
    res = await fetch_rocket(BASE_URL)
    return res
@launchrouter.get("/weather")
async def fetch_weather_api():
    res = await fetch_weather(BASE_URL)
    return res
@launchrouter.put("/rocket{rocket_id}/status/launched")
async def launch_rocket_api(rocket_id):
    res = await launch_rocket(BASE_URL, rocket_id)
    return res
@launchrouter.put("/rocket{rocket_id}/status/deployed")
async def deploy_rocket_api(rocket_id):
    res = await deploy_rocket(BASE_URL, rocket_id)
    return res
@launchrouter.delete("/rocket{rocket_id}/status/launched")
async def cancel_launch_api(rocket_id):
    res = await cancel_launch(BASE_URL, rocket_id)
    return res
