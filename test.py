import threading

print("Press Escape to Quit")

# Global variable
data = None

class threadOne(threading.Thread): #I don't understand this or the next line
    def run(self):
        self.setup()

    def setup(self):
        global data
        print('hello world - this is threadOne')

        with lock:
            print('Thread one locked')
            data = "Some value"


class threadTwo(threading.Thread):
    def run(self):
        global data
        print('ran')
        print("Waiting")

        with lock:
            print("Thread two has lock")
            print(data)

lock = threading.Lock()

threadOne().start()
threadTwo().start()
