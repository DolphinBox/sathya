#!/bin/bash
echo "Installing dependencies for Sathya..."
echo "This script requires access to the internet."

if ! [ -x "$(command -v node)" ]; then
  echo 'Error: node is not installed.' >&2
  exit 1
fi

# Download the Graal Runtime
echo "Downloading the GraalVM Runtime..."
mkdir Runtime
cd Runtime

if [[ "$OSTYPE" == "linux-gnu" ]]; then
        echo "Detected Platform Linux"
        wget https://github.com/oracle/graal/releases/download/vm-19.1.0/graalvm-ce-linux-amd64-19.1.0.tar.gz
        tar -xvf graalvm-ce-linux-amd64-19.1.0.tar.gz
        rm graalvm-ce-linux-amd64-19.1.0.tar.gz
        rm -rf linux
        mv graalvm-ce-19.1.0 linux
        cd ../
        #export PATH="$PWD/Runtime/linux/bin:$PATH" # Use the Graal Node and NPM
elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "Detected Platform macOS"
        wget https://github.com/oracle/graal/releases/download/vm-19.1.0/graalvm-ce-darwin-amd64-19.1.0.tar.gz
        tar -xvf graalvm-ce-darwin-amd64-19.1.0.tar.gz
        rm graalvm-ce-darwin-amd64-19.1.0.tar.gz
        rm -rf darwin
        mv graalvm-ce-19.1.0 darwin
        cd ../
        #export PATH="$PWD/Runtime/darwin/Contents/Home/bin:$PATH" # Use the Graal Node and NPM
else
        echo "Unknown/Unsupported OS Type."
        exit 1
fi

# Root Directory (main Sathya node modules)
echo "Installing Main NPM dependencies..."
npm install

# WebUI Dependencies
echo "Installing WebUI Module dependencies..."
cd Modules/WebUI
npm install
echo "Installing WebUI React dependencies..."
cd sathya-ui
npm install
echo "Building the ReactUI..."
npm run-script build

# Back to root
cd ../../../

echo "Done!"
echo "To start Sathya use ./bootstrap-linux for Linux and ./bootstrap-darwin for macOS"
