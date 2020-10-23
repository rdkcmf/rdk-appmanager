/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2020 RDK Management
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


import { COLOR_HILITE } from './Globals';


export default class Progress extends lng.Component
{
    static _template( )
    {
      let RR = lng.shaders.RoundedRectangle;

      var  barClr1  = COLOR_HILITE;
      var  frameClr = 0xFF666666;  // #666666

      var hh = 28
      return {
          ProgressBar: {
            Background: { x: -2, y: 0, w: 4, h: (hh    ), rect: true, color: frameClr, shader: { radius: 8, type: RR} },
            Progress:   { x:  0, y: 2, w: 0, h: (hh - 4), rect: true, color: barClr1,  shader: { radius: 8, type: RR} },
            ZeroMarker: { x:  0, y: 2, w: 3, h: (hh - 4), rect: true, color: 0xFFcccccc, alpha: 0 }
        }
        }
    };

    getProgress()
    {
      return this.value_;
    }

    reset()
    {
      this.value_ = 0;
      this.tag("Progress").w = 0;
    }

    inc()
    {
      this.setValue( this.value_ + this.step_)
    }

    dec()
    {
      this.setValue( this.value_ - this.step_)
    }

    setValue(val, tt = 0.1)
    {
      if(val == this.value_) { return;          };  // no change

      if(val >  this.max_)   { val = this.max_; };  // clamp
      if(val <  this.min_)   { val = this.min_; };  // clamp

      var mw = (this.w - 4);         // Max Width.  2px either side (inset)
      var fx = ( mw / this.span_ )   // scale factor px:value
      var ww = ( val * fx );         // This Width.
      var zp = (0 - this.min_) * fx; // Zero point.

      // console.log(">>  mw: " + mw)
      // console.log(">>  ww: " + ww)
      // console.log(">> val: " + val)

      var bar = this.tag("Progress")
      if(this.min_ == 0)
      {
        bar.x = zp;
        bar.setSmooth('w', ww, {duration: 1});
      }
      else
      {
        if(ww > 0 && val > 0)
        {
          bar.setSmooth('w', ww, {duration: tt});
        }
        else
        {
          ww = -ww

          bar.animation({
            duration: tt,
            stopMethod: 'forward',
            actions: [
              { p: 'x', v: {0: bar.x, 1: (zp - ww)} },
              { p: 'w', v: {0: bar.w, 1: (     ww)} },
            ]
          }).start()
        }
      }

      this.value_ = val;
    }

    set min(v)   { this.min_ = v;  this.recalc()}
    get min( )   { return this.min_  }

    set max(v)   { this.max_ = v;  this.recalc()}
    get max( )   { return this.max_  }

    set step(v)  { this.step_ = v;  this.recalc()}
    get step( )  { return this.step_  }

    set value(v) { return this.setValue(v, 0); }
    get value()  { return this.value_; }

    _init()
    {
      this.span_  = 1;
      this.value_ = 0;
      this.min_   = this.min  ||   0; // default
      this.max_   = this.max  || 100; // default
      this.step_  = this.step ||   1; // default

      this.radius_ = this.radius ||   8; // default

      this.tag("Background").w = this.w;

      this.reset();
      this.recalc();
    }

    setRadius(r)
    {
      //console.log('#######  setRadius('+r+') ...');
      this.radius_ = r;

      let RR = lng.shaders.RoundedRectangle;

      this.patch(
      {
        ProgressBar: {
            Background: {  shader: { radius: this.radius_, type: RR} },
            Progress:   {  shader: { radius: this.radius_,   type: RR} }
        }
      });
    }
    recalc()
    {
      this.span_ = Math.abs(this.max_ - this.min_)

      if(this.span_ == 0) this.span_ = 1;
      if(this.step_ == 0) this.step_ = (this.span_ * 0.1);

      var bar = this.tag("Progress")

      var mw = (this.w - 4); // 2px either side (insets)
      var fx = ( mw / this.span_ )
      var zp = (0 - this.min_) * fx;

      bar.x = zp;

      if(this.min_ < 0)
      {
        this.tag("ZeroMarker").alpha = 1.0;

        var mw = (this.w - 4); // 2px either side (insets)
        var fx = ( mw / this.span_ )
        var zp = (0 - this.min_) * fx;

        this.tag("ZeroMarker").x = zp;
      }
    }

    _getFocused()
    {
      return this;
    }

    _focus()
    {
      this.tag("Background").color = 0xFF333333;
    }

    _unfocus()
    {
      var  frameClr = 0xFF666666;
      this.tag("Background").color = frameClr;
    }

  }//CLASS
