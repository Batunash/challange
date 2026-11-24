import socket
from crc16 import crc16_buypass

def read_soc(HOST,PORT):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.connect((HOST, PORT))
            buffer=bytearray()
            while True:
                chunk = s.recv(1024)
                if not chunk:
                    break
                buffer.extend(chunk)
                while len(buffer)>= 36: #36 packet size
                    if buffer[0]==0x82 and buffer[35]== 0x80 and int.from_bytes(buffer[33:35],byteorder="big") == crc16_buypass(buffer[:33]):
                        yield bytes(buffer[:36])     # return yerine yield daha verimli returnda her çağrıda yeni bağlantı oluşuyor.
                        del buffer[:36]
                    else:
                        buffer.pop(0)