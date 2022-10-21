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

function hostip() {
    ipc.send('host_ip');
}

function createVMLiist(arg) {
    let div = document.createElement("div");
    let id_name = arg.id;
    let vm_name = arg.vm_name;
    let inhtml = '<input type="radio" id="' + id_name + '"name="vmlist" value=' + vm_name + '>';
    inhtml += ' <label for="' + id_name + '">' + vm_name + '</label>';
    div.innerHTML = inhtml;
    document.getElementById("vm_list").appendChild(div);
}

function createImageList() {
    for (let index in _vmdk_list) {
        addImageItem(_vmdk_list[index]);
    }
}

function addImageItem(arg) {
    let div = document.createElement("div");
    let id_name = arg.id;
    let fimage = arg.filepath;
    let inhtml = '<input type="radio" id="' + id_name + '"name="RDKV Emulator Image" value=' + fimage + '>';
    inhtml += ' <label for="' + id_name + '">' + fimage + '</label>';
    div.innerHTML = inhtml;
    document.getElementById("image_path_list").appendChild(div);
}

function pushImageItem(arg) {
    _vmdk_list = [];
    _vmdk_list = arg[1];
    addImageItem(_vmdk_list[_vmdk_list.length - 1]);
}

function deleteImageItem(arg) {
    _vmdk_list = [];
    _vmdk_list = arg[1];
    document.getElementById("image_path_list").innerHTML = "";
    createImageList();
}

function createApiList() {

    let service_component = {}
    let selected_api_component = document.getElementById("api_component").value;
    if (selected_api_component.length == 0) {
        let str = _api_method[0].method;
        selected_api_component = str.substring(0, str.lastIndexOf('.'))
    }

    document.getElementById("apilist").innerHTML = "";

    for (let index in _api_method) {
        let str = _api_method[index].method;
        str = str.substring(0, str.lastIndexOf('.'))
        if (selected_api_component == str) {
            let apilist_ele = document.getElementById("apilist");
            let option = document.createElement("option");
            option.text = _api_method[index].name
            option.value = index;
            apilist_ele.options.add(option);
        }
        service_component[str] = str;
    }

    if (document.getElementById("api_component").length < 1) {
        addListItem(service_component, "api_component");
    }
}

function addListItem(arg, id) {
    for (let index in arg) {
        let ele = document.getElementById(id);
        let option = document.createElement("option");
        option.text = index;
        option.value = index;
        ele.options.add(option);
    }
}

function apiRequest(method_name, api_param, URL) {
    let data = JSON.stringify({
        "jsonrpc": "2.0",
        "id": 3,
        "method": method_name,
        "params": api_param
    });

    http_get(data, URL).then(function (res) {
        document.getElementById("apiresult").value = res;
    }).catch(function (err) { });
}


function getSelectedScript() {
    let index = document.getElementById("autoscript").selectedIndex;
    let value = document.getElementsByTagName("option")[index].value;
    return value;
}

function scriptKeyRequest() {
    keyrequest(_keyinput[_keyinput_index].value);
    let timer = setTimeout(function () {
        clearTimeout(timer);
        if ((_keyinput_index + 1) < _keyinput.length) {
            _keyinput_index++;
            scriptKeyRequest();
        }
    }, _keyinput[_keyinput_index].wait);
}

function ipBoxBlink() {
    document.getElementById("emv_ip").focus();
    ip_timer = setInterval(function () {
        clearTimeout(this);
        let ele = document.getElementById("emv_ip");
        ele.style.backgroundColor = ele.style.backgroundColor == "lightgrey" ? "#a6d1d1" : "lightgrey";
        if (ele.value != "") {
            clearInterval(ip_timer);
            ele.style.backgroundColor = "#bdb2b2"
        }
    }, 500);
}


hostip();

