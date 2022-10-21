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

const { app, BrowserWindow } = require('electron')
const url = require('url')
const path = require('path')
const electron = require("electron");
const ipc = electron.ipcMain;
const { exec } = require("child_process");
const os = require('os');
const fs = require('fs');
const fse = require('fs-extra');
const {dialog} = require('electron');

let win;
let task_runner;
let currentPath ;

function getTask() {

    let platform = os.platform();
    let OS_NAME = "";

    if (platform == "win32" || platform == "win64") {
        OS_NAME = "WIN"
    } else if (platform == "linux") {
        OS_NAME = "Linux"
    } else if (platform == "darwin") {
        OS_NAME = "MacOS"
    }

    let task_info = {
        WIN: {},
        Linux: {
            os_start: currentPath + "/source/shellscript/linux/os_start.sh",
            image_install: currentPath + "/source/shellscript/linux/image_install.sh",
            reboot_call: currentPath + "/source/shellscript/linux/reboot_call.sh",
            power_shutdown: currentPath + "/source/shellscript/linux/power_shutdown.sh",
            host_ip: currentPath + "/source/shellscript/linux/host_ip.sh",
            ide_open: currentPath + "/source/shellscript/linux/ide_open.sh",
            show_oslist: currentPath + "/source/shellscript/linux/show_oslist.sh",
            image_location: currentPath + "/source/shellscript/linux/image_location.sh",
            newimage_add: currentPath + "/source/shellscript/linux/newimage_add.sh",
            os_delete: currentPath + "/source/shellscript/linux/os_delete.sh",
            showvminfo: currentPath + "/source/shellscript/linux/showvminfo.sh",
            image_reinstall: currentPath + "/source/shellscript/linux/image_reinstall.sh",
            flash_image_on_sd_card: currentPath + "/source/shellscript/linux/flash_image_on_sd_card.sh",
        },
        MacOS: {}
    };
    task_runner = task_info[OS_NAME];
}

function createWindow() {
    let iconPath = path.resolve(__dirname, `./assets/images/emulator-app-manager-icon.png`)
    win = new BrowserWindow({
        width: 950,
        height: 582,
        frame: true,
        transparent: false,
        autoHideMenuBar: true,
        resizable: false,
        icon: iconPath,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    });

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true,
    }))
}

function start_init() {
    exec('xdg-user-dir', (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        let user_dir = stdout.trim() + "/RDK_V_EmulatorAppManager"
        console.log(user_dir);
        currentPath = user_dir;
        getTask();
        // check if directory exists
        if (fs.existsSync(user_dir)) {
            app.on('ready', createWindow)
        } else {
            let source = __dirname + '/source';
            let target = user_dir + '/source';
            fs.mkdirSync(user_dir);
            fse.copySync(source, target)
            app.on('ready', createWindow)
        }
        // event.sender.send('initial_setup_call', stdout);
    });

}

ipc.on('os_start', function(event, arg) {
    let task =  task_runner["os_start"]+" "+arg;
    exec(task, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
});

ipc.on('Image_install', function(event, arg) {
    let task =  task_runner["image_install"]+" "+arg[0]+" "+arg[1];
    exec(task, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
    });
});

ipc.on('show_oslist', function(event, arg) {
    exec(task_runner["show_oslist"], (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        event.sender.send('show_oslist-reply', stdout);
    });
});

ipc.on('image_location', function(event, arg) {
    exec(task_runner["image_location"], (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        event.sender.send('image_location_reply', stdout);
    });

});

ipc.on('initial_setup', function(event, arg) {
    exec(task_runner["show_oslist"], (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        event.sender.send('initial_setup_call', stdout);
    });
});

ipc.on('auto_script', function(event, arg) {
    let fpath = currentPath+"/source/testscript/"+arg;
    try {
        const data = fs.readFileSync(fpath, 'utf8')
        event.sender.send('automate_call', data);
      } catch (err) {
        console.error(err)
      }
});

ipc.on('auto_script_filelist', function(event, arg) {
    let fpath = currentPath+"/source/testscript/";
    let arr =[];
    try {
        fs.readdirSync(fpath).forEach(file => {
            arr.push(file);
          });
        event.sender.send('automate_filelist_call', arr);
      } catch (err) {
        console.error(err)
      }
});

