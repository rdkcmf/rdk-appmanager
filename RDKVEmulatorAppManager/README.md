# Overview

An RDK-V Emulator App Manager basically focuses on emulating the features such as: remote control unit, RDK services api validation's, testing automation, virtual box manager, application manager etc. and adding many more features to provide support to application developers and testers to make there life easier with new RDK-V Emulator App Manager. It comes in a form of installer package that can be installed on desktop pc and launched along with virtual box.

# Prerequisite

Emulator app manager has been developed and tested on below environment.

# VS Code: Version-1.63.0

Visual Studio Code is a source-code editor made by Microsoft for Windows, Linux and macOS.

# Electron: 13.5.2

Electron (formerly known as Atom Shell) is a free and open-source software framework developed and maintained by GitHub. It allows for the development of desktop GUI applications using web technologies: it combines the Chromium rendering engine and the Node. js runtime.

# Google Chrome: Version 96.0.4664.93 (Official Build) (64-bit)

Google Chrome is a cross-platform web browser developed by Google.

# Node.js: 14.16.0

Node.js is an open-source, cross-platform, back-end JavaScript runtime environment that runs on the V8 engine and executes JavaScript code outside a web browser.

# V8: 9.1.269.39-electron.0

V8 is Google's open source high-performance JavaScript and WebAssembly engine, written in C++. It is used in Chrome and in Node.js, among others.

# OS: Linux x64 5.11.0-41-generic

An operating system is system software that manages computer hardware, software resources, and provides common services for computer programs.

# Oracle Virtual Box: Version 5.2.42_Ubuntu r137960

Oracle VM VirtualBox is cross-platform virtualization software.

# RDKV Emulator Build Steps

Follow below link/steps to build rdkv emulator dunfell image along with rdk services
>>> link will be updated soon

# Source code setup and Run application

Follow below steps to run application on host pc and create installer package

step 1 - get the emulator src code 
$ git clone https://code.rdkcentral.com/r/rdk/devices/intel-x86-pc/emulator/appmanager

step 2 - goto RDKVEmulatorAppManager folder
$ cd RDKVEmulatorAppManager

step 3 - run below command to install dependencies
$ npm install

step 4 - run below command
$ npm run start     

# Create installer package

Follow below steps to create installer package for linux/windows/mac             

Need to install electron-packager and electron-installer-debian globally
$ sudo npm install -g electron-packager
$ sudo npm install -g electron-installer-debian

# Run below commands to make deb file for linux intaller.

$ electron-packager . --platform linux --arch x64 --out dist --overwrite
$ electron-installer-debian --src dist/emulatormanager-linux-x64/ --arch amd64 --config config.json

# Features

* Emulator IP Address Configuration
Developer has to configure the rpi device/emulator ip address, after device ip configuration emulator app manager will be able to communicate with rpi/emulator.

# VM Manager

* Install image: By clicking on install image button developer will get the option to provide instance name, select added image from the list ( or add image by clicking on add image button) and install image into the vm.

* Show installed OS List: By default on launch VM manager installed os list will be display (show installed os list tab will be active), developer can see the list of installed images into the vm on the show installed list screen. 
* Start VM: By clicking on start vm button developer can start the vm.
* Shutdown VM: By clicking on shutdown vm button developer can power off the vm.
* Reboot VM: By clicking on reboot vm button developer can restart/reboot the vm.
* Delete VM instance: By clicking on delete vm instance developer can remove/delete the vm instance.

# App Manager

* Set app url: Developer having the option to set the web based app url and on clicking launch application button app will be launched on emulator.
* Home app url:  Developer has to provide the resident app url running on host machine and by clicking on launch application button default residentapp will be launched on emulator.
* launch ResidentApp: By clicking on launch residentapp button default residentapp will be launched.
* Launch IDE: By clicking on launch ide button developer can launch the pre-configured vs code and do modification in the code after that need to run $ lng dev command and immediately changes will reflect on emulator.

Follow below steps to configure your workspace in VS Code IDE

    * Step1: Launch IDE by navigating and clicking on Launch IDE button
    * Step2: Select your workspace
    * Step3: VS code will be launched along with your workspace, do modification in the code.

* Automate tests option: By clicking on automate tests button developer will get the option to execute the test scripts (pre-configured). On submit selected script will be executed and developer will be able to see the results on emulator.

# Api Manager

* Validate Api: Developer can use this option to validate the plugin api's by selecting api from dropdown and click/select api from the list and click on "Validate Api" button.
* Validate All Api: Developer can use this option to validate the plugin api's by selecting multiple api's from dropdown and click/select api from the list and click on "Validate All Api" button.

# Remote Manager

* Prerequisite: RDK virtual remote should be installed, refer link: https://wiki.rdkcentral.com/display/RDK/RDK-V+Virtual+Remote
* Launch remote: Developer can choose the remote from the available remotes listed in remote manager and on clicking use this button selected remote will be launched on window, as a separate app.

# Help

* Refer RDK central wiki link for the complete documentation on RDKV Emulator app manager:
    * https://wiki.rdkcentral.com/display/RDK/RDK-V+Emulator+manager 

* ElectronJS: For the complete documentation on electronjs please refer link:
    * https://www.electronjs.org

* RDK Services: RDK Services are nothing but the RDK components are implemented as Thunder Nano Services and maintained in RDK Central's. For the complete documentation on RDK Services please refer links:
    * https://wiki.rdkcentral.com/display/RDK/RDK+Services
    * https://github.com/rdkcentral/rdkservices
