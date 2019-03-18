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


function NavBar(scene, params) {
  const eventManager = scene.getService("getEventManager");
  const parent = params.parent
  const keys = params.keys
  const height = params.height
  const options = params.options
  const optionHeight = height * 0.7
  const baseUrl = px.getPackageBaseFilePath();
  this.currentIndex = 0;
  this.previousIndex = 0;
  const selectedColor = 0x3e81baff
  const defaultColor = 0x363636ff
  const suspendModeActive = 'Suspend Mode Active'

  px.getFile(options[0].uri)
    .then(() => { })
    .catch((error) => {
      options.splice(0, 1)
      this.renderOptions()
    })

  const fontRegular = scene.create({
    t: "fontResource", url: '/usr/share/fonts/DejaVuSans.ttf'
  });

  const fontBold = scene.create({
    t: "fontResource", url: '/usr/share/fonts/DejaVuSans-Bold.ttf'
  });

  this.containerW = parent.w;
  this.containerH = height;
  this.container = scene.create({
    t: "rect", parent, w: this.containerW, h: this.containerH, fillColor: 0x292929ff
  });

  this.titleContainerW = parent.w * 0.5;
  this.titleContainerH = height;
  this.titleContainer = scene.create({
    t: "rect", parent: this.container, h: this.titleContainerH, w: this.titleContainerW, fillColor: 0x00000000
  })
  this.optionsContainer = scene.create({
    t: "rect", parent: this.container, h: height, fillColor: 0x292929ff
  })
  this.optionsInitials = {}

  const renderTitle = () => {
    this.titleH = height
    this.titleW = 90
    this.titleX = 15
    this.titlePixelSize = 26
    this.title = scene.create({
      t: "textBox", parent: this.titleContainer, w: this.titleW, h: height, x: this.titleX, font: fontBold,
      text: "Firebolt", pixelSize: this.titlePixelSize, alignHorizontal: scene.alignHorizontal.RIGHT, alignVertical: scene.alignVertical.CENTER
    });
    this.subTitleH = height
    this.subTitleW = 60
    this.subTitleX = this.title.w + 20
    this.subTitlePixelSize = 26

    this.subTitle = scene.create({
      t: "textBox", parent: this.titleContainer, w: 60, h: height, x: this.subTitleX, font: fontRegular,
      text: "Apps", pixelSize: 26, alignHorizontal: scene.alignHorizontal.LEFT, alignVertical: scene.alignVertical.CENTER
    });

  }
  renderTitle()

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
  this.renderOptions = () => {
    this.optionsContainer.removeAll()
    const padding = 30
    const gapV = 10

    let totalW = 0
    for (let index = 0; index < options.length; index++) {
      const option = options[index];
      const { width, height } = getTextDimensions(option.name)
      const prevChild = this.optionsContainer.getObjectById(index - 1)
      const optionHolderX = prevChild ? (prevChild.x + prevChild.w + gapV) : 0
      const centerY = params.height / 2 - optionHeight / 2
      const optionHolder = scene.create({
        id: index,
        x: optionHolderX,
        y: centerY,
        parent: this.optionsContainer,
        t: "rect", w: width + padding, h: optionHeight, fillColor: defaultColor
      });
      totalW = totalW + (width + padding + gapV)

      const centerX = (width + padding) / 2 - width / 2
      const textBox = scene.create({
        id: 'name',
        parent: optionHolder,
        x: centerX,
        y: optionHeight / 2 - height / 2,
        t: "textBox", font: fontBold,
        text: option.name, pixelSize: parent.w * 0.012
      });
      this.optionsInitials[index] = {
        containerW: width + padding,
        containerX: optionHolderX,
        pixelSize: parent.w * 0.012,
        x: centerX,
        y: parent.h * 0.01,

      }
    }
    this.optionsContainer.w = totalW
    this.optionsContainer.x = this.container.w - totalW

    this.optionsContainerW = this.optionsContainer.w
    this.optionsContainerX = this.optionsContainer.x
    this.optionsContainerH = this.optionsContainer.h
  }


  this.renderOptions()

  this.showSuspendModeStatus = (isSuspendEnabled) => {
    this.activeTextBox = this.container.getObjectById(suspendModeActive)
    if (!this.activeTextBox) {
      const padding = 30
      const gapV = 10
      const { width, height } = getTextDimensions(suspendModeActive)
      const centerY = params.height / 2 - height / 2
      this.activeTextBox = scene.create({
        id: suspendModeActive,
        parent: this.container,
        x: this.optionsContainer.x - width - padding / 2 - gapV,
        y: centerY,
        t: "textBox", font: fontBold,
        text: suspendModeActive, pixelSize: parent.w * 0.012
      });
      this.activeTextBoxX = this.activeTextBox.x
      this.activeTextBoxY = this.activeTextBox.y
      this.activeTextBoxPX = this.activeTextBox.pixelSize
    }
    this.activeTextBox.a = isSuspendEnabled
  }

  this.optionsContainerW = this.optionsContainer.w
  this.optionsContainerX = this.optionsContainer.x
  this.optionsContainerH = this.optionsContainer.h
  this.updateSize = (changeW, changeH) => {
    this.container.w = params.parent.w
    this.container.h = params.height * changeH

    this.titleContainer.w = this.titleContainerW * changeW
    this.titleContainer.h = this.titleContainerH * changeH

    this.title.w = this.titleW * changeW
    this.title.h = this.titleH * changeH
    this.title.x = this.titleX * changeW
    this.title.pixelSize = this.titlePixelSize * changeW

    this.subTitle.h = this.subTitleH * changeH
    this.subTitle.w = this.subTitleW * changeW
    this.subTitle.x = this.subTitleX * changeW
    this.subTitle.pixelSize = this.subTitlePixelSize * changeW

    this.optionsContainer.h = this.optionsContainerH * changeH
    this.optionsContainer.w = this.optionsContainerW * changeW
    this.optionsContainer.x = this.container.w - this.optionsContainer.w

    if (this.activeTextBox) {
      this.activeTextBox.x = this.activeTextBoxX * changeW
      this.activeTextBox.y = this.activeTextBoxY * changeH
      this.activeTextBox.pixelSize = this.activeTextBoxPX * changeW
    }

    this.optionsContainer.children.forEach((container, index) => {
      container.w = this.optionsInitials[index].containerW * changeW
      container.x = this.optionsInitials[index].containerX * changeW
      container.h = optionHeight * changeH
      const name = container.getObjectById('name')
      name.x = this.optionsInitials[index].x * changeW
      name.y = this.optionsInitials[index].y * changeH
      name.pixelSize = this.optionsInitials[index].pixelSize * changeW
    });
  }

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
      this.optionsContainer.getObjectById(this.previousIndex).fillColor = defaultColor
      this.optionsContainer.getObjectById(index).fillColor = defaultColor
      return
    }
    this.optionsContainer.getObjectById(this.previousIndex).fillColor = defaultColor
    this.optionsContainer.getObjectById(index).fillColor = selectedColor
  }


  this.container.on("onKeyDown", (e) => {
    if (e.keyCode === keys.ENTER) {
      params.onOptionSelect(options[this.currentIndex])
    }
    this.previousIndex = this.currentIndex
    if (e.keyCode === keys.RIGHT && this.currentIndex < options.length - 1) {
      this.setSelected(++this.currentIndex)
    }
    if (e.keyCode === keys.LEFT && this.currentIndex > 0) {
      this.setSelected(--this.currentIndex)
    }

    if (e.keyCode === keys.DOWN) {
      this.setFocus(false)
      params.onBlur()
    }
  });

  this.optionsContainer.on("onMouseEnter", (e) => {
    eventManager.fireEvent(eventManager.ON_FOCUS_CHANGE, 'NAV_BAR');
    const index = e.target.id || this.currentIndex
    if (this.previousIndex !== index) {
      this.previousIndex = this.currentIndex
      this.currentIndex = index
      this.setSelected(index)
    }
  })
  this.optionsContainer.on("onMouseLeave", (e) => {
    this.optionsContainer.getObjectById(this.previousIndex).fillColor = defaultColor
  })
  this.optionsContainer.on("onMouseDown", (e) => {
    params.onOptionSelect(options[this.currentIndex])
  })

}
module.exports = NavBar;

