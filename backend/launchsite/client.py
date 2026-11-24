import httpx
from httpx_retries import RetryTransport, Retry
import asyncio
BASE_URL='http://localhost:5000'
async def fetch_rocket(Baseurl):
    url = Baseurl + '/rockets'
    headers= {"X-API-Key": "API_KEY_1"}
    retry= Retry(total=5)
    transport=RetryTransport(retry=retry)
    async with httpx.AsyncClient(transport=transport) as client:
        r = await client.get(url, headers=headers,timeout=3.0)
        try:
            r.raise_for_status()
        except httpx.HTTPStatusError as exc:
            print(f"Error response {exc.response.status_code} while requesting {exc.request.url!r}.")   
            return None         
        return r.json()
async def fetch_weather(Baseurl):
    url = Baseurl + '/weather'
    headers= {"X-API-Key": "API_KEY_1"}
    retry= Retry(total=5)
    transport=RetryTransport(retry=retry)
    async with httpx.AsyncClient(transport=transport) as client:
        r = await client.get(url, headers=headers,timeout=3.0)
        try:
            r.raise_for_status()
        except httpx.HTTPStatusError as exc:
            print(f"Error response {exc.response.status_code} while requesting {exc.request.url!r}.")    
            return None                   
        return r.json()
async def launch_rocket(Baseurl,rocket_id):
    url = Baseurl +"/rocket/"+rocket_id+"/status/launched"
    headers= {"X-API-Key": "API_KEY_1"}
    retry= Retry(total=5)
    transport=RetryTransport(retry=retry)
    async with httpx.AsyncClient(transport=transport) as client:
        r = await client.put(url, headers=headers,timeout=3.0)
        try:
            r.raise_for_status()
        except httpx.HTTPStatusError as exc:
            print(f"Error response {exc.response.status_code} while requesting {exc.request.url!r}.") 
            return None           
        return r.json()
async def deploy_rocket(Baseurl,rocket_id):
    url = Baseurl +"/rocket/"+rocket_id+"/status/deployed"
    headers= {"X-API-Key": "API_KEY_1"}
    retry= Retry(total=5)
    transport=RetryTransport(retry=retry)
    async with httpx.AsyncClient(transport=transport) as client:
        r = await client.put(url, headers=headers,timeout=3.0)
        try:
            r.raise_for_status()
        except httpx.HTTPStatusError as exc:
            print(f"Error response {exc.response.status_code} while requesting {exc.request.url!r}.")  
            return None                     
        return r.json()
async def cancel_launch(Baseurl,rocket_id):
    url = Baseurl +"/rocket/"+rocket_id+"/status/launched"
    headers= {"X-API-Key": "API_KEY_1"}
    retry= Retry(total=5)
    transport=RetryTransport(retry=retry)
    async with httpx.AsyncClient(transport=transport) as client:
        r = await client.delete(url, headers=headers,timeout=3.0)
        try:
            r.raise_for_status()
        except httpx.HTTPStatusError as exc:
            print(f"Error response {exc.response.status_code} while requesting {exc.request.url!r}.")            
            return None           
        return r.json()
    
#async def main():
    #while True:
    #    print(await fetch_rocket(BASE_URL))
    #    print(await fetch_weather(BASE_URL))
    #    print(await launch_rocket(BASE_URL,'9bAWNaUUHz'))
    #    print(await deploy_rocket(BASE_URL,'9bAWNaUUHz')) #cant canel after a deploy
    #    print(await cancel_launch(BASE_URL,'9bAWNaUUHz'))
#asyncio.run(main())