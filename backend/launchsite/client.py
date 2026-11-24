import httpx
import asyncio
BASE_URL='http://localhost:5000'
async def fetch_rocket(Baseurl):
    url = Baseurl + '/rockets'
    headers= {"X-API-Key": "API_KEY_1"}
    async with httpx.AsyncClient() as client:
        r = await client.get(url, headers=headers,timeout=3.0)
        r.raise_for_status()
        return r.json()
async def fetch_weather(Baseurl):
    url = Baseurl + '/weather'
    headers= {"X-API-Key": "API_KEY_1"}
    async with httpx.AsyncClient() as client:
        r = await client.get(url, headers=headers,timeout=3.0)
        r.raise_for_status()
        return r.json()
async def launch_rocket(Baseurl,rocket_id):
    url = Baseurl +"/rocket/"+rocket_id+"/status/launched"
    headers= {"X-API-Key": "API_KEY_1"}
    async with httpx.AsyncClient() as client:
        r = await client.put(url, headers=headers,timeout=3.0)
        r.raise_for_status()
        return r.json()
async def deploy_rocket(Baseurl,rocket_id):
    url = Baseurl +"/rocket/"+rocket_id+"/status/deployed"
    headers= {"X-API-Key": "API_KEY_1"}
    async with httpx.AsyncClient() as client:
        r = await client.put(url, headers=headers,timeout=3.0)
        r.raise_for_status()
        return r.json()
async def cancel_launch(Baseurl,rocket_id):
    url = Baseurl +"/rocket/"+rocket_id+"/status/launched"
    headers= {"X-API-Key": "API_KEY_1"}
    async with httpx.AsyncClient() as client:
        r = await client.delete(url, headers=headers,timeout=3.0)
        r.raise_for_status()
        return r.json()
    
async def main():
    #print(await fetch_rocket(BASE_URL))
    #print(await fetch_weather(BASE_URL))
    #print(await launch_rocket(BASE_URL,'9bAWNaUUHz'))
    #print(await deploy_rocket(BASE_URL,'9bAWNaUUHz'))
    #print(await cancel_launch(BASE_URL,'9bAWNaUUHz'))
asyncio.run(main())