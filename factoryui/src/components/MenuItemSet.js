import MenuItemValue from "./MenuItemValue";

import {  COLOR_BG, COLOR_HILITE,
          ITEM_W,  ITEM_H,
          ITEM_W2
       } from './Globals';

export default class MenuItemSet extends lng.Component
{
    static _template( )
    {
      return {
          w: ITEM_W, h: ITEM_H,
          Container:
          {
           clipping: true,
            w: ITEM_W2, h: ITEM_H,
            rect: true,
            color: 0xFFff0000,

            Values:
            {
             flex:    { direction: 'row' },
             children:[],
            },
          }
        }
    }

    _focus()
    {
      this.background = COLOR_HILITE;
      // TIMEOUT ... then Animate

    }

    _unfocus()
    {
      this.background = COLOR_BG;
      // STOP ... clear timer
    }

    _getFocused()
    {
      // console.log("#####  ITEMS >> _getFocused" )
      var values = this.tag("Values").children;
      if(values.length > 1)
      {
        this._setState('MenuItemSet_Keys');
        return values[this.selectedIndex];
      }
      else
      if(values.length > 0)
      {
        this._setState('MenuItemSet_Idle');
        return values[this.selectedIndex];
      }
    }

    set values( list )
    {
      this.values_  = list;
      var menuItems = this.tag("Values")

      menuItems.children = list.map( item =>
      {
          item.text  = item["Key"] ;  // Value string
          item.value = item["Value"]; // Value value
          item.w     = ITEM_W2;
          item.h     = ITEM_H;

          return {
            type: MenuItemValue,
            item
          };
        })
    }

    _init()
    {
      this.lastIndex     = 0;
      this.selectedIndex = 0;

      this.scrollTransition = { duration: 0.6, timingFunction: 'cubic-bezier(0.20,1.00,0.52,1.00)' };

      if(this.valueSet != undefined)
      {
        this.values = this.valueSet;  // VALUES
      }

      this._setState('MenuItemSet_Idle');
    }

    notifyUpdate()
    {
      if(this.lastIndex == this.selectedIndex)
      {
        return; // No Change
      }

      this.lastIndex    = this.selectedIndex;
      var offset        = ITEM_W2 * this.selectedIndex
      var valueItems    = this.tag("Values")
      valueItems.smooth = { x: [ -offset, this.scrollTransition ] };

      var ans = this.values_[this.selectedIndex]

      // console.log('SP >>> index: ' + this.selectedIndex +
      //             ' of ' + this.values_.length + '  ans: ' + JSON.stringify(ans) )

      this.signal('valueChanged', { "value": ans } )
    }

    didChange(v)
    {
      //console.log('MenuItemSet::didChange("' + v + '") ...');
      this.setValue(v.Key || v)
    }

    setValue(v)
    {
      console.log('MenuItemSet::setValue( '+ v +' )')

      var kids  = this.tag("Values").children;
      var label = kids[this.selectedIndex]

      label.setValue( "" + v )
    }

    static _states() {
      return [
            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
            class MenuItemSet_Idle extends this
            {
              // $enter()
              // {
              //   console.log(">>>>>>>>>>>>   STATE:  MenuItemSet_Idle");
              // }
            },
            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
            class MenuItemSet_Keys extends this
            {
              // $enter()
              // {
              //   console.log(">>>>>>>>>>>>   STATE:  MenuItemSet_Keys");
              // }

              _handleLeft() // LEFT
              {
                var kids = this.tag("Values").children;

                if(kids.length > 0)
                {
                  if(--this.selectedIndex < 0)
                  {
                    this.selectedIndex = 0;
                  }

                  this.notifyUpdate()
                }
              }

              _handleRight() // RIGHT
              {
                var kids = this.tag("Values").children;

                if(kids.length > 0)
                {
                  if(++this.selectedIndex >= kids.length - 1)
                  {
                    this.selectedIndex = kids.length - 1;
                  }

                  this.notifyUpdate()
                }
              }
            }
      ]}


    //////////////////////////////////////////////////////////////////////////////////////////////////
  }//CLASS
