
// import jsonKeypath from 'json-keypath';
import {  COLOR_BG, COLOR_HILITE,
          ITEM_W,  ITEM_H,
          ITEM_W2, ITEM_H2, shdw,
          MENU_FONT_PTS, SCREEN,
          MENU_FONT_PTS_lo, MENU_FONT_COLOR } from './Globals';

import Progress from "./Progress"

export default class MenuItemRange extends lng.Component
{
    static _template( )
    {
      return {
        w: ITEM_W, h: ITEM_H,
        rect: true,
        color: COLOR_BG,

        ProgressBar:
        {
          type: Progress,
          mountY: 0.5,
          x: 4, y: (h => h/2 - 4),
          w: ITEM_W2 * 0.5,
          h: ITEM_H2 * 0.75
        },

        ProgressTxt:
        {
          w: ITEM_W2/2,
          mountX: 1.0,
          x: ITEM_W2,

          text: {
            text: "",
            fontSize: ( (SCREEN.precision < 1) ? (MENU_FONT_PTS_lo + 14) : MENU_FONT_PTS),
            textColor: MENU_FONT_COLOR,
            textAlign: 'center',
            verticalAlign: 'middle',
            maxLines: 1,
            wordWrapWidth: (w => w),
            textOverflow: 'clip',
            ...shdw
          },
        }
      }
    }

    _focus()
    {
      this.color = COLOR_HILITE;
    }

    _unfocus()
    {
      this.color = COLOR_BG;
    }

    _getFocused()
    {
      return this.tag("ProgressBar");
    }

    _init()
    {
      let bar = this.tag("ProgressBar")

      if(this.rangeSet["Min"] != undefined)
      {
        bar.min = this.rangeSet["Min"]
      }

      if(this.rangeSet["Max"] != undefined)
      {
        bar.max = this.rangeSet["Max"]
      }

      if(this.rangeSet["Step"] != undefined)
      {
        bar.step = this.rangeSet["Step"]
      }


      if(this.rangeSet["Value"] != undefined)
      {
        bar.value = this.rangeSet["Value"]

        this.updateLabel(bar.value)
      }
    }

    updateLabel(value)
    {
      if(value == undefined || value == null)
      {
        console.log('MenuItemRange::updateLabel() <<< Bad Args...')
        return
      }

      var txt = this.tag("ProgressTxt");
      if(txt != null && txt != undefined)
      {
        if(!isNaN(value)) // true == number type
        {
          try
          {
            var str = value
            if(typeof value != 'string')
            {
              str = '' + value.toFixed(1) + ''
            }
            else
            {
              console.log('MenuItemRange::updateLabel('+value+') is a STRING')
            }
            txt.text = str
          }
          catch(e)
          {
            console.log('MenuItemRange::updateLabel() <<< EXCEPTION ... e: ' + e)
          }
        }
        else
        {
          console.log('MenuItemRange::updateLabel() <<< string ...')
          txt.text = value
        }
      }
      else
      {
        console.log('MenuItemRange::updateLabel() <<< Progress Bar not ready...')
      }
    }

    didChange(v)
    {
      // console.log('MenuItemRange::didChange("' + v + '") ...');

      try
      {
        this.setValue(v)
      }
      catch(e)
      {
        console.log('MenuItemRange::didChange("' + v + '") ... EXCEPTION: ' + JSON.stringify(e, null,4) );
      }
    }

    setValue(v)
    {
      // console.log("RANGE - setValue() >>>> " + v)

      var bar = this.tag("ProgressBar");

      if(bar)
      {
        bar.setValue(v);
        this.updateLabel(v)
      }
      else
      {
        console.log('MenuItemRange::setValue() <<< Progress Bar not ready...')
      }
    }

    setProgress(v)
    {
      var bar = this.tag("ProgressBar");
      (v > 0) ? bar.inc() : bar.dec();

      this.updateLabel(bar.value)
    }

    _handleLeft() // TAB LEFT
    {
      this.setProgress(-1) //dec

      var bar = this.tag("ProgressBar");
      let ans = bar.value;

      this.signal('valueChanged', { "value": ans } )
    }

    _handleRight() // TAB RIGHT
    {
      this.setProgress(1) // inc

      var bar = this.tag("ProgressBar");
      let ans = bar.value;

      this.signal('valueChanged', { "value": ans  } )
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////
  }//CLASS
