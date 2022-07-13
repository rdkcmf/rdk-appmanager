/**
 * If not stated otherwise in this file or this component's LICENSE
 * file the following copyright and licenses apply:
 *
 * Copyright 2022 RDK Management
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

const {app, BrowserWindow} = require('electron') 
const path = require('path')  
const electron = require("electron");
const ipc = electron.ipcMain;
let window;

//application window will move based on key Navigation.
ipc.on('screenMove', function(event, arg) {
   let pos = window.getBounds();
   if(arg=="RIGHT"){
      window.setBounds({ x: (pos.x+20) })
   }else if(arg=="LEFT"){
      window.setBounds({ x: (pos.x-20) })
   }else if(arg=="UP"){
      window.setBounds({ y: (pos.y-20) })
   }else if(arg=="DOWN"){
      window.setBounds({ y: (pos.y+20) })
   }
});

//create application window 
function createWindow() { 
    
   let iconPath = path.resolve(__dirname, `./assets/icon.png`)

   window = new BrowserWindow({
      width: 290,
      height: 570,
      frame: false,
      transparent: true,
      resizable: false,
      maximizable: false,
      show: true,
      x: 1000,
      y: 100,
      icon: iconPath,
      webPreferences: {
         nodeIntegration: true,
         contextIsolation: false,
         enableRemoteModule: false,
      }
   });

   window.loadFile(path.join(__dirname, 'index.html'))
   
}

app.on('ready', () => {
  createWindow()
});



