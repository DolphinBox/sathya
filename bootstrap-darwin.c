/*
 * Sathya Early Bootstrap
 * for darwin/macOS
 */
#include <stdio.h>
#include <stdlib.h>
#include<unistd.h>

int main() {

    printf("Starting Sathya Runtime...\n");

    char *argv[4];
    argv[0] = "./Runtime/darwin/Contents/Home/bin/node"; // GraalJS Binary (Node implementation in Java)
    argv[1] = "--jvm"; // Start GraalJS in JVM mode to allow access to Java from NodeJS
    argv[2] = "--polyglot";
    argv[3] = "./index.js"; // SathyaServer
    argv[4] = NULL;

    // Switch to the GraalVM Runtime to start Sathya.
    execvp(argv[0], argv);
    return 0;
}