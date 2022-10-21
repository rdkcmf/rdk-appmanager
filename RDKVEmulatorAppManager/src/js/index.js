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

let _host_ip;
let emulator_ip = document.getElementById("emv_ip").value;
let _os_list = [];
let _vmdk_list = [];
let _api_method = [];
let _keyinput = []; 
let ip_timer=null;
let _keyinput_index = 0;
let all_api_request_index =0;
let all_api_request_timer=null;
let control_key=false;
const _DEFAULT_IMAGE = 'RDK';

//All global should be start with _underscore 
