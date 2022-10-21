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

    function startSelectedVM() {
        let getVm = document.querySelector('input[name="vmlist"]:checked').value;  
        ipc.send('os_start',getVm);
    }

    function showVMDK_List(event) {
        let ele = document.getElementById("imagebox");
        if (ele.style.display === "none") {
            ele.style.display = "block";
        }
        document.getElementById("osbox").style.display = "none";
    }

    function getSelectedApps (){

        let display_client ="";

        try{
            display_client = document.querySelector('input[name="appname"]:checked').value;  
           }catch(err){
            alert("Please select target app")
        }
        return display_client;
    }


    function imageInstall() {
        let getImage = document.querySelector('input[name="RDKV Emulator Image"]:checked').value;
        let image_name = document.getElementById("image_ins_name").value

        if (_os_list.indexOf(image_name) < 0) {
            _os_list.push(image_name)
            ipc.send('Image_install', [image_name, getImage]);
        } else {
            alert('This is duplicate name')
        }
    }

    function showVM(event) {
        let ele = document.getElementById("osbox");
        if (ele.style.display === "none") {
            ele.style.display = "block";
        }
        document.getElementById("imagebox").style.display = "none"
        ipc.send('show_oslist');
    }

    function open_ide() {
        ipc.send('ide_open');
    }

    function rebootSelectedVM() {
        let getVm = document.querySelector('input[name="vmlist"]:checked').value;
        ipc.send('reboot_call', getVm);
    }

    function show_autotestopt_click() {
        let ele = document.getElementById("auto_script_box")
        ele.style.display = (ele.style.display === "none") ? "block" : "none";
    }

    function add_image_click() {
        let count = Number(_vmdk_list.length) + 1
        let source = { filepath: "", id: 'vmdk_' + '' + count };
        ipc.send('add_image', ["", source, _vmdk_list]);
    }

    function delete_image() {

        let arr = [];
        let isFileExist = false;
        let fpath = "";
        let getImage = document.querySelector('input[name="RDKV Emulator Image"]:checked').value;

        for (index in _vmdk_list) {
            if (_vmdk_list[index].filepath == getImage) {
                isFileExist = true;
                fpath = _vmdk_list[index].filepath;
            } else {
                arr.push(_vmdk_list[index]);
            }
        }

        if (!fpath == "") {
            ipc.send('delete_image', [fpath, arr]);
        }
    }


    function shutdownSelectedVM(event) {
        let getVm = document.querySelector('input[name="vmlist"]:checked').value;
        ipc.send('power_shutdown', getVm);
    }

    function showRemote() {
        ipc.send('remote_on');
    }

    document.getElementById("emv_ip").addEventListener("keyup", function (event) {
        emulator_ip = event.target.value;
    });

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
        }

        let apicode = {
            "RESET": "",
        }

        if (keyCode[keyName]) {
            var data = JSON.stringify({
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
            http_get(data).then(function (res) { }).catch(function (err) { });
        } else {
            launchHomeAPP("");
        }
    }

    async function launchHomeAPP(appName) {
        let url = document.getElementById("home_app_url").value;
        
            var data = JSON.stringify({
                "jsonrpc": "2.0",
                "id": 1,
                "method": "org.rdk.RDKShell.1.launch",
                "params": {
                    "callsign": "ResidentApp",
                    "type": "HtmlApp",
                    "uri": url
                }
            });
            http_get(data).then(function (res) {
            }).catch(function (err) { });

    }

    function launchHtmlApp(appName) {
        let url = document.getElementById("app_url").value;
        var data = JSON.stringify({
            "jsonrpc": "2.0",
            "id": 3,
            "method": "org.rdk.RDKShell.1.launch",
            "params": {
                "callsign": "emvtestapp",
                "type": "HtmlApp",
                "uri": url
            }
        });
        http_get(data).then(function (res) { }).catch(function (err) { });
    }

    function setEmulatorIP() {
        emulator_ip = document.getElementById("emv_ip").value
    }

    function automate() {
        ipc.send('auto_script', getSelectedScript());
    }

    function deleteSelectedVM() {
        let getVm = document.querySelector('input[name="vmlist"]:checked').value;
        ipc.send('os_delete', getVm);
    }

    function validateApi() {
        let index = document.getElementById("apilist").value;
        let method_name = _api_method[index].method;
        let url = _api_method[index].URL; //this not required
        let api_param = JSON.parse(document.getElementById("api_validation").value);
        apiRequest(method_name, api_param, URL);
    }

    function selectApi(event) {
        let value = document.getElementById("apilist").value;
        let apiresult = document.getElementById("apiresult");
        apiresult.value = "";
        let method_name = _api_method[value].method;
        let api_param = _api_method[value].params;
        let size = Object.keys(api_param).length;
        document.getElementById("api_validation").value = JSON.stringify(api_param, null, 1);

        if (size == 0) { apiRequest(method_name, api_param); }
        else { }
    }

    function selectedApiComponent() {
        createApiList();
    }

    function addScript() {
        ipc.send('add_script', []);
    }

    function deleteScript() {
        ipc.send('delete_script', getSelectedScript());
    }

    function allApiValidate() {
        all_api_request_index = 0;

        all_api_request_timer = setInterval(function () {
            let method_name = _api_method[all_api_request_index].method;
            let url = _api_method[all_api_request_index].URL;
            let api_param = _api_method[all_api_request_index].params;

            (function (method_n, param, url) {
                let data = JSON.stringify({
                    "jsonrpc": "2.0",
                    "id": 3,
                    "method": method_n,
                    "params": param
                });

                http_get(data, url).then(function (res) {
                    let request_data = "S.NO : " + all_api_request_index + "\n" + "Method Name:  " + method_n + "\n" + "Payload : " + JSON.stringify(param) + "\n\nResult :  " + res;
                    let str = document.getElementById("apiresult").value;
                    str = str + "\n" + "---------------------------------------------------------------" + "\n\n" + request_data;
                    document.getElementById("apiresult").value = str;

                    if ((_api_method.length) == all_api_request_index) {
                        let str = document.getElementById("apiresult").value;
                        str = str + "\n" + "-----------------------------------------------------\n\n                DONE\n\n------------------------------------";
                        document.getElementById("apiresult").value = str;
                    }

                }).catch(function (err) {
                });

            })(method_name, api_param, url);

            all_api_request_index++;

            document.getElementById("api_request_progress").value = Math.round((all_api_request_index / _api_method.length) * 100);
            if (_api_method.length <= all_api_request_index) {
                clearInterval(all_api_request_timer);
            }
        }, 3000);
    }


    function clearApiText() {
        document.getElementById("apiresult").value = "";
    }

    document.addEventListener('keydown', function (e) {
        if ((e.code == 'ControlLeft' || e.code == 'ControlRight')) {
            control_key = true;
        }

        if (control_key && e.key == 'ArrowRight') {
            ipc.send('screenMove', "RIGHT");
        } else if (control_key && e.key == 'ArrowLeft') {
            ipc.send('screenMove', "LEFT");
        } else if (control_key && e.key == 'ArrowUp') {
            ipc.send('screenMove', "UP");
        } else if (control_key && e.key == 'ArrowDown') {
            ipc.send('screenMove', "DOWN");
        }

    });

    document.addEventListener('keyup', function (e) {
        if ((e.code == 'ControlLeft' || e.code == 'ControlRight')) {
            control_key = false;
        }
    });


    async function showapps(){

        let getClients_res = await http_get(JSON.stringify({
            "jsonrpc": "2.0",
            "id": 3,
            "method": "org.rdk.RDKShell.1.getClients",
            "params": {}
        }));

        let clients = JSON.parse(getClients_res).result.clients;
        document.getElementById("showapp").innerHTML = ""
        for( let index in clients){
            let div = document.createElement("div");
            div.style.display ="inline"
            let id_name = "showapps_"+index;
            let app_name = clients[index];
            let inhtml = '<input type="radio" id="' + id_name + '"name="appname" value=' + app_name + '>';
            inhtml += ' <label for="' + id_name + '">' + app_name + '</label>';
            div.innerHTML = inhtml;
            document.getElementById("showapp").appendChild(div);
        }

    }


    async function moveback(){

        let display_client = getSelectedApps(); 
        if(display_client=="") return;

        let getClients_res = await http_get(JSON.stringify({
            "jsonrpc": "2.0",
            "id": 3,
            "method": "org.rdk.RDKShell.1.getClients",
            "params": {}
        }));

        await http_get(JSON.stringify({
                "jsonrpc": "2.0",
                "id": 3,
                "method": "org.rdk.RDKShell.1.moveToBack",
                "params": { "client": display_client}
            }));


        await http_get(JSON.stringify({
                "jsonrpc": "2.0",
                "id": 3,
                "method": "org.rdk.RDKShell.1.setOpacity",
                "params": {
                    "client":JSON.parse(getClients_res).result.clients[1],
                    "opacity": 100
                }
            }));

        await http_get(JSON.stringify({
            "jsonrpc": "2.0",
            "id": 3,
            "method": "org.rdk.RDKShell.1.setVisibility",
            "params": {
                "client":JSON.parse(getClients_res).result.clients[1],
                "visible": true
            }
        }));
    }

    async function movefront(){

        let display_client = getSelectedApps(); 

        if(display_client=="") return;

        let getClients_res = await http_get(JSON.stringify({
            "jsonrpc": "2.0",
            "id": 3,
            "method": "org.rdk.RDKShell.1.getClients",
            "params": {}
        }));

        await http_get(JSON.stringify({
                "jsonrpc": "2.0",
                "id": 3,
                "method": "org.rdk.RDKShell.1.moveToFront",
                "params": { "client": display_client}
            }));


        await http_get(JSON.stringify({
                "jsonrpc": "2.0",
                "id": 3,
                "method": "org.rdk.RDKShell.1.setOpacity",
                "params": {
                    "client":JSON.parse(getClients_res).result.clients[1],
                    "opacity": 100
                }
            }));

        await http_get(JSON.stringify({
            "jsonrpc": "2.0",
            "id": 3,
            "method": "org.rdk.RDKShell.1.setVisibility",
            "params": {
                "client":JSON.parse(getClients_res).result.clients[1],
                "visible": true
            }
        }));

    }

    function applayer_opacity(){
        opacityChange();
    }

    async function set_focus(){

        let display_client =  getSelectedApps();
        if(display_client=="") return;

        let data = JSON.stringify({
            "jsonrpc": "2.0",
            "id": 3,
            "method": "org.rdk.RDKShell.1.setFocus",
            "params": {"client": display_client}
        });

        res =await http_get(data);

    }

    async function set_zoomin(){

        let data = JSON.stringify({
            "jsonrpc": "2.0",
            "id": 3,
            "method": "org.rdk.RDKShell.1.getScreenResolution",
            "params": {}
        });

        let res =await http_get(data);
        let cw = JSON.parse(res).result.w;
        let ch = JSON.parse(res).result.h;

        let sw = cw-(cw*0.1);
        let sh = ch-(ch*0.1);

        data = JSON.stringify({
            "jsonrpc": "2.0",
            "id": 3,
            "method": "org.rdk.RDKShell.1.setScreenResolution",
            "params": { "w": sw, "h": sh}
        });
        res = await http_get(data);
    }

    async function set_zoomout(){

        let data = JSON.stringify({
            "jsonrpc": "2.0",
            "id": 3,
            "method": "org.rdk.RDKShell.1.getScreenResolution",
            "params": {}
        });

        let res =await http_get(data);
        let cw = JSON.parse(res).result.w;
        let ch = JSON.parse(res).result.h;

        let sw = cw+(cw*0.1);
        let sh = ch+(ch*0.1);

        data = JSON.stringify({
            "jsonrpc": "2.0",
            "id": 3,
            "method": "org.rdk.RDKShell.1.setScreenResolution",
            "params": { "w": sw, "h": sh}
        });
        res =await http_get(data);
    }

    function zoom_in(){
        set_zoomin();  
    }

    function zoom_out(){
        set_zoomout();  
    }

    async function scaleSet() {
        let scale_width = Number(document.getElementById("scale_width").value)
        let scale_height = Number(document.getElementById("scale_height").value)

        let display_client = getSelectedApps();;
        if(display_client=="") return;


        let data =   JSON.stringify({
            "jsonrpc": "2.0",
            "id": 3,
            "method": "org.rdk.RDKShell.1.setScale",
            "params": { 
                "sx": scale_width, 
                "sy": scale_height,
                "client": display_client
            }
        });
        res = await http_get(data);

    }

    async function screen_navigation(mx,my){

        let display_client = getSelectedApps();
        if(display_client=="") return;

        let data = JSON.stringify({
                "jsonrpc": "2.0",
                "id": 3,
                "method": "org.rdk.RDKShell.1.getBounds",
                "params": {
                    "client": display_client
                }
            });

        let result = await http_get(data);
        let res = JSON.parse(result);
        let cx = res.result.bounds.x;
        let cy = res.result.bounds.y;
        let cw = res.result.bounds.w;
        let ch = res.result.bounds.h;

        let sx = cx+mx;
        let sy = cy+my;
    
        data = JSON.stringify({
            "jsonrpc": "2.0",
            "id": 3,
            "method": "org.rdk.RDKShell.1.setBounds",
            "params": { 
                "x": sx, 
                "y": sy,
                "w": cw,
                "h": ch,
                "client": display_client
            }
        });

        res = await http_get(data);
    }

    function moveleft(){
        screen_navigation(-10,0);
    }

    function moveright(){
        screen_navigation(10,0);
    }

    function moveup(){
        screen_navigation(0,-10);
    }

    function movedown(){
        screen_navigation(0,10);
    }

    async function opacityChange(){

        let display_client = getSelectedApps();  
        if(display_client=="") return;

        let val = Number(document.getElementById("opacity_txt").value)
        let result = await http_get(JSON.stringify({
            "jsonrpc": "2.0",
            "id": 3,
            "method": "org.rdk.RDKShell.1.setOpacity",
            "params": {
                "client":display_client,
                "opacity": val
            }
        }));

    }




const SET_TARGET_IP = setEmulatorIP; 
const IMAGE_INSTALL = imageInstall; 
const START_VM = startSelectedVM; 
const REBOOT_VM = rebootSelectedVM; 
const SHUTDOWN_VM = shutdownSelectedVM; 
const DELETE_VM_INSTANCE = deleteSelectedVM; 
const SHOW_IMAGE_LIST = showVMDK_List; 
const ADD_IMAGE = add_image_click;
const DELETE_IMAGE = delete_image;
const SHOW_LIST = showVM; 
const LAUNCH_HOME_APP = launchHomeAPP; 
const LAUNCH_HTML_APP = launchHtmlApp; 
const LAUNCH_REMOTE = showRemote; 
const OPEN_CODE_EDITER = open_ide;
const START_TEST = automate;
const SHOW_TEST_SCRIPT = show_autotestopt_click;
const API_VALIDATION = validateApi;
const ALL_API_VALIDATION = allApiValidate;
const SELECT_API = selectApi; 
const SELECT_API_COMPONENT =selectedApiComponent; //this is declared in index.js
const ADD_SCRIPT =addScript;
const DELETE_SCRIPT =deleteScript;
const CLEAR_API_TEXT_AREA =clearApiText;
const MOVEBACK = moveback;
const MOVEFRONT = movefront;
const APPLAYER_OPACITY = applayer_opacity;
const SET_FOCUS = set_focus;
const ZOOM_IN = zoom_in;
const ZOOM_OUT = zoom_out;
const MOVELEFT = moveleft;
const MOVERIGHT = moveright;
const MOVEDOWN = movedown;
const MOVEUP = moveup;
const GETAPPSLIST = showapps;
const SCALE = scaleSet;

function evtHandler(arg){
    arg();
}




