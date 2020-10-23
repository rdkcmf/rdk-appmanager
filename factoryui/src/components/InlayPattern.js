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

// http://www.herethere.net/~samson/php/color_gradient/?cbegin=000000&cend=FFFFFF&steps=10

let COLORS =
[
  0xFF000000, // #000000    //   0% BLACK
  0xFF191919, // #191919    //  10% Gray
  0xFF333333, // #333333    //  20% Gray
  0xFF4c4c4c, // #4c4c4c    //  30% Gray
  0xFF666666, // #666666    //  40% Gray
  0xFF7f7f7f, // #7f7f7f    //  50% Gray
  0xFF999999, // #999999    //  60% Gray
  0xFFb2b2b2, // #b2b2b2    //  70% Gray
  0xFFcccccc, // #cccccc    //  80% Gray
  0xFFe5e5e5, // #e5e5e5    //  90% Gray
  0xFFffffff, // #ffffff    // 100% WHITE

  0xFFff0000, // #ff0000    // RED
  0xFF00ff00, // #00ff00    // GREEN
  0xFF0000ff, // #0000ff    // BLUE
]

export default class InlayPattern extends lng.Component
{
    static _template( )
    {
      var  clr = COLORS[0];

      return {
            TestCard: { w: SCREEN.w, h: SCREEN.h, rect: true, color: clr },
        }
    };

    _init()
    {
      this.index_ = 0;
      this._setState('InlayCycleState');
    }

    _getFocused()
    {
      return this;
    }

    static _states()
    {
      return [
       // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
       class InlayCycleState extends this
       {
         $enter()
         {
          //  console.log(">>>>>>>>>>>>   STATE:  InlayCycleState");
         }


         exitTestPattern()
         {
           this.index_ = 0; // RESET

           // Update
           this.tag("TestCard").color   = COLORS[this.index_];

           this.fireAncestors('$fireCOMMAND',
           {  "obj": this,
               "cb": "HideInlayPattern" } );
         }

         prevScreen()
         {
           if(--this.index_ < 0) this.index_ = 0;

           this.tag("TestCard").color = COLORS[this.index_];
         }

         nextScreen()
         {
           if(++this.index_ > COLORS.length - 1)
           {
              this.exitTestPattern();
              return;
           }

           this.tag("TestCard").color = COLORS[this.index_];
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

             default:
               console.log('InlayCycleState >>> _handleKey() - default: ' + k.keyCode )
               break;
           }
         }
       }, //CLASS
      ]
     }//_states
  }//CLASS
