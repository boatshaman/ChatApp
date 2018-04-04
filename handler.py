import json


class handler():
    users = []
    success_status = "HTTP/1.1 200 OK \n\n"
    tkn_status = "HTTP/1.1 403 TKN \n\n"

    def add_name(self, name):
        if name in self.users:
            response = tkn_status
            return response
        else:
            response = success_status
            response += {"status": "success", "online": users}
            users.append(name)
            return response


    def handle(self, data):
        data = json.loads(data)
        if(data["code"]=="JOIN"):
            return self.add_name(data["new_user"])


   # $("#submit").click(function(e) {
   #        $.post("/", {"code": "JOIN", "new_user":$("input").val()})

   #        });
