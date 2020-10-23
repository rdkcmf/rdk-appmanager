
import {  COLOR_BG, COLOR_HILITE,
  ITEM_W, ITEM_H, shdw, SCREEN,
  MENU_FONT_PTS,
  MENU_FONT_PTS_lo, MENU_FONT_COLOR } from './Globals';

  export default class MenuItemBase extends lng.Component
  {
    static _template( )
    {
      return {
          Label:
          {
            mount: 0.5,
            text: {
              text: "<Base Txt>",
              fontSize: ( (SCREEN.precision < 1) ? (MENU_FONT_PTS_lo) : MENU_FONT_PTS),
              textColor: MENU_FONT_COLOR,
              ...shdw
            },
          },
      }
    }

    get label()
    {
      var obj = this.tag("Label")

      return obj ? obj.text.text : "";
    }

    set label(s)
    {
      var obj = this.tag("Label")
      if(obj)
      {
        if(obj.text != null)
        {
          obj.text.text = s;
        }
        else
        {
          console.log('odd')
        }
      }
    }

    set background(clr)
    {
      this.color = clr;
    }

    _focus()
    {
      this.background = COLOR_HILITE;
    }

    _unfocus()
    {
      this.background = COLOR_BG;
    }

    _getFocused()
    {
      return this
    }

    didChange(v)
    {
      console.log('MenuItemBase::didChange() - NOT IMLEMENTED    v: ' + JSON.stringify(v) )
      console.log('MenuItemBase::didChange() - NOT IMLEMENTED    v: ' + JSON.stringify(v) )
    }

    _init()
    {
      // Defaults
      this.w              = ITEM_W
      this.h              = ITEM_H
      this.color          = COLOR_BG;
      this._text          = "<123text>"
      this._textAlign     = 'center';
      this._verticalAlign = 'middle';

      if(this.item)
      {
        this.label = this.item["Text"];
        this.color = this.item["Background"] || COLOR_BG;

        var posX   = this.w/2; // DEFAULT: center
        var alignX = 0.5;      // DEFAULT: center

        if(this.item["Align"])
        {
          alignX = this.item["Align"] == "center" ? 0.5 :
                   this.item["Align"] == "right"  ? 1.0 : 0.0;

          posX = this.item["Align"] == "center" ? this.w/2 :
                 this.item["Align"] == "right"  ? this.w   : 0.0;
        }

      } // ITEM

      this.patch(
      {
        rect: true,
          color: this.color,
          w: this.w,
          h: this.h,
          Label:
          {
            mountX: alignX,
            x: posX,
            y: this.h/2 + 3,

            text:
            {
              textAlign:     this._textAlign,
              // verticalAlign: this._verticalAlign
            }
          }
      });
    }

      //////////////////////////////////////////////////////////////////////////////////////////////////
    }//CLASS
