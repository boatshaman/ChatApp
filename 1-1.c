#include <stdio.h>
#include <string.h>
#include <stdlib.h>

struct cell{
char *key;
struct cell *next;
};

struct cell *cons(char *string, struct cell *list){

struct cell *newList;

newList = malloc(sizeof(struct cell));

newList -> next = list;

newList -> key = strdup(string);

return newList;

}


