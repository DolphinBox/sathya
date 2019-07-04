# SathyaServer
SathyaServer is a server framework. It is comprised of modules, such as a web server, file server, group policy, etc.

**SathyaServer is still under development. Expect breaking changes!** 
> Once SathyaServer has reached a "initial feature-complete" stage, backwards compatibility between versions will be a priority.

## Running (Linux/macOS)
> Make sure you have NodeJS/NPM installed. This is only a requirement to run the installDepends script. SathyaServer itself will use the bundled Graal runtime.

After cloning the repo install all the dependencies:
```bash
./installDepends.sh
```
This will download GraalVM, install all the node modules, build things, etc.

Then, to start SathyaServer on Linux:
```bash
./bootstrap-linux
```
and on macOS:
```bash
./bootstrap-darwin
```

## Developing Modules
See "Developing_Modules.md" in the docs folder.
