POLY = 0x8005
INIT = 0x0000
def crc16_buypass(data):
    crc = INIT
    for byte in data:
        crc ^= byte << 8
        for _ in range(8):
            top_bit_set = crc & 0x8000
            crc = (crc << 1) & 0xFFFF
            if top_bit_set:
                crc ^= POLY
    return crc