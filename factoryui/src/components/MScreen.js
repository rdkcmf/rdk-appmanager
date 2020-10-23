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

let OrangeCLR = 0xFFfebf00 //   #febf00
let GrayCLR   = 0xFF888888 //   #888888

export default class MScreen extends lng.Component
{
    static _template( )
    {
      let hh = SCREEN.h * 0.33

      return  {
        MScreen_bg:
        {
          w: hh,
          h: hh,
          color: OrangeCLR,
          rect: true,

          MText:
          {
            mount: 0.5,
            x: (SCREEN.precision * hh)/2,
            y: (SCREEN.precision * hh)/2 + (SCREEN.precision * 30),
            text: {
              text: "M",
              fontSize: ( (SCREEN.precision < 1) ? 125 : 250),
              textColor: 0xFF000000,
              textAlign:  'center'
            }
          }
        }
      }
    };

    _init()
    {
      this._setState('ActiveState');
    }

    _getFocused()
    {
      return this;
    }

    static _states()
    {
      return [
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        class ActiveState extends this
        {
          $enter()
          {
             // console.log(">>>>>>>>>>>>   STATE:  ActiveState");

            this.tag('MScreen_bg').setSmooth('color', OrangeCLR, { duration: 0.5 });
          }
        }, //CLASS
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        class InctiveState extends this
        {
          $enter()
          {
             // console.log(">>>>>>>>>>>>   STATE:  InctiveState");

            this.tag('MScreen_bg').setSmooth('color', GrayCLR, { duration: 0.5 });
          }
         }, //CLASS
         // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      ]
     }//_states
  }//CLASS
