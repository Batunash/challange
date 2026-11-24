from read_soc import read_soc 
from  parse_telemetry import parse_pack 
HOST = '127.0.0.1'
PORT = 4000
for packet in read_soc(HOST, PORT):
    print(parse_pack(packet))
