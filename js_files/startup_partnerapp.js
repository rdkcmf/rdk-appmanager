/*
 * If not stated otherwise in this file or this component's Licenses.txt file the
 * following copyright and licenses apply:
 *
 * Copyright 2018 RDK Management
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
*/
px.import({
    scene: 'px:scene.1.js',
    keys: 'px:tools.keys.js',
    Optimus: 'optimus.js'
}).then(function ready(imports) {
    var scene = imports.scene;
    var root = imports.scene.root;
    var keys = imports.keys;
    var optimus = imports.Optimus;

    optimus.setScene(scene);

    var basePackageUri = px.getPackageBaseFilePath();
    var applicationConfigDefault = "/home/root/appmanagerregistry.conf";
    var applicationConfigOverride = process.env.PXSCENE_APPS_CONFIG;

    var ethIP = px.appQueryParams.ethIP; // ethernet Ip address
    if( ethIP === undefined) { ethIP = "NA";}

    var launchedApps = {};
    var nextAppId = 1001;
    var menu;
    var menuBg;
    var scroll;
    var scrollContent;
    var rowcontainer;
    var controlBarScene;
    var controlBar;

    launchPage();

    scene.root.on("onPreKeyDown", function(e) {
        if (e.keyCode == keys.E && keys.is_CTRL( e.flags ) && menu.focus)  
        {
            console.log("Exit key pressed. Destroying and re-launching Menu");
            destroyApps();
            launchPage();
        }
        else if (e.keyCode == keys.M && keys.is_CTRL( e.flags ))
        {
            console.log("Menu Pressed showing Menu");
            showMenu();
        }

    });

    scene.root.on("onKeyDown", function(e) {
        if ( menu.focus == true ) 
        {
    	    if (e.keyCode == keys.LEFT) controlBar.navLeft(); // LEFT
	    else if (e.keyCode == keys.RIGHT) controlBar.navRight(); // RIGHT
	    else if (e.keyCode == keys.ESCAPE) hideMenu(); // ESCAPE
	    else if (e.keyCode == keys.FOUR || e.keyCode == keys.ENTER) // NUM_4 or ENTER
	    {
	        console.log("Enter pressed");
	        controlBar.doAction();
	    }
        }
    });

    function destroyApps() {
        console.log("destroyApps");
        for (var i in launchedApps) {
           console.log("Destroying app:" + launchedApps[i]);
           optimus.getApplicationById(launchedApps[i]).destroy();
           delete launchedApps[i];
        }
	controlBarScene.removeAll();
	controlBarScene.remove();
	rowcontainer.removeAll();
	rowcontainer.remove();
	scrollContent.removeAll();
	scrollContent.remove();
	scroll.removeAll();
	scroll.remove();
	menuBg.removeAll();
	menuBg.remove();
	menu.focus = false;

	menu.removeAll();
	menu.remove();  
    }

    function hideMenu() {
        console.log("Hiding Menu");
        menu.a = 0;
        menu.focus = false;
    }

    function showMenu() {
        console.log("Showing Menu");
        menu.a = 0.75;
        menu.focus = true;
        menu.moveToFront();
    }

    function launchPage() {
      console.log("launchPage");
      var applicationOverrideList = px.getFile(applicationConfigOverride);
        applicationOverrideList.then(function(data) {
	  console.log("Using " + applicationConfigOverride);
	  loadPage(data);
	  }).catch(function importFailed(err) {
	  console.log("Import failed for: " + applicationConfigOverride)
	  var applicationDefaultList = px.getFile(applicationConfigDefault);
	  applicationDefaultList.then(function(data) {
	      console.log("Using " + applicationConfigDefault);
	      loadPage(data);
	      }).catch(function importFailed(err) {
	      console.error("Import failed for /home/root/appmanagerregistry.conf: " + err)
	  });
       });
    }

    function loadPage(data) {
        var appsList = data;
        var obj = JSON.parse(appsList);
        var apps = obj.applications
        var numApps = apps.length;

        console.log(": " + apps);
        console.log("apps: ", apps.length);

        menu = scene.create({
            t: "object",
            x: 0,
            y: 0,
            w: scene.h,
            h: scene.h,
            a: 0.7,
            parent: root
        });

        menuBg = scene.create({ t: "image",
            x: 0,
            y: 0,
            w: menu.w,
            h: menu.h,
            parent: menu,
            url: "/home/root/browser/images/status_bg.png" 
        });

        scroll = scene.create({
            t: "image",
            parent: menu
        });
        scrollContent = scene.create({
            t: "image",
            parent: scroll
        });

        rowcontainer = scene.create({
            t: "image",
            parent: scrollContent
        });

        if (ethIP != "NA") {
            var displayIp = scene.create({
               t: "text",
               text: "eth0 IP: " + ethIP,
               parent: menu,
               x: 1050,
               y: 680,
               textColor: 0xeeeeeeff,
               pixelSize: 14,
               a: 0.6
            });
        }

        var prevRow;
        var p = 0;
        menu.focus = true;
        for (var i = 0; i < apps.length; i++) {
            var row = scene.create({
                t: "image",
                parent: rowcontainer,
                a: 0
            });

            var appName = apps[i].displayName;
            var appPath = apps[i].uri;
            var t = scene.create({
                t: "text",
                text: appName,
                parent: row,
                x: 10,
                textColor: 0xfaebd7ff,
                pixelSize: 36
            });
            var t2 = scene.create({
                t: "text",
                text: appPath,
                parent: row,
                x: 20,
                textColor: 0xeeeeeeff,
                pixelSize: 14,
                a: 0.6
            });

            // Use promises to layout the rows as the text becomes ready
            var rowReady = new Promise(

                function(fulfill, reject) {

                    var prevRowCopy = prevRow;
                    var rowCopy = row;
                    var tCopy = t;
                    var t2Copy = t2;

                    // Please note that rowReady at this point is the rowReady for the previous row
                    Promise.all([t.ready, t2.ready, rowReady]).then(function() {
                        console.log("IN PROMISE ALL!");
                        t2Copy.y = tCopy.h;
                        rowCopy.h = tCopy.h + t2Copy.h;

                        if (prevRowCopy) {
                            rowCopy.y = prevRowCopy.y + prevRowCopy.h;
                        } else
                            selectRow(0); // This resizes the select rectangle once we have the first one

                        rowCopy.animateTo({
                            a: 1
                        }, 0.6, scene.animation.TWEEN_LINEAR, scene.animation.OPTION_LOOP, 1);
                        fulfill(rowCopy); // done with this row
                    }, function() {
                        // If .all fails to resolve set the row height to zero and hide it
                        // Fulfill the rowReady anyway so the next row can be layed out
                        rowCopy.h = 0;
                        rowCopy.a = 0;
                        fulfill(rowCopy);
                    });

                });

            row.w = 800;
            prevRow = row;

        }

        //CONTROL BAR

        function ControlBarTextButton(inTb, inX, inY, inW, inH, inText, inFocused, inUnfocused, inDisabled, inAction)
        {
            
            this.tb = inTb;
            this.text = inText;
            this.focused = inFocused;
            this.unfocused = inUnfocused;
            this.disabled = inDisabled;
            this.isFocused = false;
            this.isVisible = true;
            this.isDisabled = false;
            this.left = null;
            this.right = null;
            this.action = inAction
        
            console.log("Drawing controlBarbutton");
            this.boundRect = scene.create({
                t: "rect",
                parent: this.tb,
                fillColor: 0x404040ff,
                lineColor: 0x000000ff,
                lineWidth: 1,
                x: inX,
                y: inY,
                w: inW,
                h: inH
            });
            
            this.controlText   = scene.create({ t: "textBox", parent: this.boundRect, text: this.text, x: 0, y: 0, w: this.boundRect.w, h: this.boundRect.h , textColor:inUnfocused, pixelSize: 20,
            alignHorizontal: scene.alignHorizontal.CENTER, alignVertical: scene.alignVertical.CENTER});
            
        }
        
        
        ControlBarTextButton.prototype.updateState = function()
        {
            //console.log("ControlBarButton.prototype.updateState");
            if(this.isVisible)
            {
                if(this.isFocused)
                {
                    this.controlText.textColor = this.focused;
                }
                else if (this.isDisabled)
                {
                    this.controlText.textColor = this.disabled;		
                }
                else
                {
                    this.controlText.textColor = this.unfocused;	
                }
            }
            else
            {
                this.controlText.textColor = this.disabled;	
            }
        }
        
        ControlBarTextButton.prototype.setFocused = function(isFocused)
        {
            this.isFocused = isFocused
            this.updateState();
        }
        
        ControlBarTextButton.prototype.setVisible = function(isVisible)
        {
            this.isVisible = isVisible
            this.updateState();
        }
        
        ControlBarTextButton.prototype.setDisabled = function(isDisabled)
        {
            this.isDisabled = isDisabled
            this.updateState();
        }

        function ControlBar(inX, inY, inW, inH, inParent)
        {
        
            this.border = scene.create({
                t: "rect",
                parent: inParent,
                fillColor: 0xA0A0A0ff,
                lineColor: 0x000000ff,
                lineWidth: 1,
                x: inX,
                y: inY,
                w: inW,
                h: inH
            });
            
            var offsetX = 10;
            var offsetY = 10;
        
            console.log("ControlBar");
            
            this.buttonPLAY 	= new ControlBarTextButton(inParent, offsetX, 	offsetY, 100, 40, "Launch", 0x00FF00ff, 0xFFFFFFff, 0xFF0000ff, this.launchApplication);
            this.buttonPAUSE 	= new ControlBarTextButton(inParent, offsetX + 120, 	offsetY, 100, 40, "Suspend", 0xFFFF66ff, 0xFFFFFFff, 0xFF0000ff, this.suspendApplication);
            this.buttonSTOP 	= new ControlBarTextButton(inParent, offsetX + 240, 	offsetY, 100, 40, "Stop", 0xFF0000ff, 0xFFFFFFff, 0xFF0000ff, this.stopApplication);
            
            this.focused = true;
            this.focusedButton 	= this.buttonPLAY;
        
            this.updateState();
        }
        
        ControlBar.prototype.updateState = function()
        {
            console.log("inside ControlBar update state");
            this.focusedButton 	= this.buttonPLAY;
        
            this.buttonPLAY.right 		= this.buttonPAUSE;
            this.buttonPAUSE.right		= this.buttonSTOP;
            this.buttonSTOP.right 		= this.buttonPLAY;
            
            this.buttonPLAY.right 		= this.buttonPAUSE;
            this.buttonPAUSE.right		= this.buttonSTOP;
            this.buttonSTOP.right 		= this.buttonPLAY;
        
            this.buttonPLAY.left 		= this.buttonSTOP;
            this.buttonSTOP.left 		= this.buttonPAUSE;
            this.buttonPAUSE.left 		= this.buttonPLAY;
        }
        
        ControlBar.prototype.navLeft = function()
        {
            console.log("Inside navleft");
            if(this.focusedButton.left)
            {
                this.focusedButton.setFocused(false);
                this.focusedButton = this.focusedButton.left;
                this.focusedButton.setFocused(true);
            } 
        }
        
        ControlBar.prototype.navRight = function()
        {
            console.log("Inside navright");
            if(this.focusedButton.right)
            {
                this.focusedButton.setFocused(false);
                this.focusedButton = this.focusedButton.right;
                this.focusedButton.setFocused(true);
            }
        }
        
        ControlBar.prototype.doAction = function()
        {
            console.log("Inside doAction");
            this.focusedButton.action.call(this);
        }

        ControlBar.prototype.launchApplication = function() {
            console.log("launch Application");
            var applicationCmdName = "";
            if (apps[currentRow].cmdName != undefined)
                applicationCmdName = apps[currentRow].cmdName;

            var applicationName = apps[currentRow].displayName;
            var applicationType = apps[currentRow].applicationType;
            var applicationUri = apps[currentRow].uri;
            hideMenu();
            if (launchedApps[applicationName] != undefined) {
                console.log("App already launched: " + applicationName + " id:" + launchedApps[applicationName]);
                var _apps = optimus.getApplications();
                console.log("apps size: " + _apps.length);
                for (var index = 0; index < _apps.length; index++){
    		    console.log("_app found with name: " + _apps[index].id);
		}

                optimus.getApplicationById(launchedApps[applicationName]).moveToFront();
                optimus.getApplicationById(launchedApps[applicationName]).setFocus(true);
            } else {
                console.log("launching Application: " + applicationName + " id:" + nextAppId);
                var applicationLaunchCmd = "";
                var _launchParams = "";
                if (applicationType == "native")
                {
                    _launchParams = { "cmd": applicationCmdName };
                }
                else if (applicationType == "pxscene")
                {
                    _launchParams = { "cmd": "spark", "uri": applicationUri };
                }
                else if (applicationType == "WebApp")
                {
                    _launchParams = { "cmd": "WebApp", "uri": applicationUri };
                }

                var propsApp = {
                    id: nextAppId,
                    priority: 1,
                    x: 0,
                    y: 0,
                    w: scene.getWidth(),
                    h: scene.getHeight(),
                    cx: 0,
                    cy: 0,
                    sx: 1.0,
                    sy: 1.0,
                    r: 0,
                    a: 1,
                    interactive: true,
                    painting: true,
                    clip: false,
                    mask: false,
                    draw: true,
                    launchParams: _launchParams
                };

                var partnerApp = optimus.createApplication(propsApp);
                optimus.primaryApp = partnerApp;
                partnerApp.moveToFront();
                partnerApp.setFocus(true);  

                launchedApps[applicationName] = nextAppId;
                nextAppId++;
                this.focusedButton.controlText.text = "Switch To";
            }
        }

        ControlBar.prototype.suspendApplication = function() {
           var applicationName = apps[currentRow].displayName;
           if (launchedApps[applicationName] != undefined) {
               var appStatus = optimus.getApplicationById(launchedApps[applicationName]).state;

               if (appStatus === "RUNNING")
               {
                   console.log("Suspending application: " + applicationName);
                   optimus.getApplicationById(launchedApps[applicationName]).suspend({});
                   this.buttonPAUSE.controlText.text = "Resume";
               }
               else if (appStatus === "SUSPENDED")
               {
                   console.log("Resuming application: " + applicationName);
                   optimus.getApplicationById(launchedApps[applicationName]).resume({});
                   this.buttonPAUSE.controlText.text = "Suspend";
               }
           } else {
               console.log("App not launched: " + applicationName);
               // Do Nothing
           }
       }

        ControlBar.prototype.stopApplication = function() {
            console.log("stopApplication");
            var applicationName = apps[currentRow].displayName;
            if (launchedApps[applicationName] != undefined) {
                console.log("Stopping application: " + applicationName + " id:" + launchedApps[applicationName]);
                optimus.getApplicationById(launchedApps[applicationName]).destroy();
                delete launchedApps[applicationName];
                this.buttonPLAY.controlText.text = "Launch";
            } else {
                console.log("App not launched: " + applicationName);
                // Do Nothing
            }
        }

       controlBarScene = scene.create({ t: "object", x: 500, y: 0, w: 400, h: 50, parent:menu });
       var insets = {l: 10, r: 10, t: 10, b: 10};
       controlBar = new ControlBar(0, 0, 360, 60, controlBarScene);

        var select = scene.create({
            t: "rect",
            parent: scrollContent,
            fillColor: 0x000000,
            lineColor: 0xffff00ff,
            lineWidth: 4,
            w: scene.w,
            h: 100
        });


        function clamp(v, min, max) {
            return Math.min(Math.max(min, v), max);
        }

        var currentRow = 0;
        var currentControl = 0;

        function selectRow(i) {
            currentRow = i;
            var row = rowcontainer.children[i];
            select.animateTo({
                x: row.x,
                y: row.y,
                h: row.h
            }, 0.001, scene.animation.TWEEN_LINEAR, scene.animation.OPTION_LOOP, 1);
            //controlBar.animateTo({x:row.x+500,y:row.y+25,h:row.h},0.001,scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, 1);
            controlBarScene.animateTo({
                x: row.x + 500,
                y: row.y + 13,
                h: row.h
            }, 0.001, scene.animation.TWEEN_LINEAR, scene.animation.OPTION_LOOP, 1);
            // animate to bring selection into view
            var t = -scrollContent.y;
            if (row.y < t) {
                t = -row.y
                console.log("one");
                scrollContent.animateTo({
                    y: t
                }, 0.3, scene.animation.TWEEN_LINEAR, scene.animation.OPTION_LOOP, 1);
            } else if (row.y + row.h - scene.h > t) {
                t = -(row.y + row.h - scene.h);
                console.log("two");
                scrollContent.animateTo({
                    y: t
                }, 0.3, scene.animation.TWEEN_LINEAR, scene.animation.OPTION_LOOP, 1);
            }
        }

        function selectControl(i) {
            currentRow = i;
            var row = rowcontainer.children[i];
            select.animateTo({
                x: row.x,
                y: row.y,
                h: row.h
            }, 0.001, scene.animation.TWEEN_LINEAR, scene.animation.OPTION_LOOP, 1);
            //controlBar.animateTo({x:row.x+500,y:row.y+25,h:row.h},0.001,scene.animation.TWEEN_LINEAR,scene.animation.OPTION_LOOP, 1);
            controlBarScene.animateTo({
                x: row.x + 500,
                y: row.y + 25,
                h: row.h
            }, 0.001, scene.animation.TWEEN_LINEAR, scene.animation.OPTION_LOOP, 1);
            // animate to bring selection into view
            var t = -scrollContent.y;
            if (row.y < t) {
                t = -row.y
                console.log("one");
                scrollContent.animateTo({
                    y: t
                }, 0.3, scene.animation.TWEEN_LINEAR, scene.animation.OPTION_LOOP, 1);
            } else if (row.y + row.h - scene.h > t) {
                t = -(row.y + row.h - scene.h);
                console.log("two");
                scrollContent.animateTo({
                    y: t
                }, 0.3, scene.animation.TWEEN_LINEAR, scene.animation.OPTION_LOOP, 1);
            }
        }

        selectRow(currentRow);

        selectControl(currentControl);

        function updateControlButton() {
           var applicationName = apps[currentRow].displayName;
           controlBar.focusedButton.setFocused(true);
           //console.log("Updating control for " + applicationName);
           if (launchedApps[applicationName] != undefined) {
               var appStatus = optimus.getApplicationById(launchedApps[applicationName]).state();
               console.log("App already launched: " + applicationName + " id:" + launchedApps[applicationName] + " appState:" + appStatus);
               if (appStatus === "RUNNING")
               {
                   controlBar.buttonPLAY.controlText.text = "Switch To";
                   controlBar.buttonPAUSE.controlText.text = "Suspend";
               }
               else if (appStatus === "SUSPENDED")
               {
                   controlBar.buttonPLAY.controlText.text = "Switch To";
                   controlBar.buttonPAUSE.controlText.text = "Resume";
               }
           }
           else
           {
               controlBar.buttonPLAY.controlText.text = "Launch";
               controlBar.buttonPAUSE.controlText.text = "Suspend";
               controlBar.buttonSTOP.controlText.text = "Stop";

           }
        }

        function scrollUp() {
            var numRows = rowcontainer.numChildren;
            currentControl = 0;
            selectRow(clamp(currentRow - 1, 0, numRows - 1));
            updateControlButton();
        }

        function scrollDn() {
            var numRows = rowcontainer.numChildren;
            currentControl = 0;
            //console.log("numRows", numRows);
            //console.log(currentRow);
            selectRow(clamp(currentRow + 1, 0, numRows - 1));
            updateControlButton();
        }

        function updateText(s) {
            for (var i = 0; i < rowcontainer.children.length; i++) {
                rowcontainer.children[i].children[0].text = s;
            }
        }

        scene.root.on("onKeyDown", function(e) {
            if (e.keyCode == keys.UP) scrollUp(); // UP
            else if (e.keyCode == keys.DOWN) scrollDn(); // DOWN
        });

        function updateSize(w, h) {
            select.w = w;
        }

        scene.on("onResize", function(e) {
            updateSize(e.w, e.h);
        });
        updateSize(scene.w, scene.h);
    }

});
