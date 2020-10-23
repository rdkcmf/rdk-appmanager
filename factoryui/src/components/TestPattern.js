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


import { SCREEN } from './Globals';
import { Utils }  from 'wpe-lightning-sdk'


let COLORS =
[
  0xFFff0000, // #ff0000 // RED     // 0
  0xFF00ff00, // #00ff00 // GREEN   // 1
  0xFF0000ff, // #0000ff // BLUE    // 2
  0xFFffffff, // #ffffff // WHITE   // 3
  0xFF000000, // #000000 // BLACK   // 4
  0x00000000  // ------- // CIRCLES // 5
]

export default class TestPattern extends lng.Component
{
    static _template( )
    {
      var  clr = COLORS[0];

      let circlesURL = (SCREEN.precision < 1) ?
            // Utils.asset('images/64-GRAY-9-HD.png') :  //  HD:  1366 × 768
              Utils.asset('images/64-GRAY-9-FHD.png') :  // FHD:  1920 × 1080
              Utils.asset('images/64-GRAY-9-UHD.png')    // UHD:  3840 × 2160

      // console.log('### circlesFHD: ' + circlesURL)
      return {
            TestImage: {
              src: circlesURL, w: SCREEN.w, h: SCREEN.h
            },
            TestCard:  {
              w: SCREEN.w, h: SCREEN.h, rect: true, color: clr
            }
        }
    };


    _init()
    {
      this.index_ = 0;
      this._setState('CycleColorsState');
    }

    _getFocused()
    {
      return this;
    }

    setValue(v)
    {
       /* 0-OFF, 2-RED, 3-GREEN, 4-BLUE, 5-BLACK 6-Press card */

      if(v == 0) // OFF
      {
        this.index_ = 0;

        this.tag("TestCard").visible = false
        this.tag("TestCard").color   = COLORS[this.index_];
      }
      else if( (v - 1) < COLORS.length)
      {
        this.index_ = (v - 1);

        this.tag("TestCard").visible = true
        this.tag("TestCard").color   = COLORS[this.index_];
      }
    }

    static _states()
    {
      return [
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        class CycleColorsState extends this
        {
          $enter()
          {
            //  console.log(">>>>>>>>>>>>   STATE:  CycleColorsState");
          }

          exitTestPattern()
          {
            this.index_ = 0; // RESET

            // Update
            this.tag("TestCard").visible = true;
            this.tag("TestCard").color   = COLORS[this.index_];

            this.fireAncestors('$fireCOMMAND',
            {  "obj": this,
                "cb": "HideTestPattern" } );
          }

          prevScreen()
          {
            if(--this.index_ < 0) this.index_ = 0;

            this.tag("TestCard").color = COLORS[this.index_];
          }

          nextScreen()
          {
            let last_index = COLORS.length - 1;

            if(++this.index_ > last_index)
            {
              this.exitTestPattern()
              return
            }

            // Update
            this.tag("TestCard").visible = (this.index_ != last_index)
            this.tag("TestCard").color   = COLORS[this.index_];
          }

          _handleLeft() // LEFT
          {
            this.prevScreen()
          }

          _handleRight() // RIGHT
          {
            this.nextScreen()
          }

          _handleKey(k)
          {
            switch(k.keyCode)
            {
              case  8: // 'LAST' key on remote
              case 27: // ESC key on keyboard
              case 73: // '...' Menu key on PlatCo remote

                this.exitTestPattern()
              break;

              // case 0000: // 'SCREEN' key on remote
              //   this.nextScreen()
              // break;


              case 0x42: // 'SCREEN' key on remote

                this.nextScreen()
              break;

              default:
                console.log('CycleColorsState >>> _handleKey() - default: ' + k.keyCode )
                break;
              }//SWITCH

              return true
          }
       }, //CLASS
      ]
     }//_states
  }//CLASS