ipc.on('power_shutdown', function(event, arg) {
    let task =  task_runner["power_shutdown"]+" "+arg;
    exec(task, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
});

ipc.on('reboot_call', function(event, arg) {
    let task =  task_runner["reboot_call"]+" "+arg;
    exec(task, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
});

ipc.on('get_imagesource', function(event, arg) {
  let fpath = currentPath+"/source/imagesource/"+"imagesource.json";
  try {
      const data = fs.readFileSync(fpath, 'utf8')
      event.sender.send('get_imagesource_replay', data);
    } catch (err) {
      console.error(err)
    }
});

ipc.on('set_imagesource', function(event, arg) {
    let fpath = currentPath+"/source/imagesource/"+"imagesource.json";
    try {
        const data = fs.writeFileSync(fpath, arg)
        event.sender.send('set_imagesource_replay', data);
      } catch (err) {
        console.error(err)
      }
});

ipc.on('host_ip', function(event, arg) {
    exec(task_runner["host_ip"], (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        event.sender.send('hostip-reply', stdout);
    });
});

ipc.on('remote_on', function(event, arg) {
    exec("rdkv-virtual-remote", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
    });
});

ipc.on('add_image', function(event, arg) {

    dialog.showOpenDialog(win, {
        properties: ['openFile'],
        filters: [
            { name: 'vmdk', extensions: ['vmdk'] }
          ]
      }).then(result => {
        if(!result.canceled){
        let filepath =""+ result.filePaths;
        let isFileExist = false; 

        for(index in arg[2]){
            if(arg[2][index].filepath==filepath){
                isFileExist=true;
            }                      
        }

        if(!isFileExist){
             let imagesource_path = currentPath+"/source/imagesource/imagesource.json";
             arg[1].filepath = filepath
             arg[2].push(arg[1]);
            fs.writeFileSync(imagesource_path, JSON.stringify(arg[2],null,3));            
            let task =  task_runner["newimage_add"]+" "+filepath;
            exec(task , (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                event.sender.send('add_image_replay', [false,arg[2]]);
            });
        }else{
            event.sender.send('add_image_replay', [true,arg[2]]);
        }
        } 

      }).catch(err => {
        console.log(err)
      })

});

ipc.on('delete_image', function(event, arg) {
    try {
        let fileExists = fs.existsSync(arg[0]);
        if(fileExists==true)
        {
            let imagesource_path = currentPath+"/source/imagesource/imagesource.json";
            fs.writeFileSync(imagesource_path, JSON.stringify(arg[1],null,3));  
            event.sender.send('delete_image_replay', [fileExists,arg[1]]);   
        }

    }catch (err) {
        event.sender.send('isfile_exists_replay', [false,err]);
        console.error(err)
      }

});

ipc.on('get_apilist', function(event, arg) {
    let fpath = currentPath+"/source/apiscript/apilist.json";
    try {
        const data = fs.readFileSync(fpath, 'utf8')
        event.sender.send('get_apilist_replay', data);
      } catch (err) {
        console.error(err)
      }
});

ipc.on('ide_open', function(event, arg) {

    dialog.showOpenDialog(win, {
        properties: ['openFile', 'openDirectory']
      }).then(result => {
        if(!result.canceled){
        let cmd =  "code " + result.filePaths;
         exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                event.sender.send('ide_open_replay', result.filePaths);
        });
       
        }
      }).catch(err => {
        console.log(err)
      })

});

ipc.on('os_delete', function(event, arg) {
    let task =  task_runner["os_delete"]+" "+arg;
    exec(task, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        event.sender.send('os_delete_call', stdout);
    });
});

ipc.on('add_script', function(event, arg) {

    dialog.showOpenDialog(win, {
        properties: ['openFile'],
        filters: [
            { name: 'json', extensions: ['JSON'] }
          ]
      }).then(result => {
        if(!result.canceled){
        let script_path = currentPath+"/source/testscript/";
        let cmd = "cp "+result.filePaths[0]+" "+script_path
        let filepath =""+ result.filePaths;
        let fileName = filepath.split("/").reverse()[0]
        let fileExists = fs.existsSync(currentPath+"/source/testscript/"+fileName);
        if(!fileExists){
            exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                 event.sender.send('add_script_replay', [fileName,true]);
            });
        }else{
            event.sender.send('add_script_replay', [fileName,false]);
        }
       }

      }).catch(err => {
        console.log(err)
      })
    
      
      


});

ipc.on('delete_script', function(event, arg) {
    let fileName = currentPath+"/source/testscript/"+arg;
    let fileExists = fs.existsSync(fileName);
    let cmd = "rm -rf "+fileName;

    if(fileExists){
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
             event.sender.send('delete_script_replay', [arg,true]);
        });
    }else{
        event.sender.send('delete_script_replay', [arg,false]);
    }
});

ipc.on('screenMove', function(event, arg) {
    let pos = win.getBounds();
    if(arg=="RIGHT"){
        win.setBounds({ x: (pos.x+20) })
    }else if(arg=="LEFT"){
        win.setBounds({ x: (pos.x-20) })
    }else if(arg=="UP"){
        win.setBounds({ y: (pos.y-20) })
    }else if(arg=="DOWN"){
        win.setBounds({ y: (pos.y+20) })
    }
});


start_init();

 

