from .read_soc import read_soc 
from  .parse_telemetry import parse_pack 
import asyncio
async def read_telemetry(HOST,PORT):
    async for packet in read_soc(HOST, PORT):
        yield  parse_pack(packet)
