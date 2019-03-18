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

const directory = px.getPackageBaseFilePath();
function MenuItem(scene, params) {
  this.data = params.data
  const iconBackgroundUrl = `${directory}/images/${this.data.icon}`
  const containerW = params.w
  const containerH = params.h
  const containerX = params.x
  const containerY = params.y
  this.container = scene.create({
    id: params.id,
    t: "rect", parent: params.parent, w: containerW, h: containerH, fillColor: 0x00000000,
    x: containerX, y: containerY
  })
  const imageBackgroundW = params.w
  const imageBackgroundH = params.h
  this.imageBackground = scene.create({
    id: "imageBackground",
    t: "image", parent: this.container, w: imageBackgroundW, h: imageBackgroundH, url: iconBackgroundUrl,
    stretchX: 1, stretchY: 1
  })

  this.updateSize = (changeW, changeH) => {
    this.container.w = changeW * containerW
    this.container.h = changeH * containerH
    this.container.x = changeW * containerX
    this.container.y = changeH * containerY

    this.imageBackground.w = imageBackgroundW * changeW
    this.imageBackground.h = imageBackgroundH * changeH
  }
}

function Menu(scene, params) {
  const eventManager = scene.getService("getEventManager");
  const keys = params.keys
  this.options = params.options
  this.optionW = params.itemWidth
  this.optionH = params.itemHeight
  this.children = []
  this.currentIndex = 0
  this.previousIndex = 0
  const menuW = params.parent.w
  const menuH = params.parent.h
  let isMouseEnter = false
  this.currentAppIndex = 0
  this.container = scene.create({
    id: params.id,
    t: "rect", parent: params.parent, w: menuW, h: menuH, fillColor: 0x00000000,
    x: 0, y: 0
  })
  let containerW = this.container.w
  let containerH = this.container.h
  let containerX = this.container.x
  this.setOptions = (options) => {
    this.options = options
    this.renderOptions()
  }
  this.renderOptions = () => {
    this.container.removeAll()
    let optionsWidth = 0
    for (let index = 0; index < this.options.length; index++) {
      optionsWidth += params.itemWidth + params.gapV
      const option = this.options[index];
      const config = {
        parent: this.container,
        x: (index * this.optionW) + (index * params.gapV),
        w: this.optionW,
        h: this.optionH,
        y: this.container.h * 0.15,
        id: index,
        data: option
      }
      const menuItem = new MenuItem(scene, config)
      this.children.push(menuItem)
    }
    this.container.w = optionsWidth - params.gapV
    const menuX = (params.parent.w - optionsWidth) / 2
    this.container.x = menuX
    containerW = this.container.w
    containerH = this.container.h
    containerX = this.container.x
  }

  this.getStatusIconPath = (index, isActive) => {
    const icon = isActive ? this.options[index].selectedIcon : this.options[index].icon
    return `${directory}/images/${icon}`
  }
  this.setSelected = (index) => {
    if (this.container.getObjectById(this.previousIndex)) {
      this.container.getObjectById(this.previousIndex).getObjectById('imageBackground').url = this.getStatusIconPath(this.previousIndex, false)
    }
    if (this.container.getObjectById(index)) {
      this.container.getObjectById(index).getObjectById('imageBackground').url = this.getStatusIconPath(index, true)
    }
  }
  this.hide = () => {
    params.parent.a = 0;
  }
  this.show = (currentAppIndex) => {
    this.currentAppIndex = currentAppIndex
    params.parent.a = 1;
    this.container.focus = true
  }
  this.setFocus = (focus) => {
    if (isMouseEnter) {
      params.parent.interactive = focus
      this.container.interactive = focus
      params.parent.a = focus;
      this.container.focus = focus
      if (!focus) isMouseEnter = false
    }
  }
  this.updateSize = (changeW, changeH) => {
    this.container.w = containerW * changeW
    this.container.h = containerH * changeH
    this.container.x = containerX * changeW

    for (let index = 0; index < this.children.length; index++) {
      const menuItem = this.children[index]
      menuItem.updateSize(changeW, changeH)
    }
  }
  this.moveForward = () => {
    params.parent.a = 1;
    params.parent.moveForward()
    this.container.focus = true
  }

  this.container.on("onKeyDown", (e) => {
    this.previousIndex = this.currentIndex
    if (e.keyCode === keys.RIGHT && this.currentIndex < this.options.length - 1) {
      this.setSelected(++this.currentIndex)
    }
    if (e.keyCode === keys.LEFT && this.currentIndex > 0) {
      this.setSelected(--this.currentIndex)
    }
    if (e.keyCode === keys.ENTER) {
      params.onClose()
      this.options[this.currentIndex].action()
      return
    }

    if (e.keyCode == keys.M && keys.is_CTRL(e.flags)) {
      params.onClose()
      return
    }
  });
  this.renderOptions()
  this.setSelected(this.currentIndex)

  this.container.on("onMouseEnter", (e) => {
    if (!params.parent.a) return
    isMouseEnter = true
    eventManager.fireEvent(eventManager.ON_FOCUS_CHANGE, 'MENU_BAR');
    const index = e.target.parent.id || this.currentIndex
    if (this.previousIndex !== index) {
      this.previousIndex = this.currentIndex
      this.currentIndex = index
      this.setSelected(index)
    }
  })
  this.container.on("onMouseLeave", (e) => {
    if (!params.parent.a) return
    isMouseEnter = false
    this.container.getObjectById(this.previousIndex).getObjectById('imageBackground').url = this.getStatusIconPath(this.previousIndex, false)
  })
  this.container.on("onMouseDown", (e) => {
    if (!params.parent.a) return
    params.onClose()
    this.options[this.currentIndex].action()
  })
}

module.exports = Menu;