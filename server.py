#!/usr/bin/env python3
import sys, os, socket, json, chat_group, time
from socketserver import ThreadingMixIn
from http.server import SimpleHTTPRequestHandler, HTTPServer
from random import *

HOST = socket.gethostname()
users = []
logged_msgs = {}
g = chat_group.Group()
codes = {'%20':' ', '%22':'"', '%23':'#', '%24':'$', '%25':'%', '%26':'&'}
activityLog = {}

class RequestHandler(SimpleHTTPRequestHandler):


    def do_POST(self):
        length = int(self.headers['Content-Length'])
        dat = self.rfile.read(length)
        data = self.dictize(dat)
        print(data)
        for x, y in data.items():
            print(x+":"+y)
        if('u-name' in data.keys()):
            self.do_UNAME(data['u-name'])
        elif ('join' in data.keys()):
            self.do_JOIN(data['name'], data['join'])
        elif ('msg' in data.keys()):
            self.do_MSG(data['name'], data['msg'])


        return

    def do_UNAME(self, name):
        while name in users:
            name = name + str(randint(0, 9))

        self.send_response(200)
        self.send_header('Content-type','application/json')
        self.end_headers()
        d = {'username':name, 'peers':users}
        self.wfile.write(json.dumps(d).encode())
        users.append(name)
        self.username = name
        logged_msgs[name] = []
        g.join(name)
        return



    def do_JOIN(self, name, peer):
        if(len(g.list_me(name))!=1):
            logged_msgs[name].append('<tr><td height="50px"><p class="peerMsg"> You are already in chat group! Close window and reopen to change group.</p></td></tr>')
            return
        #send back list of all peers connected to

        g.connect(name, peer)
        peers = g.list_me(name)[1:]
        for p in peers:
            logged_msgs[p].append('<tr><td height="50px"><p class="peerMsg">'+ name + ' has joined the chat</p></td></tr>')
            logged_msgs[name].append('<tr><td height="50px"><p class="peerMsg"> You are now connected to '+ p+'</p></td></tr>')
        self.send_response(200)
        self.send_header('Content-type','applictation/json')
        self.end_headers()
        d = {'members':peers}
        self.wfile.write(json.dumps(d).encode()) # sends {'members':[peer1, peer2, ....]} of the ones connected in same group


    def do_MSG(self, name, msg):
        peers = g.list_me(name)[1:]
        for p in peers:
            logged_msgs[p].append('<tr><td height="50px"><p class="peerMsg">'+name+' : '+ msg+'</p></td></tr>')
        logged_msgs[name].append('<tr><td height="50px"><p class="selfMsg"> me: ' + msg+'</p></td></tr>')



    def do_GET(self): #{'messages':[['kyle', 'hey man what's up], ['JOIN', 'denz has joined the chat'],['joe','nothin much homie, wassup my dog DENZ']], 'users':['joe', 'kyle','god']}
        if(self.path[:8] == '/update/'):
            q_mark = self.path.find('?')
            amper = self.path.find('&')
            name = self.path[q_mark+1:amper]
            if(name in users):
                activityLog[name] = time.time() #log the users time
                tempUsr = users[:]
                tempUsr.remove(name)
                response = {'flags':'online','messages':logged_msgs[name], 'users':tempUsr}
                logged_msgs[name] = []
            else:
                response = {'flags':'loggedOut'}

            response = json.dumps(response).encode()
            self.send_response(200)
            self.send_header("Content-type", 'applictation/json')
            self.send_header("Content-length", len(response))
            self.end_headers()
            self.wfile.write(response)
        else:
            super().do_GET()


    def dictize(self, data):
        dataList = data.decode().split('&')
        dic = {}
        for elem in dataList:
            for y in range(elem.count('%')):
                x = elem.find('%')

                elem = elem.replace(elem[x:x+3], codes[elem[x:x+3]])

            temp = elem.split('=')
            dic[temp[0]] = temp[1]
        return dic

class ThreadingSimpleServer(ThreadingMixIn, HTTPServer):
    pass

def LOGOUT(name):
    print(name + "is logging out!!")
    if(name not in users):
        return

    peers = g.list_me(name)[1:]
    g.leave(name)
    for p in peers:
        pList = g.list_me(p)[1:]
        if(len(pList)==0):
            logged_msgs[p].append('<tr><td height="50px"><p class="peerMsg">'+name+' has logged off. You are free to connect to others.</p></td><tr>')
        else:
            logged_msgs[p].append('<tr><td height="50px"><p class="peerMsg">'+name+' has logged off. You are still connect to: '+(', '.join(pList))+'</p></td><tr>')

    users.remove(name)

def manageActive():
    delUsers = []
    tempActivLog = dict(activityLog)
    for k, v in tempActivLog.items():
        tim = time.time() - v

        if(tim > 5):
            LOGOUT(k)
            delUsers.append(k)
    for u in delUsers:
        del activityLog[u]


'''
This sets the listening port, default port 8080
'''
if sys.argv[1:]:
    PORT = int(sys.argv[1])
else:
    PORT = 8080

'''
This sets the working directory of the HTTPServer, defaults to directory where script is executed.
'''
if sys.argv[2:]:
    os.chdir(sys.argv[2])
    CWD = sys.argv[2]
else:
    CWD = os.getcwd()

server = ThreadingSimpleServer(('0.0.0.0', PORT), RequestHandler)
print("Serving HTTP traffic from", CWD, "on", HOST, "using port", PORT)
try:
    while 1:
        sys.stdout.flush()
        server.handle_request()
        manageActive()

except KeyboardInterrupt:
    print("\nShutting down server per users request.")
