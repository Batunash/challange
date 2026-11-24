from telemetry.telemetry import read_telemetry 
import asyncio
async def main():
    HOST='127.0.0.1'
    PORT=4000
    async for t in read_telemetry(HOST,PORT):
        print(t)

asyncio.run(main())