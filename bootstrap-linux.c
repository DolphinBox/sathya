/*
 * Sathya Early Bootstrap
 * for Linux
 */
#include <stdio.h>
#include <stdlib.h>
#include<unistd.h>

int main() {

    printf("Starting Sathya Runtime...\n");

    char *argv[4];
    argv[0] = "./Runtime/linux/bin/node"; // GraalJS Binary (Node implementation in Java)
    argv[1] = "--jvm"; // Start GraalJS in JVM mode to allow access to Java from NodeJS
    argv[2] = "./index.js"; // SathyaServer
    argv[3] = NULL;

    // Switch to the GraalVM Runtime to start Sathya.
    execvp(argv[0], argv);
    return 0;
}