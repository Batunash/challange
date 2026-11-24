from .read_soc import read_soc 
from  .parse_telemetry import parse_pack 
def read_telemetry(HOST,PORT):
    for packet in read_soc(HOST, PORT):
        print(parse_pack(packet))
