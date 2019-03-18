/*
 * If not stated otherwise in this file or this component's Licenses.txt file the
 * following copyright and licenses apply:
 *
 * Copyright 2019 RDK Management
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
  navBar: 'components/navBar.js',
  SideNavBar: 'components/sideNavBar.js',
  menu: 'components/menu.js',
  scrollable: 'components/scrollable.js',
  Optimus: 'optimus.js',
  eventManager: "services/eventManager.js",
}).then(function importsAreReady(imports) {
  let scene = imports.scene;
  const eventManager = imports.eventManager;
  scene.addServiceProvider(function (serviceName, serviceCtx) {
    if (serviceName == "getEventManager")
      return eventManager;
    else
      return "allow";
  }.bind(this))
  let keys = imports.keys;
  let NavBar = imports.navBar;
  const SideNavBar = imports.SideNavBar;
  const Menu = imports.menu
  let root = scene.root;
  const optimus = imports.Optimus;
  optimus.setScene(scene);
  var ethIP = px.appQueryParams.ethIP; // ethernet Ip address
  if (ethIP === undefined) { ethIP = "NA"; }
  const launchedApps = {};
  let nextAppId = 1001;
  const actualH = 720
  const actualW = 1280
  const directory = px.getPackageBaseFilePath();
  var applicationConfigOverride = process.env.PXSCENE_APPS_CONFIG || '';
  let isAppOpenFromOptions = false
  let isSuspendEnabled = false
  const launchPage = () => {
    isSuspendEnabled = false
    var applicationOverrideList = px.getFile(applicationConfigOverride);
    applicationOverrideList.then((data) => {
      console.log("Using " + applicationConfigOverride);
      loadPage(JSON.parse(data));
    }).catch(function importFailed(err) {
      console.log("Import failed for: " + applicationConfigOverride)
      const applicationDefaultList = px.getFile(`${directory}/appmanagerregistry.conf`);
      applicationDefaultList.then((data) => {
        loadPage(JSON.parse(data));
      }).catch(function importFailed(err) {
        console.error("Import failed for appmanagerregistry.conf: " + err)
      });
    });
  }

  launchPage();

  const loadPage = (data) => {
    const safeMargin = true
    scene.root.removeAll()
    const mainFullScreen = scene.create({
      t: "rect", parent: root, w: scene.w, h: scene.h, x: 0, y: 0, fillColor: 0x292929ff
    })
    const itemHeight = 213
    const itemWidth = 163
    const gapH = 30
    const gapV = 30
    const fullScreenW = safeMargin ? scene.w - 2 * (scene.w * 0.035) : scene.w
    const fullScreenH = scene.h;
    const fullScreenMarginLeft = safeMargin ? scene.w * 0.035 : 0;
    const fullScreenMarginTop = safeMargin ? scene.h * 0.035 : 0;
    const fullScreen = scene.create({
      t: "rect", parent: mainFullScreen, w: fullScreenW, h: fullScreenH, x: fullScreenMarginLeft, y: fullScreenMarginTop, fillColor: 0x292929ff
    })

    const options = [
      {
        name: 'Diagnostics',
        displayName: "Diagnostics",
        uri: "/home/root/pxDiagnostics/diagnostics.js",
        applicationType: "pxscene",
        version: "1.0",
        url: "usb.png"
      },
      {
        name: 'Controls'
      }
    ]
    // Method execute if navbar lost focus
    const onBlur = () => {
      gridView.setFocus(true);
    }
    // Method execute on option selected
    const onOptionSelect = (app) => {
      if (app.name === "Controls") {
        sideNavBar.setFocus(true)
        return
      }
      launchApp(app)
    }
    const onNavBar = () => {
      navBar.setFocus(true)
    }

    const navBar = new NavBar(scene, { parent: fullScreen, keys: keys, height: 50, options, onBlur, onOptionSelect })

    const mainContentContainer = scene.create({
      t: "rect", parent: fullScreen, w: fullScreen.w, h: (fullScreen.h - navBar.container.h), fillColor: 0x292929ff,
      y: navBar.container.h, x: 0,
      draw: true, clip: true
    })
    const mainContentContainerH = mainContentContainer.h
    const mainContentContainerW = mainContentContainer.w
    const totalHeight = itemHeight + gapV
    const Scrollable = imports.scrollable.Scrollable;
    const scrollable = new Scrollable(scene, mainContentContainer);
    let contentContainer = null

    scrollable.root.h = (totalHeight * Math.ceil(data.applications.length / 4)) + fullScreenMarginTop
    const scrollableContentH = scrollable.root.h
    scrollable.update();
    contentContainer = scrollable.root

    const sideNavOptions = {
      title: 'Options',
      options: [
        {
          name: 'Suspend',
          icon: `${directory}/images/switch-off.svg`
        },
        {
          name: 'Stop',
          icon: `${directory}/images/icon-sidebar-stop.svg`
        },
        {
          name: 'Refresh',
          icon: `${directory}/images/icon-sidebar-refresh.svg`
        }
      ]
    }
    const onItemSelect = () => {
      isSuspendEnabled = !isSuspendEnabled
      gridView.showStatus(isSuspendEnabled)
      navBar.showSuspendModeStatus(isSuspendEnabled)
    }
    const sideNavBar = new SideNavBar(scene, { parent: mainFullScreen, y: fullScreenMarginTop, keys: keys, width: mainFullScreen.w * 0.35, height: mainFullScreen.h * 1.1, options: sideNavOptions, onBlur, onItemSelect, onNavBar, safeMargin })

    const menuHeight = fullScreen.h * 0.33
    const menuWidth = fullScreenW - 30
    const menuY = fullScreen.h - menuHeight
    const menuContainer = scene.create({
      t: "rect", parent: root, w: menuWidth, h: menuHeight,
      y: menuY, x: fullScreenMarginLeft, a: 0
    })
    function GridItem(params) {
      const data = params.data
      const fontRegular = scene.create({
        t: "fontResource", url: '/usr/share/fonts/DejaVuSans.ttf'
      });
      const iconUrl = `${directory}/images/${data.url}`
      const iconBackgroundUrl = `${directory}/images/square.svg`
      const containerH = params.h
      const containerW = params.w
      const containerX = params.x
      const containerY = params.y
      this.container = scene.create({
        id: params.id,
        t: "rect", parent: params.parent, w: params.w, h: params.h, fillColor: 0x00000000,
        x: params.x, y: params.y
      })

      const imageBackgroundW = params.w
      const imageBackgroundH = params.h - 50
      this.imageBackground = scene.create({
        id: "imageBackground",
        t: "image", parent: this.container, w: params.w, h: params.h - 50, url: iconBackgroundUrl,
        stretchX: 1, stretchY: 1
      })

      const imageH = this.imageBackground.h * 0.6
      const imageW = this.imageBackground.w * 0.6
      const imageX = (this.imageBackground.w - imageW) / 2
      const imageY = (this.imageBackground.h - imageH) / 2
      this.image = scene.create({
        t: "image", parent: this.container, url: iconUrl, w: imageH, h: imageW,
        stretchX: 1, stretchY: 1, x: imageX, y: imageY
      });

      const iconStatusUrl = `${directory}/images/app-box.svg`
      const imageStatusH = 20
      const imageStatusW = 20
      const imageStatusX = this.image.x + this.image.w - imageStatusW - 3
      const imageStatusY = imageStatusH + 15
      this.status = scene.create({
        t: "image", parent: this.container, url: iconStatusUrl, w: imageStatusW, h: imageStatusH,
        stretchX: 1, stretchY: 1, x: imageStatusX, y: imageStatusY, a: isSuspendEnabled
      });

      const textW = params.w
      const textH = 50
      const textY = params.h - textH
      const textFontSize = 16
      this.text = scene.create({
        t: "textBox", parent: this.container, w: textW, h: textH, x: 0, y: textY,
        text: data.displayName, font: fontRegular, pixelSize: 16, alignHorizontal: scene.alignHorizontal.CENTER, alignVertical: scene.alignVertical.CENTER
      });

      this.updateSize = (changeW, changeH) => {
        this.container.h = containerH * changeH
        this.container.w = containerW * changeW
        this.container.x = containerX * changeW
        this.container.y = containerY * changeH

        this.imageBackground.h = imageBackgroundH * changeH
        this.imageBackground.w = imageBackgroundW * changeW

        this.image.h = imageH * changeH
        this.image.w = imageW * changeW
        this.image.x = (this.imageBackground.w - this.image.w) / 2
        this.image.y = (this.imageBackground.h - this.image.h) / 2

        if (this.status) {
          this.status.h = imageStatusH * changeH
          this.status.w = imageStatusW * changeW
          this.status.x = imageStatusX * changeW
          this.status.y = imageStatusY * changeH
        }

        this.text.h = textH * changeH
        this.text.w = textW * changeW
        this.text.pixelSize = textFontSize * changeH
        this.text.y = this.container.h - this.text.h
      }
      this.setStatus = (status) => {
        if (status === 'RUNNING') {
          this.status.url = `${directory}/images/app-play.svg`
        } else if (status === 'SUSPENDED') {
          this.status.url = `${directory}/images/app-pause.svg`
        } else {
          this.status.url = `${directory}/images/app-box.svg`
        }
      }
    }


    function GridView(params) {
      this.currentIndex = 0
      this.previousIndex = 0
      const parent = params.parent
      this.data = params.data
      this.children = []
      this.itemWidth = params.itemWidth
      this.itemHeight = params.itemHeight
      const gridViewX = params.parent.x + 250 - fullScreenMarginLeft
      const gridViewY = params.parent.y
      const gridViewW = parent.w
      const gridViewH = parent.h
      this.container = scene.create({
        t: "rect", parent, w: gridViewW, h: gridViewH, fillColor: 0x00000000, x: gridViewX, y: 0
      })
      for (let index = 0; index < this.data.length; index++) {
        const item = this.data[index]
        const y = parseInt(index / params.noOfItemsInRow)
        const x = parseInt(index % params.noOfItemsInRow)
        const config = {
          x: (x * params.itemWidth) + (params.gapH * x),
          y: (y * params.itemHeight) + (params.gapV * y),
          h: params.itemHeight,
          w: params.itemWidth,
          data: item,
          parent: this.container,
          id: index
        }
        const gridItem = new GridItem(config)
        this.children.push(gridItem)
      }

      let currentPage = 0
      let lastPage = 0
      this.scroll = (e) => {
        let extraHeight = 0
        if (e.keyCode === keys.DOWN || e.keyCode === keys.RIGHT) extraHeight = totalHeight
        const currentY = scrollable.root.y + this.container.getObjectById(this.currentIndex).y + extraHeight
        if (mainContentContainer.h < currentY) {
          scrollable.onKeyDown({ keyCode: keys.PAGEDOWN });
        }
        if (currentY <= 0) {
          scrollable.onKeyDown({ keyCode: keys.PAGEUP });
        }
      }

      this.container.on("onKeyDown", (e) => {
        if (e.keyCode == keys.M && keys.is_CTRL(e.flags)) {
          let app = null
          const currentAppIndex = menu.currentAppIndex !== null ? menu.currentAppIndex : gridView.currentIndex
          app = data.applications[currentAppIndex]
          if (!app) return
          const application = optimus.getApplicationById(launchedApps[app.displayName]);
          if (application.state() === 'RUNNING' && isSuspendEnabled && app.applicationType !== 'WebApp' && !isAppOpenFromOptions) {
            updateMenuOptions()
            menu.moveForward()
            return
          }
          if (application && application.state() === 'RUNNING') {
            application.a = 0
            application.interactive = false
            if (isAppOpenFromOptions) {
              navBar.setFocus(true)
              setTimeout(() => {
                stopApp()
              }, 0)
              return
            }

            const app = data.applications[currentAppIndex]
            if (!isSuspendEnabled || (app && app.applicationType === 'WebApp')) {
              gridView.setFocus(true)
              setTimeout(() => {
                stopApp()
              }, 0)
            }
          }
        }
        if (e.keyCode === keys.ENTER) {
          const app = data.applications[gridView.currentIndex]
          var appName = app.displayName
          if (launchedApps[appName] != undefined) {
            var appStatus = optimus.getApplicationById(launchedApps[appName]).state();
            if (appStatus === "RUNNING") {
              optimus.getApplicationById(launchedApps[appName]).moveToFront();
              optimus.getApplicationById(launchedApps[appName]).setFocus(true);
              menu.currentAppIndex = null
              return
            }
            if (isSuspendEnabled && app && app.applicationType !== 'WebApp') {
              updateMenuOptions()
              menu.show(gridView.currentIndex)
            }
          } else {
            menu.currentAppIndex = null
            launchApp()
          }
        }
        this.previousIndex = this.currentIndex
        if (e.keyCode === keys.RIGHT && this.currentIndex < this.data.length - 1) {
          this.setSelected(++this.currentIndex)
        }
        if (e.keyCode === keys.LEFT && this.currentIndex > 0) {
          this.setSelected(--this.currentIndex)
        }
        if (e.keyCode === keys.UP) {
          const index = this.currentIndex - 4
          if (index >= 0) {
            this.currentIndex = index
            this.setSelected(this.currentIndex)
          } else {
            gridView.setFocus(false)
            navBar.setFocus(true)
          }
        }
        if (e.keyCode === keys.DOWN) {
          const index = this.currentIndex + 4
          if (index < this.data.length) {
            this.currentIndex = index
            this.setSelected(this.currentIndex)
          }
        }
        this.scroll(e);
      });

      this.container.on("onMouseDown", (e) => {
        const index = e.target.parent.id || gridView.currentIndex
        if (this.previousIndex !== index) {
          this.previousIndex = gridView.currentIndex
          gridView.currentIndex = parseInt(index)
          this.setSelected(gridView.currentIndex)
          const app = data.applications[gridView.currentIndex]
          var appName = app.displayName
          if (launchedApps[appName] != undefined && isSuspendEnabled && app && app.applicationType !== 'WebApp') {
            updateMenuOptions()
            menu.show(gridView.currentIndex)
          } else {
            menu.currentAppIndex = null
            launchApp()
          }
        }
      })

      this.container.on("onMouseEnter", (e) => {
        eventManager.fireEvent(eventManager.ON_FOCUS_CHANGE, 'GRID_VIEW');
        const selectedBackgroundUrl = `${directory}/images/square_select.svg`
        const index = e.target.parent.id || gridView.currentIndex
        if (this.previousIndex !== index) {
          this.previousIndex = gridView.currentIndex
          gridView.currentIndex = parseInt(index)
          this.setSelected(gridView.currentIndex)
          this.container.getObjectById(index).getObjectById('imageBackground').url = selectedBackgroundUrl
        }
      })

      this.container.on("onMouseLeave", (e) => {
        const backgroundUrl = `${directory}/images/square.svg`
        this.container.getObjectById(this.previousIndex).getObjectById('imageBackground').url = backgroundUrl
        this.container.getObjectById(this.currentIndex).getObjectById('imageBackground').url = backgroundUrl
      })

      this.setFocus = (focus) => {
        this.container.focus = focus
        if (focus) {
          this.setSelected(this.currentIndex)
        } else {
          this.setSelected(this.currentIndex, true)
        }
      }
      this.setSelected = (index, reset) => {
        if (reset) {
          const backgroundUrl = `${directory}/images/square.svg`
          this.container.getObjectById(this.previousIndex).getObjectById('imageBackground').url = backgroundUrl
          this.container.getObjectById(index).getObjectById('imageBackground').url = backgroundUrl
          return
        }
        const backgroundUrl = `${directory}/images/square.svg`
        const selectedBackgroundUrl = `${directory}/images/square_select.svg`
        if (this.container.getObjectById(this.previousIndex)) {
          this.container.getObjectById(this.previousIndex).getObjectById('imageBackground').url = backgroundUrl
        }
        if (this.container.getObjectById(index)) {
          this.container.getObjectById(index).getObjectById('imageBackground').url = selectedBackgroundUrl
        }
      }
      this.setSelected(this.currentIndex)

      this.updateSize = (changeW, changeH) => {
        this.container.h = gridViewH * changeH
        this.container.w = gridViewW * changeW
        this.container.x = gridViewX * changeW
        this.container.y = gridViewY * changeH
        this.itemHeight = this.itemHeight * changeH

        this.itemHeight = itemHeight * changeH
        params.gapH = gapH * changeH
        scrollable.root.h = (this.itemHeight + params.gapH) * Math.ceil(this.data.length / 4) + fullScreenMarginTop;
        scrollable.update()

        for (let index = 0; index < this.children.length; index++) {
          const gridItem = this.children[index];
          gridItem.updateSize(changeW, changeH)
        }
      }
      this.updateStatus = () => {
        for (let index = 0; index < this.data.length; index++) {
          const data = this.data[index];
          const { displayName } = data
          const gridItem = this.children[index]
          const app = optimus.getApplicationById(launchedApps[displayName])
          if (app) {
            gridItem.setStatus(app.state())
          } else {
            gridItem.setStatus()
          }
        }
      }

      this.showStatus = (status) => {
        for (let index = 0; index < this.data.length; index++) {
          const gridItem = this.children[index]
          gridItem.status.a = status;
        }
      }
    }

    const params = {
      parent: contentContainer,
      itemHeight,
      itemWidth,
      gapH: 30,
      gapV: 30,
      noOfItemsInRow: 4,
      maxH: contentContainer.h,
      data: data.applications
    }
    const gridView = new GridView(params)
    gridView.setFocus(true)

    optimus.on("create", (app) => { gridView.updateStatus() });
    optimus.on("ready", (app) => { gridView.updateStatus() });
    optimus.on("suspend", (app) => { gridView.updateStatus() });
    optimus.on("resume", (app) => { gridView.updateStatus() });
    optimus.on("destroy", (app) => { gridView.updateStatus() });

    eventManager.on(eventManager.ON_FOCUS_CHANGE, (type) => {
      if (type === 'NAV_BAR') {
        gridView.setFocus(false)
        sideNavBar.setFocus(false)
        menu.setFocus(false)
        navBar.setFocus(true)
      } else if (type === 'SIDE_NAV_BAR') {
        navBar.setFocus(false)
        gridView.setFocus(false)
        menu.setFocus(false)
        sideNavBar.setFocus(true)
      } else if (type === 'MENU_BAR') {
        navBar.setFocus(false)
        gridView.setFocus(false)
        sideNavBar.setFocus(false)
        menu.setFocus(true)
      } else {
        navBar.setFocus(false)
        sideNavBar.setFocus(false)
        menu.setFocus(false)
        gridView.setFocus(true)
      }
    })

    const launchApp = (application = null) => {
      let app;
      if (application) {
        app = application
        isAppOpenFromOptions = true
      } else {
        const currentAppIndex = menu.currentAppIndex !== null ? menu.currentAppIndex : gridView.currentIndex
        app = data.applications[currentAppIndex]
        isAppOpenFromOptions = false
      }

      if (!app) return

      const { cmdName, displayName, applicationType, uri } = app
      console.log("launch Application");

      if (launchedApps[displayName] != undefined) {
        console.log("App already launched: " + displayName + " id:" + launchedApps[displayName]);
        var _apps = optimus.getApplications();
        console.log("apps size: " + _apps.length);
        for (var index = 0; index < _apps.length; index++) {
          console.log("_app found with name: " + _apps[index].id);
        }
        optimus.getApplicationById(launchedApps[displayName]).a = 1
        optimus.getApplicationById(launchedApps[displayName]).moveToFront();
        optimus.getApplicationById(launchedApps[displayName]).setFocus(true);
      } else {
        console.log("launching Application: " + displayName + " id:" + nextAppId);
        let _launchParams = "";
        if (applicationType == "native") {
          _launchParams = { "cmd": cmdName };
        }
        else if (applicationType == "pxscene") {
          _launchParams = { "cmd": "spark", "uri": uri };
        }
        else if (applicationType == "WebApp") {
          _launchParams = { "cmd": "WebApp", "uri": uri };
        }
        const propsApp = {
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
        const partnerApp = optimus.createApplication(propsApp);
        partnerApp.ready.then(() => { }).catch((error) => {
          partnerApp.destroy()
          eventManager.fireEvent(eventManager.ON_FOCUS_CHANGE, 'GRID_VIEW');
        })
        optimus.primaryApp = partnerApp;
        partnerApp.moveToFront();
        partnerApp.setFocus(true);
        partnerApp.on('onKeyDown', e => {
          if (e.keyCode === keys.M && keys.is_CTRL(e.flags)) {
            const currentAppIndex = menu.currentAppIndex !== null ? menu.currentAppIndex : gridView.currentIndex
            const app = data.applications[currentAppIndex]
            if (partnerApp.state() === 'RUNNING' && isSuspendEnabled && app.applicationType !== 'WebApp' && !isAppOpenFromOptions) {
              updateMenuOptions()
              menu.moveForward()
              return
            }
            partnerApp.a = 0
            partnerApp.interactive = false
            if (isAppOpenFromOptions) {
              navBar.setFocus(true)
              setTimeout(() => {
                stopApp()
              }, 0)
              return
            }
            if (!isSuspendEnabled || (app && app.applicationType === 'WebApp')) {
              gridView.setFocus(true)
              setTimeout(() => {
                stopApp()
              }, 0)
            } else {
              gridView.setFocus(true)
            }
          }
        })
        launchedApps[displayName] = nextAppId;
        nextAppId++;
      }
      console.log('launchApp', app)
      gridView.updateStatus()
    }

    const stopApp = () => {
      let app;
      if (isAppOpenFromOptions) {
        app = options[navBar.currentIndex]
      } else {
        const currentAppIndex = menu.currentAppIndex !== null ? menu.currentAppIndex : gridView.currentIndex
        app = data.applications[currentAppIndex]
      }
      if (!app) return
      const { displayName } = app
      console.log("Stopping application: " + displayName + " id:" + launchedApps[displayName])
      optimus.getApplicationById(launchedApps[displayName]).destroy()
      delete launchedApps[displayName]
      gridView.updateStatus()
      menu.hide()
      if (!isAppOpenFromOptions) {
        eventManager.fireEvent(eventManager.ON_FOCUS_CHANGE, 'GRID_VIEW');
      }
    }
    const suspendApp = () => {
      let app;
      if (isAppOpenFromOptions) {
        app = options[navBar.currentIndex]
      } else {
        const currentAppIndex = menu.currentAppIndex !== null ? menu.currentAppIndex : gridView.currentIndex
        app = data.applications[currentAppIndex]
      }
      console.log('suspendApp', app)
      const { displayName } = app

      if (launchedApps[displayName] != undefined) {
        const app = optimus.getApplicationById(launchedApps[displayName]);
        var appStatus = app.state();
        if (appStatus === "RUNNING") {
          console.log("Suspending application: " + displayName);
          optimus.getApplicationById(launchedApps[displayName]).suspend({});
          app.a = 0
        }
        else if (appStatus === "SUSPENDED") {
          console.log("Resuming application: " + displayName);
          const application = optimus.getApplicationById(launchedApps[displayName])
          application.resume({});
          application.moveToFront();
          application.setFocus(true);
          application.a = 1
          menu.hide()
          return
        }
      } else {
        console.log("App not launched: " + displayName);
        // Do Nothing
      }
      menu.hide()
      gridView.setFocus(true)
      gridView.updateStatus()
    }
    function destroyApps() {
      console.log("destroyApps");
      for (var i in launchedApps) {
        console.log("Destroying app:" + launchedApps[i]);
        const app = optimus.getApplicationById(launchedApps[i]);
        if (app) {
          app.destroy();
        }
        delete launchedApps[i];
      }
      gridView.updateStatus()
      menu.hide()
      eventManager.fireEvent(eventManager.ON_FOCUS_CHANGE, 'GRID_VIEW');
    }
    const switchToHome = () => {
      const currentAppIndex = menu.currentAppIndex !== null ? menu.currentAppIndex : gridView.currentIndex
      const app = data.applications[currentAppIndex]
      var appName = app.displayName
      if (!app) return
      if (launchedApps[appName] != undefined) {
        var appStatus = optimus.getApplicationById(launchedApps[appName]).state();
        if (appStatus === "RUNNING") {
          optimus.getApplicationById(launchedApps[appName]).moveToBack();
          optimus.getApplicationById(launchedApps[appName]).setFocus(false);
        }
      }
      gridView.updateStatus()
      menu.hide()
      gridView.setFocus(true)
    }

    const updateMenuOptions = () => {
      const app = data.applications[gridView.currentIndex]
      var appName = app.displayName
      let options = [...menuOptions]
      if (launchedApps[appName] != undefined) {
        var appStatus = optimus.getApplicationById(launchedApps[appName]).state();
        if (appStatus === "RUNNING") {
          options = [
            menuOptionsObject.stop,
            menuOptionsObject.suspend,
            menuOptionsObject.home
          ]
        }
        if (appStatus === "SUSPENDED") {
          options = [
            menuOptionsObject.resume,
            menuOptionsObject.stop
          ]
        }
      }
      menu.setOptions(options)
      menu.currentIndex = 0
      menu.setSelected(menu.currentIndex)
    }

    const menuOptionsObject = {
      start: {
        name: 'Start',
        action: launchApp,
        selectedIcon: 'control-home-on.svg',
        icon: 'control-home.svg'
      },
      suspend: {
        name: 'Suspend',
        action: suspendApp,
        selectedIcon: 'control-suspend-on.svg',
        icon: 'control-suspend.svg'
      },
      stop: {
        name: 'Stop',
        action: stopApp,
        selectedIcon: 'control-stop-on.svg',
        icon: 'control-stop.svg'
      },
      home: {
        name: 'Home',
        action: switchToHome,
        selectedIcon: 'control-home-on.svg',
        icon: 'control-home.svg'
      },
      resume: {
        name: 'Resume',
        action: suspendApp,
        selectedIcon: 'control-resume-on.svg',
        icon: 'control-resume.svg'
      }
    }
    const menuOptions = [menuOptionsObject.start, menuOptionsObject.suspend, menuOptionsObject.stop]
    const menuConfig = {
      parent: menuContainer,
      options: menuOptions,
      keys,
      itemWidth: menuContainer.w * 0.12,
      itemHeight: menuContainer.w * 0.12,
      gapV: 25,
      onClose: () => {
        menu.hide()
        const application = getCurrentApp()
        if (application && application.state() === 'RUNNING' && isSuspendEnabled) {
          application.setFocus(true)
        } else {
          gridView.setFocus(true)
        }
      }
    }
    const menu = new Menu(scene, menuConfig)
    const showMenu = () => {
      menuContainer.focus = true
      menuContainer.a = 1
    }

    getCurrentApp = () => {
      const currentAppIndex = menu.currentAppIndex !== null ? menu.currentAppIndex : gridView.currentIndex
      const app = data.applications[currentAppIndex]
      return optimus.getApplicationById(launchedApps[app.displayName]);
    }

    root.on("onKeyDown", (e) => {
      if (e.keyCode == keys.E && keys.is_CTRL(e.flags)) {
        console.log("Exit key pressed. Destroying and re-launching Menu");
        destroyApps()
        launchPage()
      }
    })

    if (ethIP != "NA") {
      var displayIp = scene.create({
        t: "text",
        text: "eth0 IP: " + ethIP,
        parent: fullScreen,
        x: safeMargin ? (scene.w * 0.85) - fullScreenMarginLeft : scene.w * 0.87,
        y: safeMargin ? (scene.h * 0.95) - fullScreenMarginTop : scene.h * 0.95,
        textColor: 0xffffffff,
        pixelSize: 14,
        a: 0.6
      });
    }

    const screenW = scene.getWidth();
    const screenH = scene.getHeight();
    if (screenW !== actualW || screenH !== actualH) {
      const changeH = (screenH / actualH)
      const changeW = (screenW / actualW)
      gridView.updateSize(changeW, changeH)
      navBar.updateSize(changeW, changeH)
      menu.updateSize(changeW, changeH)
      sideNavBar.updateSize(changeW, changeH);
    }

    const initialW = scene.w;
    const initialH = scene.h;
    scene.on("onResize", function (e) {
      const changeW = e.w / initialW;
      const changeH = e.h / initialH;
      fullScreen.w = fullScreenW * changeW;
      fullScreen.h = fullScreenH * changeH

      mainContentContainer.w = mainContentContainerW * changeW;
      mainContentContainer.h = mainContentContainerH * changeH
      scrollable.root.h = scrollableContentH * changeH

      menuContainer.w = menuWidth * changeW
      menuContainer.h = menuHeight * changeH
      menuContainer.y = menuY * changeH
      scrollable.updateSize(changeW, changeH);
      gridView.updateSize(changeW, changeH);
      navBar.updateSize(changeW, changeH);
      menu.updateSize(changeW, changeH)
      sideNavBar.updateSize(changeW, changeH);
    });
  }

});

