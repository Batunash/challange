import httpx
from httpx_retries import RetryTransport, Retry
import asyncio
from config import API_KEY
HEADERS = {"X-API-Key": API_KEY}
RETRY = Retry(total=5)
TRANSPORT = RetryTransport(retry=RETRY)
async def fetch_rocket(Baseurl):
    url = Baseurl + '/rockets'
    async with httpx.AsyncClient(transport=TRANSPORT) as client:
        r = await client.get(url, headers=HEADERS,timeout=3.0)
        r.raise_for_status()
        return r.json()
async def fetch_weather(Baseurl):
    url = Baseurl + '/weather'
    async with httpx.AsyncClient(transport=TRANSPORT) as client:
        r = await client.get(url, headers=HEADERS,timeout=3.0)
        r.raise_for_status()
        return r.json()
    
async def launch_rocket(Baseurl,rocket_id):
    url = Baseurl +"/rocket/"+rocket_id+"/status/launched"
    async with httpx.AsyncClient(transport=TRANSPORT) as client:
        r = await client.put(url, headers=HEADERS,timeout=3.0)
        r.raise_for_status()
        return r.json()
async def deploy_rocket(Baseurl,rocket_id):
    url = Baseurl +"/rocket/"+rocket_id+"/status/deployed"
    async with httpx.AsyncClient(transport=TRANSPORT) as client:
        r = await client.put(url, headers=HEADERS,timeout=3.0)
        r.raise_for_status()
        return r.json()
async def cancel_launch(Baseurl,rocket_id):
    url = Baseurl +"/rocket/"+rocket_id+"/status/launched"
    async with httpx.AsyncClient(transport=TRANSPORT) as client:
        r = await client.delete(url, headers=HEADERS,timeout=3.0)
        r.raise_for_status()
        return r.json()
    
#async def main():
    #while True:
    #    print(await fetch_rocket(BASE_URL))
    #    print(await fetch_weather(BASE_URL))
    #    print(await launch_rocket(BASE_URL,'9bAWNaUUHz'))
    #    print(await deploy_rocket(BASE_URL,'9bAWNaUUHz')) #cant canel after a deploy
    #    print(await cancel_launch(BASE_URL,'9bAWNaUUHz'))
#asyncio.run(main())