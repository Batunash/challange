import asyncio
from .crc16 import crc16_buypass

async def read_soc(HOST,PORT):
        reader, writer = await asyncio.open_connection(HOST, PORT)
        try:
            buffer=bytearray()
            while True:
                chunk = await reader.read(1024)

                if not chunk:
                    break
                buffer.extend(chunk)
                while len(buffer)>= 36: #36 packet size
                    if buffer[0]==0x82 and buffer[35]== 0x80 and int.from_bytes(buffer[33:35],byteorder="big") == crc16_buypass(buffer[:33]):
                        yield bytes(buffer[:36])     # return yerine yield daha verimli returnda her çağrıda yeni bağlantı oluşuyor.
                        del buffer[:36]
                    else:
                        buffer.pop(0)
        finally:
            writer.close()
            await writer.wait_closed()