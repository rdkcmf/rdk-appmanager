# RDK-V Virtual Remote

# Overview
This application demonstrates the UI for the RDK-V Virtual Remote. The application starts with all the RCU keys present in physical RDK remote. After application launch, a RDK-V Virtual Remote screen is displayed which mainly contains virtual keys same as RCU keys present in physical rdk remote. A input text box will be displayed in bottom, above the RDK logo.

Note: Few RCU keys are not implemented in physical RDK remote, same keys will not work in RDK-V Virtual Remote.  

# Prerequisite
RDK-V Virtual Remote has been developed and tested on below environment.

# VS Code: Version-1.63.0
Visual Studio Code is a source-code editor made by Microsoft for Windows, Linux and macOS.

# Electron: 13.5.2
Electron (formerly known as Atom Shell) is a free and open-source software framework developed and maintained by GitHub. It allows for the development of desktop GUI applications using web technologies: it combines the Chromium rendering engine and the Node. js runtime.

# Google Chrome: Version 96.0.4664.93 (Official Build) (64-bit)
Google Chrome is a cross-platform web browser developed by Google.

# Node.js: 14.16.0 or Above
Node.js is an open-source, cross-platform, back-end JavaScript runtime environment that runs on the V8 engine and executes JavaScript code outside a web browser.

# V8: 9.1.269.39-electron.0
V8 is Google's open source high-performance JavaScript and WebAssembly engine, written in C++. It is used in Chrome and in Node.js, among others.

# OS: Linux x64 5.11.0-41-generic
An operating system is system software that manages computer hardware, software resources, and provides common services for computer programs.

# Source code setup and Run application
Follow below steps to run application on host pc 

step 1 - git clone "https://code.rdkcentral.com/r/rdk/devices/intel-x86-pc/emulator/appmanager"

step 2 - cd RDKVirtualRemote then run below command
$ npm install

step 3 - run below command
$ npm run start     

# Create installer package
Follow below steps to create installer package for linux 

## For Linux

# Use node version v14.18.1 or above

    $ nvm use v14.18.1 

# Need to install electron-packager and electron-installer-debian globally if not installed in your PC

    $ sudo npm install -g electron-packager
    $ sudo npm install -g electron-installer-debian

# Run below commands to make deb file for linux installer

    $ electron-packager .  --platform linux --arch x64 --out dist --overwrite
    $ electron-installer-debian --src dist/rdkv-virtual-remote-linux-x64/ --arch amd64 --config config.json
# Features

* Target Device IP Address Configuration
- Developer has to configure the rpi device/emulator ip address, after device ip configuration virtual remote will be able to communicate with rpi/emulator.
- On focus button (rcu key) will be highlighted.

# Supported RCU keys

- Currently following listed rcu keys are working UP/Down/OK /Home /Mute and Backsapce. 

# Resources

  For the complete documentation on electronjs refer link: 
  * https://www.electronjs.org/.

  For the complete documentation on RDK-V virtual remote, refer link: 
  * https://wiki.rdkcentral.com/display/RDK/RDK-V+Virtual+Remote