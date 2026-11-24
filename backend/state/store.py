from dataclasses import asdict
latest = {}
def update(t):
    rocket_id = t.rocket_id
    latest[rocket_id] = t
def snapshot():
    result = {}
    for rocket_id, t in latest.items():
        t_as_dict = asdict(t)
        result[rocket_id] = t_as_dict
    return result