import socket
import struct
HOST = '127.0.0.1'
PORT = 4000
def read_soc(HOST,PORT):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.connect((HOST, PORT))
            while True:
                data = s.recv(1024)
                if not data:
                    break
                yield data # return yerine yield daha verimli returnda her çağrıda yeni bağlantı oluşuyor.
def parse_pack(data):
    data=data.hex(' ').upper().split()
    id=parse_id(data)
    altitude=parse_altitude(data)    
    print(altitude)

def parse_id(data):
    res = "".join(chr(int(x, 16)) for x in data[1:11])
    return res

def parse_altitude(data):
    hex_str = " ".join(data[13:17])
    hex_str = hex_str.strip().replace("0x", "")
    byte_array = bytes.fromhex(hex_str)
    float_num = struct.unpack('!f', byte_array)[0]
    return float_num
data=read_soc(HOST,PORT)
for packet in read_soc(HOST, PORT):
    parse_pack(packet)