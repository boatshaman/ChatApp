import socket
import json
import threading
from handler import handler

class Server():
    users = {}
    hand = handler()

    def __init__(self, host, port):
        self.host = host
        self.port = port
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.sock.bind((self.host, self.port))

    def ready(self):
        self.sock.listen(5)
        while True:
            c, addr = self.sock.accept()
            threading.Thread(target = self.listenToClient,args = (c,addr)).start()

    def listenToClient(self, client, address):
        size = 1024
        while True:
            try:
                data = client.recv(size)
                if data:
                    # Set the response to echo back the recieved data
                    response = hand.handle()
                    client.send(response)
                else:
                    raise error('Client disconnected')
            except:
                client.close()
                return False
