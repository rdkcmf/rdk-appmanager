import { Lightning, Utils } from 'wpe-lightning-sdk'

import MenuItemFactory  from './components/MenuItemFactory';

import { KEYS, SCREEN } from './components/Globals';

export default class AppMainScreen extends Lightning.Component
{
  static _template() {

    return {

      GuiContainer:
      {
        alpha: 1.0,
        longpress: {up: 700, down: 600, left: 800, right: 900},

        MenuTabs: {
          flex: { direction: 'row' },  // ROW OF TAB

          // Menu JSON ... injected here
          children: []
        }, // Tabs

      }, //GuiContainer
    }
  }

  _init()
  {
    console.log('MAIN SCREEN')
    console.log('MAIN SCREEN')
    console.log('MAIN SCREEN')
    console.log('MAIN SCREEN')

    this.mainGui = this.tag('GuiContainer')

    SCREEN.precision = this.stage.getOption('precision');

    this.lastState = null;
    this.tabIndex  = 0;
  }

  processMenuJSON(menu, data)
  {
    if(menu && data)
    {
      var tabsTag = this.tag("MenuTabs")

      var tabs = menu["Tabs"] || menu;

      tabsTag.children = tabs.map( tab =>
      {
        let tabItem = { Type: tab.Type,
                        name: tab.Text,
                        menu: tab.Items,
                        data: data };

        return MenuItemFactory.createItem(tabItem)
      })

      this._setState('MainGuiState');
    }
    else
    {
      console.log(">>>>>>>>>>>>   processMenuJSON() - ERROR");
      console.log(">>>>>>>>>>>>   processMenuJSON() - ERROR");
    }
  }

  static _states(){
    return [

          // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          class MainGuiState extends this
          {
            _getFocused()
            {
              var tabs = this.tag('MenuTabs').children;
              return tabs[this.tabIndex]; // INDEX OF TAB IN ROW
            }

            _handleLeft() // TAB LEFT
            {
              if(--this.tabIndex < 0) this.tabIndex = 0;
            }

            _handleRight() // TAB RIGHT
            {
              var tabs = this.tag("MenuTabs").children;
              if(++this.tabIndex >= tabs.length - 1) this.tabIndex = tabs.length - 1;
            }

            _handleKey(k)
            {
              console.log('MainGuiState >>> k.keyCode: ' + k.keyCode)

              switch(k.keyCode)
              {
                // case  8: // 'LAST' key on remote
                // case 27: // ESC key on keyboard
                // case 73: // '...' Menu key on PlatCo remote

                //   this._setState('MScreenState')
                //   return true // handled
                // break;

                // case 77: // "Menu" on Factory Remote
                // {
                //   if(!k.altKey && !k.shiftKey && k.ctrlKey)
                //   {
                //     this._setState('MScreenState')
                //   }
                // }
                // break;

                // case KEYS.hfr_M : //76: // M key
                // if(k.altKey && !k.shiftKey && !k.ctrlKey)
                // {
                //   console.log('MainGuiState >>>  ALT  k.keyCode: ' + k.keyCode)
                //   this._setState('MScreenState')
                // }
                //break;

                default:
                  console.log('MainGuiState >>> _handleKey() - default: ' +k.keyCode )
                  return false // propagate
              }//SWITCH

              return false // propagate
            }
          }, // CLASS - MainGuiState
          // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      ]
  }//_states
} // CLASS - App
