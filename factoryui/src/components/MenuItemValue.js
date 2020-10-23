
import MenuItemBase from './MenuItemBase';

import DataModel    from '../DataModel';

import { COLOR_BG, SCREEN, ITEM_W, ITEM_W2, MENU_FONT_PTS, MENU_FONT_PTS_lo } from './Globals';

export default class MenuItemValue extends MenuItemBase
{
    _init()
    {
      super._init()

      this.timeout    = null;
      this.scrollAnim = null;

      // console.log("ITEM SINGLE >>  " + JSON.stringify(this.item) )

      if(this.item)
      {
        // console.log("ITEM params >>  " + JSON.stringify(this.item) )

        this._text         = this.item.text          ? this.item.text          : this._text;
        this._background   = this.item["Background"] ? this.item["Background"] : COLOR_BG;
        this._textAlign    = this.item.textAlign     ? this.item.textAlign     : this._textAlign
        this.verticalAlign = this.item.verticalAlign ? this.item.verticalAlign : this._verticalAlign

        this.x = this.item["x"] || this.x;
        this.y = this.item["y"] || this.y;

        this.w = this.item["w"] || this.w;
        this.h = this.item["h"] || this.h;
      }//ENDIF

      if( this["Text"] )      { this._text      = this["Text"]       }
      if( this["Align"] )     { this._textAlign = this["Align"]      }
      if( this.item["Text"] ) { this._text      = this.item["Text"]  }
      if( this["Align"] )     { this._textAlign = this.item["Align"] }

      this.patch(
      {
        w: this.w,
        h: this.h,

        Label:
        {
          x: this.w/2,
          y: this.h/2 + 3,
          text:
          {
            fontSize: ( (SCREEN.precision < 1) ? (MENU_FONT_PTS_lo + 14) : MENU_FONT_PTS),
            text: this._text,
          }
        }
      })
    }

    didChange(v)
    {
      console.log('MenuItemValue::didChange("' + v + '") ...');

      this.setValue(v)
    }

    setValue(v)
    {
      let label = this.tag('Label')

      label.text = v

      let ww = DataModel.measureTextWidth(label);

      // console.log("#############   ww: " + ww + "  text: " + label.text.text)
      // console.log("#############   ww: " + ww + "  text: " + label.text.text)
      // console.log("#############   ww: " + ww + "  text: " + label.text.text)
      // console.log("#############   ww: " + ww + "  text: " + label.text.text)

      if(ww > ITEM_W2)
      {
        // console.log("#############   LHS")
        // console.log("#############   LHS")
        // console.log("#############   LHS")
        // console.log("#############   LHS")

        label.mountX = 0.0;
        label.x = 0;
      }
    }

    _handleEnter()
    {
      this.fireAncestors('$fireCOMMAND',
      {  "obj": this,
          "cb": this.item["Callback"] } );
    }


    _focus()
    {
      super._focus();

      let label = this.tag('Label')

      // if(label.renderWidth > ITEM_W2)
      // {
      //   console.log("#############  AA  LHS")
      //   console.log("#############  AA  LHS")
      //   console.log("#############  AA  LHS")
      //   console.log("#############  AA  LHS")

      //   label.mountX = 0.0;
      //   label.x = 0;
      // }

      let ww = DataModel.measureTextWidth(label);

      // console.log("#############  FOCUS ...  ww: " + ww + "  text: " + label.text.text)
      // console.log("#############  FOCUS ...  ww: " + ww + "  text: " + label.text.text)
      // console.log("#############  FOCUS ...  ww: " + ww + "  text: " + label.text.text)
      // console.log("#############  FOCUS ...  ww: " + ww + "  text: " + label.text.text)


      // TIMEOUT ... then Animate
      if(false)
      {
        this.timeout = setTimeout( () =>
        {
          let ss = label.x
          let ee = (label.renderWidth - ITEM_W2);

          console.log("ITEM focus >>   label.renderWidth: " + label.renderWidth )
          console.log("ITEM focus >>   this.x:  " + this.x   + " ITEM_W2: " + ITEM_W2)
          console.log("ITEM focus >>       ss:  " + ss + "  ee: " + ee)
          console.log("ITEM focus >>  label.w:  " + label.w + "  finalW: " + label.finalW)

          this.scrollAnim = label.animation({
            duration: 20,
              repeat: -1,
              repeatDelay: 0,
            actions: [
         { p: 'mountX', v: {0.0: 0.5, 0.25: 1.0, 0.5: 0.5, 0.75: 0.0, 1.0: 0.5} },//
              // { p: 'x', v: {0.0: 0.5, 0.25: 1.0, 0.5: 0.5, 0.75: 0.0, 1.0: 0.5} },
            ]
          })

          this.scrollAnim.start()
        }, 2000)
      }//ENDIF

    }

    _unfocus()
    {
      // console.log('#### UNFOCUS() - ENTER ')
      super._unfocus();

      if(this.timeout != null)
      {
        console.log('#### UNFOCUS() - CLEAR TIMEOUT ')
        clearTimeout(this.timeout)
        this.timeout = null;
      }

      if(this.scrollAnim != null)
      {
        console.log('#### UNFOCUS() - CLEAR ANIM ')
        this.scrollAnim.stop()
        this.scrollAnim = null
      }

      // let o = this.tag('Label')

      // o.x = 0;
      // STOP ... clear timer
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////
  }//CLASS
