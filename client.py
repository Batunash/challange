import socket
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
    data=data.hex(' ').upper()
    print(data)
    
data=read_soc(HOST,PORT)
for packet in read_soc(HOST, PORT):
    parse_pack(packet)