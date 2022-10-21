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

ipc.send('get_imagesource');
ipc.on('get_imagesource_replay', function(event, arg) {
    _vmdk_list = JSON.parse(arg);
    createImageList();
});

ipc.send('initial_setup');
ipc.on('initial_setup_call', function(event, arg) {
   let arr = arg.split('\n');
   let isInstall = false;
   for(let index in arr){
       let len = arr[index].lastIndexOf('"');
       let name = arr[index].slice(1, len);
       _os_list.push(name);
       if(name===_DEFAULT_IMAGE){
           isInstall = true;
           break;
       }
   }

   if(!isInstall){
        if(document.querySelector( 'input[name="RDKV Emulator Image"]:checked')) {
        let getImage = document.querySelector( 'input[name="RDKV Emulator Image"]:checked').value;  
        ipc.send('Image_install',[_DEFAULT_IMAGE,getImage]);
    }
  }

});



ipc.send('image_location');
ipc.on('image_location_reply', function(event, arg) {});


ipc.send('auto_script_filelist');
ipc.on('automate_filelist_call', function(event, arg) {
 let ele = document.getElementById("autoscript");
 ele.innerHTML = "";
 for(let index in arg){
    let option = document.createElement("option");
    option.value = arg[index];
    option.text = arg[index];
    ele.add(option);
 }
});


ipc.send('get_apilist');
ipc.on('get_apilist_replay', function(event, arg) {
    _api_method = JSON.parse(arg);
    createApiList();
});

ipc.on('add_image_replay', function (event, arg) {
    if(!arg[0]){
        pushImageItem(arg);
    }else{
        alert("Dublicate File")
    }
});

ipc.on('delete_image_replay', function (event, arg) {
    if(arg){
       deleteImageItem(arg);
    }else{
        alert(arr[1])
    }
});


ipc.on('hostip-reply', function(event, arg) {
    _host_ip = arg;
});

ipc.on('show_oslist-reply', function(event, arg) {
   let arr = arg.split('\n');
   document.getElementById("vm_list").innerHTML = "";
   _os_list = [];
   
   for(let index in arr){
       let len = arr[index].lastIndexOf('"');
       let name = arr[index].slice(1, len);
       _os_list.push(name);
   }

   for (let index = 0; index<_os_list.length-1; index++) {
        createVMLiist({ id:"vm_"+index, vm_name:_os_list[index] });
    }
});


ipc.on('automate_call', function(event, arg) {
    _keyinput = JSON.parse(arg);   
    _keyinput_index=0;
    scriptKeyRequest(); 
});

ipc.on('os_delete_call', function(event, arg) {
    ipc.send('show_oslist');
});

ipc.on('add_script_replay', function(event, arg) {

    if(arg[1]){
        let str = arg[0];
        let ele = document.getElementById("autoscript");
        let option = document.createElement("option");
        option.value = str;
        option.text = str;
        ele.add(option);
    }else{
        alert("This file name duplicate")
    }
});

ipc.on('delete_script_replay', function(event, arg) {
    if(arg[1]){
        let len = document.getElementById("autoscript").length;
        for(let index=0 ;index<len ; index++){
           if(arg[0]== document.getElementsByTagName("option")[index].value)
           {
            document.getElementById("autoscript").remove(index);
            break;
           }
        }
    }else{
        alert("NO file ")
    }
});

ipc.on('ide_open_replay', function(event, arg) {
    document.getElementById("source_path").value = arg;
});

