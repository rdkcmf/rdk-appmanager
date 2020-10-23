
import MenuItemFactory  from "./MenuItemFactory";

import { COLOR_BG, COLOR_BG2, COLOR_HILITE, ITEM_W, ITEM_H, shdw,
        TAB_W, TAB_H, TAB_FONT_PTS, TAB_FONT_COLOR } from './Globals';

export default class MenuListTab extends lng.Component
{
    static _template( )
    {
      return {
          flexItem: { minWidth: TAB_W, minHeight: TAB_H },

          TabBG:
          {
            w: TAB_W, h: TAB_H + 30,
            rect: true,
            color:  COLOR_BG2,
          },

          TabLabelBG:
          {
            x: (TAB_W * 0.2)/2, y: 25/2,
            w: (TAB_W * 0.8), h: TAB_H,
            rect: true,
            color: COLOR_BG,

            TabLabel:
            {
               w: (TAB_W * 0.8), h: (TAB_H * 0.99),
              text: { text: '<TabName>', fontFace: 'Regular',
                      fontSize: TAB_FONT_PTS, textColor: TAB_FONT_COLOR,
                      lineHeight: TAB_H + 0.5,
                      textAlign: 'center', verticalAlign: 'top',
                     ...shdw
                    },
            },
          },

          MenuItems:
          {
            flex: { direction: 'column' },
            flexItem:{ /*alignSelf: 'stretch',*/ grow: 0, maxWidth: ITEM_W, minHeight: ITEM_H },

           zIndex: 5, //10,
            alpha: 0,
            x: 0, y: TAB_H + ITEM_H/2, // offset from Tab text
            children:[]
          },
      }
    };

    _focus()
    {
      var bg = this.tag("TabLabelBG");
      if(bg) bg.color = COLOR_HILITE;

      var menuItems = this.tag("MenuItems")
      if(menuItems)
      {
        menuItems.alpha = 1;
        menuItems.x     = -this.finalX;
      }
    }

    _unfocus()
    {
      var bg = this.tag("TabLabelBG");
      if(bg) bg.color = COLOR_BG;

      var menuItems = this.tag("MenuItems")
      if(menuItems)
      {
        menuItems.alpha = 0;
      }
    }

    _init()
    {
      this.itemIndex = 0;

      if(this.tabItem)
      {
        this.label = this.tabItem.name;
        this.items = this.tabItem.menu; //setter
      }

      this._setState('MenuItemsState')
    }

    get _Label()
    {
      return this.tag('TabLabel');
    }

    set label(s)
    {
      this.tag("TabLabel").text.text = s;
    }

    set items( list )
    {
      var menuItems = this.tag("MenuItems")

      let data = this.tabItem.data

      menuItems.children = list.map( item =>
      {
        item.data = data;

        return MenuItemFactory.createItem(item)
      });
    }

    static _states(){
      return [
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        class MenuItemsState extends this
        {
          $enter()
          {
            //console.log("MenuItemsState - ENTER")
          }

          _getFocused()
          {
            var items = this.tag("MenuItems");
            if(items)
            {
              return items.children[this.itemIndex];
            }
          }

          _handleUp()
          {
            var items = this.tag("MenuItems").children;

            if(--this.itemIndex < 0)
            {
              this.itemIndex = items.length - 1;// 0;
            }
          }

          _handleDown()
          {
            var items = this.tag("MenuItems").children;

            if(++this.itemIndex > items.length - 1)
            {
              this.itemIndex = 0; // items.length - 1;
            }
          }

          // GLOBAL key handling
          // _handleKey(k)
          // {
          //   // console.log("handleKey() ... code: " + k.keyCode);
          //   switch( k.keyCode )
          //   {
          //     case  8: // 'LAST' key on remote
          //     case 27: // ESC key on keyboard
          //     case 73: // '...' Menu key on PlatCo remote

          //     case 37:
          //     case 39:
          //       console.log("TAB >>> GOT key code: " + k.keyCode + ' <<< IGNORED 11')
          //       return false; // DON'T handle
          //       break;

          //     default:
          //       //console.log("TAB >>> GOT key code: " + k.keyCode + ' <<< IGNORED 22')
          //       return false; // DON'T handle
          //     }//SWITCH

          //     return false
          // }
        }
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      ]
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////
  }//CLASS
