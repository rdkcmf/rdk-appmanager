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


function SideNavBar(scene, params) {
  const eventManager = scene.getService("getEventManager");
  const parent = params.parent
  const keys = params.keys
  const height = params.height
  const width = params.width
  const options = params.options
  const optionWidth = 70
  const baseUrl = px.getPackageBaseFilePath();
  const optionChildren = []
  this.currentIndex = 0;
  this.previousIndex = 0;
  const selectedColor = 0xf28926ff
  const defaultColor = 0x000000ff
  const suspendOffUrl = `${baseUrl}/images/switch-off.svg`
  const suspendOnUrl = `${baseUrl}/images/switch-on.svg`
  this.isSuspendEnabled = false
  this.keyDownPressCount = 0;

  this.optionsInitials = {}

  const fontRegular = scene.create({
    t: "fontResource", url: '/usr/share/fonts/DejaVuSans.ttf'
  });

  const fontBold = scene.create({
    t: "fontResource", url: '/usr/share/fonts/DejaVuSans-Bold.ttf'
  });

  this.containerW = params.width;
  this.containerH = params.height;
  this.containerX = parent.w - this.containerW
  const marginRight = params.safeMargin ? scene.w * 0.035 : 0

  this.container = scene.create({
    x: this.containerX, y: params.y,
    a: 0,
    t: "rect", parent, w: this.containerW - marginRight, h: this.containerH, fillColor: defaultColor, interactive: false
  });

  const getTextDimensions = (text) => {
    const textBox = scene.create({
      t: "textBox", font: fontBold,
      text, pixelSize: parent.w * 0.012
    });
    const { bounds } = textBox.measureText()
    const width = Math.abs(bounds.x1) + Math.abs(bounds.x2)
    const height = Math.abs(bounds.y1) + Math.abs(bounds.y2)
    return { width, height }
  }

  const optionHeight = 50 * 0.95
  const dimension = getTextDimensions('Controls')
  const padding = 50
  const optionContainerW = dimension.width + padding
  const optionContainerY = 50 / 2 - optionHeight / 3
  const optionContainerX = this.container.w - (optionContainerW)
  const optionContainer = scene.create({
    id: "optionContainer", interactive: false,
    t: 'rect', parent: this.container, w: optionContainerW, h: optionHeight, fillColor: 0x292929ff,
    x: optionContainerX,
    y: optionContainerY
  })
  const controlsX = optionContainer.w / 2 - dimension.width / 1.5
  const controlsY = optionContainer.h * 0.07
  const text = scene.create({
    id: "optionText",
    t: 'textBox', parent: optionContainer, text: 'Controls', pixelSize: 24, x: controlsX, y: controlsY
  })
  this.optionsInitials['optionContainer'] = {
    optionContainerW: optionContainer.w,
    optionContainerH: optionContainer.h,
    optionContainerX: optionContainer.x,
    optionContainerY: optionContainer.y,
    optionTextX: text.x,
    optionTextY: text.y,
    optionTextPixelSize: 24
  }
  const optionsHeader = scene.create({
    id: "optionsHeader", h: 40,
    t: 'textBox', parent: this.container, text: options.title, pixelSize: 24, x: 30, y: (optionContainer.y + optionContainer.h + 20),
    font: fontRegular
  })
  this.optionsInitials['optionsHeader'] = {
    optionsHeaderX: optionsHeader.x,
    optionsHeaderY: optionsHeader.y,
    optionsHeaderPX: optionsHeader.pixelSize
  }
  this.renderOptions = () => {
    this.optionsInitials['controls'] = []
    for (let index = 0; index < options.options.length; index++) {
      const option = options.options[index];
      const optionH = 45
      const padding = 18
      const container = scene.create({
        id: `control_${index}`,
        x: 20, y: (index * optionH) + (index * padding) + (optionsHeader.y + optionsHeader.h) + 15,
        t: "rect", parent: this.container, w: this.container.w - padding, h: optionH, fillColor: 0x000000ff
      });
      const title = scene.create({
        id: 'title',
        parent: container,
        x: 10,
        y: 5,
        t: "textBox", font: fontRegular,
        text: option.name, pixelSize: 24
      });
      const icon = scene.create({
        id: 'icon',
        t: "image", parent: container, url: option.icon, x: container.w - 80, y: 5, w: 65, h: 30,
        stretchX: 1, stretchY: 1
      });
      this.optionsInitials['controls'].push({
        containerW: container.w,
        containerH: container.h,
        containerX: container.x,
        containerY: container.y,

        titlePX: title.pixelSize,
        titleH: title.h,
        titleX: title.x,
        titleY: title.y,

        iconW: icon.w,
        iconH: icon.h,
        iconX: icon.x,
        iconY: icon.y,

      })
    }
    this.container.getObjectById('control_0').fillColor = 0xf28926ff
  }
  this.renderOptions()

  this.setFocus = (focus) => {
    this.keyDownPressCount = 0;
    this.container.a = focus
    this.container.focus = focus
    this.container.interactive = focus
    optionContainer.interactive = focus
  }

  this.toggleEnableSuspend = () => {
    this.isSuspendEnabled = !this.isSuspendEnabled
    const suspendControl = this.container.getObjectById('control_0').getObjectById('icon')
    suspendControl.url = this.isSuspendEnabled ? suspendOnUrl : suspendOffUrl
  }

  this.container.on("onKeyDown", (e) => {
    if (e.keyCode === keys.ENTER) {
      this.toggleEnableSuspend()
      params.onItemSelect()
    }
    if ((e.keyCode === keys.LEFT) || (e.keyCode === keys.DOWN) || (e.keyCode == keys.M && keys.is_CTRL(e.flags))) {
      this.setFocus(false)
      params.onNavBar()
    }
  });

  this.updateSize = (changeW, changeH) => {
    this.container.w = params.width * changeW
    this.container.h = params.height * changeH
    this.container.x = scene.getWidth() - this.container.w

    this.container.children.forEach((container, index) => {
      if (container.id === 'optionContainer') {
        const initial = this.optionsInitials[container.id]
        container.w = initial.optionContainerW * changeW
        container.h = initial.optionContainerH * changeH
        container.x = initial.optionContainerX * changeW
        container.y = initial.optionContainerY * changeH

        const optionText = container.getObjectById('optionText')
        optionText.x = initial.optionTextX * changeW
        optionText.y = initial.optionTextY * changeH
        optionText.pixelSize = initial.optionTextPixelSize * changeW
        return
      }
      if (container.id.startsWith('control_')) {
        const index = container.id.split("control_").pop()
        const controlInitial = this.optionsInitials.controls[index]

        container.w = controlInitial.containerW * changeW
        container.h = controlInitial.containerH * changeH
        container.x = controlInitial.containerX * changeW
        container.y = controlInitial.containerY * changeH

        const title = container.getObjectById('title')
        title.x = controlInitial.titleX * changeW
        title.y = controlInitial.titleY * changeH
        title.pixelSize = controlInitial.titlePX * changeW

        const icon = container.getObjectById('icon')
        icon.w = controlInitial.iconW * changeW
        icon.h = controlInitial.iconH * changeH
        icon.x = controlInitial.iconX * changeW
        icon.y = controlInitial.iconY * changeH
      }
      if (container.id === 'optionsHeader') {
        const initial = this.optionsInitials[container.id]
        container.x = initial.optionsHeaderX * changeW
        container.y = initial.optionsHeaderY * changeH
        container.pixelSize = initial.optionsHeaderPX * changeW
      }
    })
  }

  this.container.getObjectById('control_0').on("onMouseDown", (e) => {
    this.toggleEnableSuspend()
    params.onItemSelect()
  })

}
module.exports = SideNavBar;