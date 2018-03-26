#include <stdio.h>
#include <stdlib.h>

struct cell{
char *key;
struct cell *next;
};

void print_list(struct cell *list){
if(list == NULL){
printf("List is emtpty \n ");
return;
}

while(list != NULL){
char *currC;
currC = list -> key;
while(currC!='/0'){
printf(currC);
currC = &currC[1];
}
printf('\n');
list = list -> next;

}
return;


}
