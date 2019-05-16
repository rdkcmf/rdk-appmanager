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

function appCommander() 
{
  var self = this;
  
  this.optimus = null;
  this.activityMonitor = null;
  this.spark_app = null;
  this.web_app = null;
  this.eventListenerHash = {};
  
  this.rfc_values_retrieved = false;
  this.rfc_destroy_apps_to_clear_mem = true;
  
  this.prev_id_brought_to_front = null;
  this.registered_optimus_handlers = [];
  this.suppressed_on_app_ready_apps = {};
  
  this.init = function()
  {
    if(process.env.RFC_DESTROY_APPS_TO_CLEAR_MEM === "true")
    {
      this.rfc_values_retrieved = true;
      this.rfc_destroy_apps_to_clear_mem = true;
    }
    else if(process.env.RFC_DESTROY_APPS_TO_CLEAR_MEM === "false")
      {
      this.rfc_values_retrieved = true;
      this.rfc_destroy_apps_to_clear_mem = false;
    }
    else if(typeof(process.env.RFC_DESTROY_APPS_TO_CLEAR_MEM) == "undefined")
      console.log("appCommander:env variable RFC_DESTROY_APPS_TO_CLEAR_MEM undefined");
      
    console.log("appCommander:rfc_destroy_apps_to_clear_mem - " + this.rfc_destroy_apps_to_clear_mem);
  }
  
  this.setOptimus = function(_optimus)
  {
    this.optimus = _optimus;
   
    //event handler registered for this optimus object?
    if(!(this.optimus in this.registered_optimus_handlers))
    {
      var self = this;
      
      this.optimus.on("ready", function(app) 
      { 
        //skip onReady events for the bringWebAppToForeground web app 
        //only use onHTMLDocumentLoaded for that
        if(self.web_app != null && self.web_app.id == app.id)
        {
          console.log("appCommander:suppressing onReady event for the bringWebAppToForeground web app. only onHTMLDocumentLoaded events are used for onAppReady for this app." );
          return;
        }
        
        self.onReady(app);
      });

      this.registered_optimus_handlers.push(this.optimus);
    }
    else
      console.log("appCommander:optimus handler already registered, skipping.");
  }
  
  this.setActivityMonitor = function(_activityMonitor)
  {
    this.activityMonitor = _activityMonitor;
  }
  
  this.bringNativeAppToForeground = function(id, props)
  {
    console.log("appCommander:app id [" + id + "] bringNativeAppToForeground");
    
    if(this.optimus == null)
    {
      console.log("appCommander:optimus not set. can not bring app to foreground.");
      return null;
    }
  
    //get appList as a copy because we might modify it to take out destroyed apps
    var app = this.optimus.getApplicationById(id);
    var appList = this.optimus.getApplications().slice();
    
    //set this which is needed for the onAppReady event
    //(the onAppReady event is only fired for whatever we just tried to move to the front)
    this.prev_id_brought_to_front = id;
    
    //already started?
    if(app != null)
    {
      //was this an app that previously had it's onAppReady event suppressed
      //and is now going to be or is already in the foreground?
      if(this.suppressed_on_app_ready_apps[id] === true)
      {
         console.log("appCommander:app id [" + id + "] had a previously suppressed onAppReady event. triggering now.");

         this.suppressed_on_app_ready_apps[id] = false;

         this.onReady(app);
      }
       
      //already running in the foreground?
      if(app.state() == "RUNNING")
      {
          console.log("appCommander:app id [" + id + "] already running in the foreground.");
          app.moveToFront();
          app.setProperties({draw: true});
          return app;
      }
      
      //suspend all other apps
      for(var i=0;i<appList.length;i++)
        if(appList[i].id != id)
        {
          var app_i = appList[i];
        
          console.log("appCommander:suspending pid:'" + app_i.pid + "' id:'" + app_i.id + "'");
          
          suspendAppInternal(app_i);
          app_i.moveToBack();
        }
      
      //resume this app 
      app.resume();
      app.moveToFront();
      app.setProperties({draw: true});
      
      console.log("appCommander:app id [" + id + "] resumed.");
    }
    else if(typeof(props) != "object")
    {
      console.log("appCommander:no properties given to create the app.");
    }
    else
    {
      //app not yet created
      
      if(!this.rfc_values_retrieved)
        console.log("appCommander:rfc values were not retrieved. using defaults.");
      
      if(this.rfc_destroy_apps_to_clear_mem)
      {
        //expected memory usage of the app about to be created
        var expectedMemoryUsage = this.optimus.getExpectedMemoryUsage(props);
        
        //destroy apps until there is enough memory
        this.clearMemory(appList, expectedMemoryUsage);
      }
      else
        console.log("appCommander:destroying apps to clear memory disabled through rfc.");
      
      //need to suspend an already existing app?
      for(var i=0;i<appList.length;i++)
      {
        var app_i = appList[i];
        
        console.log("appCommander:suspending pid:'" + app_i.pid + "' id:'" + app_i.id + "'");
        
        suspendAppInternal(app_i);
        app_i.moveToBack();
      }

      if(this.optimus != null)
        app = this.optimus.createApplication(props);
      else
        console.log("appCommander:app id [" + id + "] not created! optimus not set.");
      
      if(app != null)
      {
        app.moveToFront();
        
        console.log("appCommander:app id [" + id + "] created.");
      }
      else
        console.log("appCommander:app id [" + id + "] was not able to be created.");
    }
    
    return app;
  }
  
  this.bringSparkAppToForeground = function(url, props)
  {
    var did_preload = false;
    
    //need to create the spark instance?
    if(this.spark_app == null || this.spark_app.state() == "DESTROYED")
    {
      preloadSparkInternal(url, props);
      did_preload = true;
    }
    
    //still not created?
    if(this.spark_app == null)
    {
      console.log("appCommander:not able to create the spark instance.");
      return;
    }
    
    //set the url and custom props
    if(!did_preload)
    {
      this.spark_app.url = url;
      
      if(typeof(props) == "object")
        this.spark_app.setProperties(props);
    }
    
    //remove any suppressed onAppReady events
    //because we are going to wait for a new one
    if(this.suppressed_on_app_ready_apps[this.spark_app.id] === true)
    {
        console.log("appCommander:abandoning a previously suppressed onAppReady event because the web app is loading a new app.");

        this.suppressed_on_app_ready_apps[this.spark_app.id] = false;
    }
    
    //bring it to the front
    this.bringNativeAppToForeground(this.spark_app.id);
  }
  
  this.bringWebAppToForeground = function(url, props)
  {
    var did_preload = false;
    
    //need to create the browser instance?
    if(this.web_app == null || this.web_app.state() == "DESTROYED")
    {
      preloadBrowserInternal(url, props);
      did_preload = true;
    }
    
    //still not created?
    if(this.web_app == null)
    {
      console.log("appCommander:not able to create the spark instance.");
      return;
    }
    
    //set the url and custom props
    if(!did_preload)
    {
      this.web_app.api().url = url;
      
      if(typeof(props) == "object")
        this.web_app.setProperties(props);
    }
    
    //remove any suppressed onAppReady events
    //because we are going to wait for a new one
    if(this.suppressed_on_app_ready_apps[this.web_app.id] === true)
    {
        console.log("appCommander:abandoning a previously suppressed onAppReady event because the spark app is loading a new app.");

        this.suppressed_on_app_ready_apps[this.web_app.id] = false;
    }
    
    //bring it to the front
    this.bringNativeAppToForeground(this.web_app.id);
  }
  
  this.clearMemory = function(appList, expectedMemoryUsage, onlySuspendedApps)
  {
    var callStr = this.activityMonitor.callMethod("getAllMemoryUsage");
    console.log("appCommander:activityMonitor.getAllMemoryUsage() - '" + callStr + "'");
    
    if(typeof(onlySuspendedApps) == "undefined")
      onlySuspendedApps = false;
    
    console.log("appCommander:onlySuspendedApps - '" + onlySuspendedApps + "'");
    
    try
    {
      var mem_usage_obj = JSON.parse(callStr);
      
      var total_mem_free = mem_usage_obj.freeMemoryMB;

      if(total_mem_free < 0) total_mem_free = 0;
      
      //set all the memory usages
      for(var i=0;i<appList.length;i++)
      {
        if(appList[i].type == "WEB" && typeof(appList[i].api()) != "undefined" && typeof(appList[i].api().memoryUsage) != "undefined")
          appList[i].actualMemoryUsage = appList[i].api().memoryUsage / 1000000;
        else
          appList[i].actualMemoryUsage = this.getAppIdMemoryUsageFromActivityMonitorObject(appList[i].pid, mem_usage_obj);
      }

      //sort by priority then mem usage
      appList.sort( function(a,b)
      {
        var p_diff = a.priority - b.priority;
        
        if(p_diff)
          return p_diff;
        else
          return b.actualMemoryUsage - a.actualMemoryUsage;
      });
      
      //get total memory used by the apps
      //get total expected memory used by the apps
      var total_mem_used = 0;
      var total_expected_mem_used = 0;
      for(var i=0;i<appList.length;i++)
      {
        var app_i = appList[i];
        
        console.log("appCommander:appList pid:'" + app_i.pid + 
        "' priority:'" + app_i.priority + 
        "' actualMemoryUsage:'" + app_i.actualMemoryUsage + 
        "' expectedMemoryUsage:'" + app_i.expectedMemoryUsage + "'");
        
        if(app_i.actualMemoryUsage > -1)
          total_mem_used += app_i.actualMemoryUsage;
        
        if(app_i.expectedMemoryUsage > -1)
          total_expected_mem_used += app_i.expectedMemoryUsage;
      }
      
      console.log("appCommander:appList expectedMemoryUsage:'" + expectedMemoryUsage + 
                  "' total_mem_used:'" + total_mem_used + 
                  "' total_expected_mem_used:'" + total_expected_mem_used + 
                  "' total_mem_free:'" + total_mem_free + 
                  "' total_max_mem_free:'" + (total_mem_free + total_mem_used) + "'");
      
      //need to destroy apps?
      if(total_mem_free < expectedMemoryUsage ||
          total_mem_free + total_mem_used < expectedMemoryUsage + total_expected_mem_used)
      {
        console.log("appCommander:not enough memory. destroying apps.");
        
        //destroy apps until enough memory is cleared (or all destroyable apps are destroyed)
        var mem_cleared = 0;
        var expected_mem_cleared = 0;
        for(var i=0;i<appList.length;i++)
        {
          var app_i = appList[i];
          
          //don't destroy priority 10 apps
          if(app_i.priority >= 10)
            continue;
          
          //don't destroy if we can't determine any memory gain
          if(app_i.actualMemoryUsage <= 0 && app_i.expectedMemoryUsage <= 0)
            continue;
          
          //skip non suspended apps?
          if(onlySuspendedApps && app_i.state() != "SUSPENDED")
          {
            console.log("appCommander:skipping non suspended app id:'" + app_i.id + "' state:'" + app_i.state() + "'");
            continue;
          }
          
          console.log("appCommander:destroying app " + app_i.pid + 
                      " to clear actual:" + app_i.actualMemoryUsage + 
                      " expected:" + app_i.expectedMemoryUsage);
          
          //keep track of memory cleared
          if(app_i.actualMemoryUsage > 0)
            mem_cleared += app_i.actualMemoryUsage;
          
          if(app_i.expectedMemoryUsage > 0)
            expected_mem_cleared += app_i.expectedMemoryUsage;
          
          //remove app and destroy
          appList.splice(i,1);
          app_i.destroy();
          i--;
          
          console.log("appCommander:(tmf + mc):" + (total_mem_free + mem_cleared) + " >= emu:" + expectedMemoryUsage);
          console.log("appCommander:(tmf + tmu):" + (total_mem_free + total_mem_used) + 
                      " >= ((temu - emc) + emu):" + ((total_expected_mem_used - expected_mem_cleared) + expectedMemoryUsage));
          
          //either we've created enough free memory for the given expected memory
          //or the max memory that could be freed / allocated to those apps is more than the total remaining expected memory usage
          if(total_mem_free + mem_cleared >= expectedMemoryUsage &&
            (total_mem_free + total_mem_used) >= ((total_expected_mem_used - expected_mem_cleared) + expectedMemoryUsage))
          {
            console.log("appCommander:cleared enough memory. exiting loop.");
            break;
          }
        }
        
        console.log("appCommander:cleared " + mem_cleared + " memory.");
      }
      
    } catch(e) { console.log("appCommander:catch - '" + e.message + "'");}
        
  }
  
  this.getAppIdMemoryUsageFromActivityMonitorObject = function(pid, activity_monitor_mem_usage_obj)
  {
    if(typeof(activity_monitor_mem_usage_obj.applicationMemory) != "undefined")
    {
      for(var i=0;i<activity_monitor_mem_usage_obj.applicationMemory.length;i++)
        if(activity_monitor_mem_usage_obj.applicationMemory[i].appPid == pid)
          return activity_monitor_mem_usage_obj.applicationMemory[i].memoryMB;
    }
    
    return -1;
  }
  
  var suspendAppInternal = function(app)
  {
    var suspend_promise = app.suspend();
        
    if(suspend_promise)
    {
      suspend_promise.then(
        function()
        {
          console.log("appCommander:app id [" + app.id + "] suspended.");
        },
        function()
        {
          console.log("appCommander:app id [" + app.id + "] suspend failed.");
        });
    }
    else
    {
      console.log("appCommander:app id [" + app.id + "] suspend_promise false.");
    }
  }
  
  this.launchNativeAppToSuspend = function(props)
  {
    if(typeof(props) != "object")
    {
      console.log("appCommander:launchNativeAppToSuspend no props given");
      return null;
    }
    
    if(typeof(props.id) == "undefined")
    {
      console.log("appCommander:launchNativeAppToSuspend no props.id set");
      return null;
    }
    
    if(this.optimus == null)
    {
      console.log("appCommander:launchNativeAppToSuspend can not launch app to suspend. optimus not set.");
      return null;
    }
    
    //app already exists?
    var app = this.optimus.getApplicationById(props.id);
    if(app != null)
    {
      //already suspended?
      if(app.state() == "SUSPENDED")
        console.log("appCommander:launchNativeAppToSuspend app id [" + props.id + "] already suspended.");
      else
      {
        suspendAppInternal(app);
        console.log("appCommander:launchNativeAppToSuspend app id [" + props.id + "] suspended.");
      }
      
      return app;
    }
    else
    {
      //create app then suspend it when the onReady() event happens
      
      if(!this.rfc_values_retrieved)
        console.log("appCommander:launchNativeAppToSuspend rfc values were not retrieved. using defaults.");
      
      if(this.rfc_destroy_apps_to_clear_mem)
      {
        //expected memory usage of the app about to be created
        var expectedMemoryUsage = this.optimus.getExpectedMemoryUsage(props);
        
        //destroy apps until there is enough memory
        var appList = this.optimus.getApplications().slice();
        this.clearMemory(appList, expectedMemoryUsage, true);
      }
      else
        console.log("appCommander:launchNativeAppToSuspend destroying apps to clear memory disabled through rfc.");
      
      //add draw false to the build props
      var build_props = Object.assign({}, props);
      build_props.draw = false;
      
      //create the app
      app = this.optimus.createApplication(build_props);
      
      if(app != null)
      {
        //suspend immediately and wait for promise to check if succeeded
        suspendAppInternal(app);
        
        console.log("appCommander:launchNativeAppToSuspend app id [" + props.id + "] created.");
        return app;
      }
      else
      {
        console.log("appCommander:launchNativeAppToSuspend app id [" + props.id + "] not created!");
        return null;
      }
    }
    
    return app;
  }
  
  var preloadSparkInternal = function(uri, props)
  {
    if(self.spark_app != null && self.spark_app.state() != "DESTROYED")
    {
      console.log("appCommander:spark already preloaded.");
      return self.spark_app;
    }
    
    if(self.optimus == null)
    {
      console.log("appCommander:can not preload spark. optimus not set.");
      return null;
    }
      
    //create the app?
    if(self.spark_app == null || self.spark_app.state() == "DESTROYED")
    {
      if(self.spark_app != null && self.spark_app.state() == "DESTROYED")
        console.log("appCommander:preloaded spark app was destroyed! recreating.");
      
      //setup default props
      var build_props = {
          x: 0, y: 0, w: 1280, h: 720,
          cx: 0, cy: 0, sx: 1.0, sy: 1.0, r: 0, a: 1, interactive: true,
          painting: true, clip: false, mask: false, draw: false
        };
      
      //use custom props?
      if(typeof(props) == "object")
        build_props = Object.assign(build_props, props);
      
      //set preload uri
      var app_uri = "";
      if(typeof(uri) != "undefined" && uri != null)
        app_uri = uri
        
      //set priority
      build_props.priority = 9;
      
      //get a free id
      build_props.id = self.optimus.getFreeID(4444);
      
      //set launchParams
      build_props.launchParams = {"cmd": "sparkInstance", "uri": app_uri};
      
      self.spark_app = self.optimus.createApplication(build_props);
      
      //sparkInstance uses the onApplicationLoaded event to determine if 
      //the url change succeeded for the onAppReady event
      self.spark_app.ready.then(function() 
      {
        self.spark_app.api().on("onApplicationLoaded", function(e)
        {
          if(e.success)
            self.onReady(self.spark_app);
          else
            console.log("appCommander:onApplicationLoaded failed");
        });
      });
    }

    //failed to create the app
    if(self.spark_app == null || self.spark_app.state() == "DESTROYED")
      console.log("appCommander:failed to preload spark!");
    
    return self.spark_app;
  }
  
  var preloadBrowserInternal = function(uri, props)
  {
    if(self.web_app != null && self.web_app.state() != "DESTROYED")
    {
      console.log("appCommander:browser already preloaded.");
      return self.web_app;
    }
    
    if(self.optimus == null)
    {
      console.log("appCommander:can not preload the browser. optimus not set.");
      return null;
    }
    
    //create the app?
    if(self.web_app == null || self.web_app.state() == "DESTROYED")
    {
      if(self.web_app != null && self.web_app.state() == "DESTROYED")
        console.log("appCommander:preloaded WPE was destroyed! recreating.");
        
      //setup default props
      var build_props = {
          x: 0, y: 0, w: 1280, h: 720,
          cx: 0, cy: 0, sx: 1.0, sy: 1.0, r: 0, a: 1, interactive: true,
          painting: true, clip: false, mask: false, draw: false
        };
        
      //use custom props?
      if(typeof(props) == "object")
        build_props = Object.assign(build_props, props);
      
      //set preload uri
      var app_uri = "";
      if(typeof(uri) != "undefined" && uri != null)
        app_uri = uri
        
      //set priority
      build_props.priority = 9;
      
      //get a free id
      build_props.id = self.optimus.getFreeID(4444);
      
      //set launchParams
      build_props.launchParams = {"cmd": "WebApp", "uri": app_uri};
      
      self.web_app = self.optimus.createApplication(build_props);
      
      //web uses the onHTMLDocumentLoaded event to determine if 
      //the url change succeeded for the onAppReady event
      self.web_app.readyBase.then(function() 
      {
        self.web_app.api().on("onHTMLDocumentLoaded", function(e)
        {
          if(e.success)
            self.onReady(self.web_app);
          else
            console.log("appCommander:onHTMLDocumentLoaded failed");
        });
      });
    }

    //failed to create the app
    if(self.web_app == null || self.web_app.state() == "DESTROYED")
      console.log("appCommander:failed to preload WPE!");
    
    return self.web_app;
  }
  
  this.preloadSpark = function()
  {
    preloadSparkInternal();
  }
  
  this.preloadBrowser = function()
  {
    preloadBrowserInternal();
  }

  this.onReady = function(app)
  {
    if(this.prev_id_brought_to_front != app.id)
    {
      console.log("appCommander:suppressing onAppReady event. app not the one previously brought to the front - prev_id:'" + this.prev_id_brought_to_front + "' cur_id:'" + app.id + "'" );
      console.log("appCommander:adding app id:'" + app.id + "' to suppressed_on_app_ready_apps list to be reattempted on bringAppToForeground");
      
      this.suppressed_on_app_ready_apps[app.id] = true;
    }
    else
      this.notifyListeners("onAppReady", app);
  }
  
  this.notifyListeners = function(eventName, app) 
  {
    if (eventName in this.eventListenerHash)
    {
      var _array = this.eventListenerHash[eventName];
      for (var i = 0; i < _array.length; i++) 
      {
        _array[i](app);
      }
    }
  }
  
  this.on = function(eventName, handler)
  {
    if (eventName in this.eventListenerHash)
    {
      var _array = this.eventListenerHash[eventName];
      _array.push(handler);
    }
    else
    {
      this.eventListenerHash[eventName] = [handler];
    }
  };
  
  this.removeListener = function(eventName, handler)
  {
    if (eventName in this.eventListenerHash)
    {
      if (handler) 
      {
        var _array = this.eventListenerHash[eventName];
        var _index = _array.indexOf(handler);
        while (_index !== -1) 
        {
          _array.splice(_index, 1);
          _index = _array.indexOf(handler);
        }
      }
      else
      {
        delete this.eventListenerHash[eventName];
      }
    }
  };
  
  this.init();
}

var AppCommander = new appCommander();
module.exports = AppCommander;
