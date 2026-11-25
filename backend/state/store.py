from dataclasses import asdict
import time 
latest = {}
last_seen ={}
STALE_AFTER = 2.0
def update(t):
    rocket_id = t.rocket_id
    latest[rocket_id] = t
    last_seen[rocket_id] = time.monotonic()
def snapshot():
    result = {}
    for rocket_id, t in latest.items():
        seconds_since_last_packet = time.monotonic()-last_seen[rocket_id]
        connected = seconds_since_last_packet <= STALE_AFTER
        t_as_dict = asdict(t)
        t_as_dict["seconds_since_last_packet"] = seconds_since_last_packet
        t_as_dict["connected"] = connected
        result[rocket_id] = t_as_dict
        

    return result