S_ALONE = 0
S_TALKING = 1

#==============================================================================
# Group class:
# member fields:
#   - An array of items, each a Member class
#   - A dictionary that keeps who is a chat group
# member functions:
#    - join: first time in
#    - leave: leave the system, and the group
#    - list_my_peers: who is in chatting with me?
#    - list_all: who is in the system, and the chat groups
#    - connect: connect to a peer in a chat group, and become part of the group
#    - disconnect: leave the chat group but stay in the system
#==============================================================================

class Group:

    def __init__(self):
        self.members = {}
        self.chat_grps = {}
        self.grp_ever = 0

    def join(self, name):
        self.members[name] = S_ALONE
        return


    def is_member(self, name):
        return name in self.members.keys()



    def find_group(self, name):
        found = False
        group_key = 0
        for k in self.chat_grps:
            if name in self.chat_grps[k]:
                found = True
                group_key = k
                break
        return found, group_key


    def connect(self, me, peer):
        #if peer is in a group, join it
        peer_in_group, group_key = self.find_group(peer)
        if peer_in_group:
            print(peer, "is talking already, connect!")
            if me not in self.chat_grps[group_key]:
                self.chat_grps[group_key].append(me)
                self.members[me] = S_TALKING
        else:
            print(peer, "is idle as well")
            self.grp_ever += 1
            self.chat_grps[self.grp_ever] = [me, peer]
            self.members[me] = S_TALKING
            self.members[peer] = S_TALKING

        return


    def leave(self, name):
        self.disconnect(name)
        del self.members[name]
        return


    def disconnect(self, me):
        # find myself in the group, quit
        in_group, group_key = self.find_group(me)
        if in_group == True:
            self.chat_grps[group_key].remove(me)
            self.members[me] = S_ALONE
            # peer may be the only one left as well... handle this case
            if len(self.chat_grps[group_key]) == 1:
                peer = self.chat_grps[group_key].pop()
                self.members[peer] = S_ALONE
                del self.chat_grps[group_key]
        return

    def list_all(self):

        full_list = "Users: ------------" + "\n"
        full_list += str(self.members) + "\n"
        full_list += "Groups: -----------" + "\n"
        full_list += str(self.chat_grps) + "\n"
        return full_list

    def list_me(self, me):
        # return a list, "me" followed by other peers in my group
        my_list = [me]
        in_group, group_key = self.find_group(me)
        if in_group:
            [my_list.append(member) for member in \
             self.chat_grps[group_key] if member != me]
        return my_list
