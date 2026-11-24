import struct
from dataclasses import dataclass
@dataclass(frozen= True)
class Telemetry:
    rocket_id : str
    pack_no: int
    altitude : float
    speed : float
    acceleration : float
    thrust : float
    temperature : float
def parse_pack(valid_data):
    data=valid_data
    rocket_id= data[1:11].decode("ascii")
    pack_no = data[11]
    altitude = struct.unpack('>f',data[13:17])[0]
    speed = struct.unpack('>f',data[17:21])[0]
    acceleration = struct.unpack('>f',data[21:25])[0]
    thrust = struct.unpack('>f',data[25:29])[0]
    temperature  = struct.unpack('>f',data[29:33])[0]
    return Telemetry(rocket_id,pack_no,altitude,speed,acceleration,thrust,temperature)
