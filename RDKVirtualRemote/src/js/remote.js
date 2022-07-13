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

const ipc = require('electron').ipcRenderer;
let emulator_ip = ""
let emv_ip_input = document.getElementById("emv_ip");
let controlDown;

//the remote key value sending to target device
function apiRequest(requestData){
    let url = "http://"+emulator_ip+":9998/jsonrpc";
   
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                resolve(this.responseText);
            }
        });

        xhr.open("POST", url);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.send(requestData);
    });
  }

  //Api request will create based on remote key down.
function keyrequest(keyName) {
    let keyCode = {
        'OK': 13,
        'LEFT': 37,
        'RIGHT': 39,
        'UP': 38,
        'DOWN': 40,
        'HOME': 27,
        'BACK': 8,
        'MIC': 37,
        'POWER_KEY': 112
    }

    let data = JSON.stringify({
        "jsonrpc": "2.0",
        "id": 3,
        "method": "org.rdk.RDKShell.1.generateKey",
        "params": {
            "keys": [{
                "keyCode": keyCode[keyName],
                "modifiers": [],
                "delay": 0.3
            }]
        }
    });

    apiRequest(data).then(function (res) { }).catch(function (err) { });
}


//target device ip value assigned into "emulator_ip" variable 
//when keyboard enter. 
emv_ip_input.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        emulator_ip = event.target.value;
    }
  
});

document.addEventListener('keyup', function (e) {
    if ((e.code == 'ControlLeft' || e.code == 'ControlRight')) {
        controlDown =false
    }
})

// send the key value to screenMove method for screen moving 
document.addEventListener('keydown', function (e) {

    if ((e.code == 'ControlLeft' || e.code == 'ControlRight')) {
        controlDown =true
    }

    if(controlDown){
    if (e.key == 'ArrowRight') {
        ipc.send('screenMove', "RIGHT");
    } else if (e.key == 'ArrowLeft') {
        ipc.send('screenMove', "LEFT");
    } else if (e.key == 'ArrowUp') {
        ipc.send('screenMove', "UP");
    } else if (e.key == 'ArrowDown') {
        ipc.send('screenMove', "DOWN");
    }
   }

});