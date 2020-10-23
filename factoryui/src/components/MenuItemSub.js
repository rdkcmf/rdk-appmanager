
import MenuItemBase   from './MenuItemBase';

import MenuItemFactory  from "./MenuItemFactory";

import { ITEM_W, ITEM_H, SCREEN, MENU_FONT_PTS, MENU_FONT_PTS_lo } from './Globals';

export default class MenuItemSub extends MenuItemBase
{
    set subs( list )
    {
      var menuItems = this.tag("SubItems")

      let data = this.item.data

      menuItems.children = list.map( item =>
      {
        item.data = data;

        return MenuItemFactory.createItem(item)
      })
    }

    _init()
    {
      super._init();

      this.subIndex = 0;

      if(this.item)
      {
        this.patch(
        {
          Label:
          {
            text:
            {
              fontSize: ( (SCREEN.precision < 1) ? (MENU_FONT_PTS_lo + 14) : MENU_FONT_PTS + 1),
            }
          },

          SubMenu:
          {
            alpha:   0,
            zIndex: 5, // 10
            x: ITEM_W,

            SubItems:
            {
              flex:    { direction: 'column' },
              flexItem:{ maxWidth: ITEM_W, minHeight: ITEM_H },

              children:[]
            },
          }
        });

        this.subs  = this.item.SubItems;
        this.label = this.item.Text

        this._setState('SubIdleState')
      }
    }

    static _states()
    {
      return [
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        class SubIdleState extends this
        {
          $enter()
          {
            // console.log("SubIdleState - ENTER")
          }

          _handleEnter()
          {
            var count = this.tag("SubItems").children.length;
            var subsH = count * ITEM_H;

            var submenu = this.tag("SubMenu");
            var offset  = this.finalY;

            if( (offset + subsH) > 1080) // off bottom of screen
            {
              var tooFar = (1080  - (offset + subsH))
              submenu.y  = tooFar - ( ITEM_H * 1.5);
            }

            this._setState('SubItemsState')
          }
        },

        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        class SubItemsState extends this
        {
          $enter()
          {
            this.tag("SubMenu").alpha = 1; // SHOW
          }
          $exit()
          {
            this.tag("SubMenu").alpha = 0; // SHOW
          }

          _getFocused()
          {
            var items = this.tag("SubItems");
            return items.children[this.subIndex];
          }

          _handleRight()
          {
            // swallow
            // console.log(">>> _handleRight() - swallow !!")
          }

          _handleLeft()
          {
            this._setState('SubIdleState')
          }

          _handleUp()
          {
            if(--this.subIndex < 0) this.subIndex = 0;
          }

          _handleDown()
          {
            var items = this.tag("SubItems").children;
            if(++this.subIndex >= items.length - 1) this.subIndex = items.length - 1;
          }

          // GLOBAL key handling
          _handleKey(k)
          {
            // console.log("handleKey() ... code: " + k.keyCode);
            switch( k.keyCode )
            {
              case  8: // 'LAST' key on remote
              case 27: // ESC key on keyboard
              case 73: // '...' Menu key on PlatCo remote

                  this._setState('SubIdleState')
                break;

              default:
                console.log("GOT key code: " + k.keyCode)
                  break
            }//SWITCH

            return true
          }
        }
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      ]
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////
  }//CLASS
