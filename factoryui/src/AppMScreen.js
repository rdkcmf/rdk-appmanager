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


import { isDEBUG, GLOBAL, KEYS, SCREEN, isAltOnly, isAltKeyCode } from './components/Globals';

import { gDataModel }   from './DataModel';

import AppAgingScreen  from './AppAgingScreen';

let OrangeCLR = 0xFFfebf00 //   #febf00
let GrayCLR   = 0xFF888888 //   #888888

export default class AppMScreen extends lng.Component
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
        },

        Aging: {
          alpha: 0.0,
          type: AppAgingScreen,
        },
      }
    };

    _init()
    {
      this.Aging = this.tag('Aging');

      this._setState('ActiveState');

      this.longTimeout = null
      this.longPressed = false

      // Resume Againg after reboot ????
      this.Aging.getAgingState()  // Get AGING
      .then( (o) =>
      {
        GLOBAL.isAGING = o.value

        // console.log('DEBUG: MMMM GLOBAL.isAGING >> "' + GLOBAL.isAGING + '"')

        if(GLOBAL.isAGING == "true")
        {
          // continue Aging from reboot
          this._setState('StartAgingState');
        }
      });
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

          $enter()
          {
            console.log(">>>>>>>>>>>>   STATE:  MScreenState - ENTER");

           // this.tuner.toggleScan()
          }

          $exit()
          {
            // console.log(">>>>>>>>>>>>   STATE:  MScreenState - EXIT");
          }

          startLongPress(cb, tt)
          {
            if(this.longTimeout == null  &&
               this.longPressed == false )
            {
              // console.log('MScreenState >>>  ALT - START')

              this.longPressed = true
              let done_cb = cb
              this.longTimeout = setTimeout( () =>
              {
                if(done_cb)
                {
                  done_cb()
                }
                this.longTimeout = null
              }, tt);
            }
          }

          stopLongPress()
          {
            if(this.longTimeout != null)
            {
              console.log('MScreenState >>>  ALT  <<< CANCELLED')

              clearTimeout(this.longTimeout)
              this.longTimeout = null
            }
            this.longPressed = false
          }

          // for LONG PRESS behavior
          _handleKeyRelease(k)
          {
            // console.log(' END SECOND  >>>>>>>>>>>>>>>>>>>>> AGING')

            this.stopLongPress()
          }

          _handleKey(k)
          {
            let CAS = 'C[' + (k.ctrlKey  ? '1' : '0') + '] '+
                      'A[' + (k.altKey   ? '1' : '0') + '] '+
                      'S[' + (k.shiftKey ? '1' : '0') + '] '

            console.log('AppMScreen >>> '+CAS+'  k.keyCode: ' + k.keyCode)

            switch(k.keyCode)
            {
              // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
              //case 68: // DEBUG
              case KEYS.hfr_F7: // F7 key
              if( isAltOnly(k) || isDEBUG)
              {
                console.log('AppMScreen >>> F7 Key')

                this.fireAncestors('$onScanWifiBT');
              }
              break
              // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
              case 65: // DEBUG
              case KEYS.hfr_AGING: // AGING key
              if( isAltOnly(k) || isDEBUG)
              {
                this.startLongPress( () =>
                {
                  if(GLOBAL.isAGING == "true")
                  {
                    this._setState('StopAgingState')
                  }
                  else
                  {
                    this._setState('StartAgingState')
                  }
                }, 1000) //ms

                return true // handled
              }
              break;
              // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
              //case 68: // DEBUG
              case KEYS.hfr_DMP: // DMP key
              if( isAltOnly(k) || isDEBUG)
              {
                this.startLongPress( () =>
                {
                  console.log(' ONE SECOND  >>> DMP')

                  this.fireAncestors('$onPlayDefaultVideo');
/*
                  let params =
                  {
                    text: "4K_VIDEO_TEST Not Found",
                    pts:  ( (SCREEN.precision < 1) ? 50 : 100),
                    mount: 0.5,
                    timeout_ms: 3000,
                    w: (SCREEN.precision * 1920 * 0.75),
                    h: (SCREEN.precision * 1080 * 0.5),
                    x: (SCREEN.precision * 1920 * 0.5),
                    y: (SCREEN.precision * 1080 * 0.5),
                  }

                  this.fireAncestors('$onShowToast', params);
*/
                 // this._setState('PlayVideoState')

                  // TODO - show the DEFAULT per Resolution move.  (4K_)VIDEO_TEST.mp4
                }, 1000) //ms

                return true // handled
              }
              break;

              // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
              //case 76:
              case KEYS.hfr_LOGO:
                if( isAltKeyCode(k, KEYS.hfr_LOGO)  ||
                   (isDEBUG && k.keyCode == 76) ) // L
                {
                  let params =
                  {
                    text: "his",
                    timeout_ms: 3000,
                    w: (SCREEN.precision * 1920 * 0.25),
                    h: (SCREEN.precision * 1080 * 0.25),
                  }

                  this.fireAncestors('$onShowToast', params);
                  return true // handled
                }
              break;
              // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
              //case 66:
              case KEYS.hfr_BAL:
                if( isAltKeyCode(k, KEYS.hfr_BAL)  ||
                   (isDEBUG && k.keyCode == 66) ) // B
                {
                  let params =
                  {
                    text: "MIDDLE",
                    timeout_ms: 3000
                  }

                  this.fireAncestors('$onShowToast', params);
                  return true // handled
                }
              break;

              // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
              // case 83: // S key
              // if(k.altKey && !k.shiftKey && !k.ctrlKey)
              // {
              //   console.log('MScreenState >>>  ALT SHIFT  k.keyCode: ' + k.keyCode)
              //   //this.tuner.toggleScan()
              // }
              // break;
              // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
              default:
                console.log('AppMScreen >>> _handleKey() CAS: ' +CAS+ '- default: ' + k.keyCode )

                if(k.altKey && !k.shiftKey && !k.ctrlKey)
                {
                  //
                  // Look for xxxKeys.JSON defined behavior...
                  //
                  let rpc = gDataModel.getKeymapRPC(k.keyCode);

                  if(rpc != null && rpc["Callback"] != undefined)
                  {
                    console.log('AppMScreen >>> _handleKey() - fire: ' + rpc["Callback"]  )

                    let params = {
                      "obj": this,
                      "cb": rpc["Callback"]
                    }

                    this.fireAncestors('$fireCOMMAND', params);
                  }
                  return true // handled
                }

                return false // propagate
            }//SWITCH

            return false // propagate
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
        class StartAgingState extends this
        {
          $enter()
          {
            // console.log(">>>>>>>>>>>>   STATE:  StartAgingState - ENTER");

            GLOBAL.isAGING = "true"
            this.Aging.setAgingState(GLOBAL.isAGING)

            this.Aging.setSmooth('alpha', 1.0, { duration: 0.2 })
          }

          // $exit()
          // {
          //   console.log(">>>>>>>>>>>>   STATE:  StartAgingState - EXIT");
          // }

          _getFocused()
          {
            return this.mScreen
          }

          startLongPress(cb, tt)
          {
            if(this.longTimeout == null  &&
               this.longPressed == false )
            {
              this.longPressed = true
              let done_cb = cb
              this.longTimeout = setTimeout( () =>
              {
                if(done_cb)
                {
                  done_cb()
                }
                this.longTimeout = null
              }, tt);
            }
          }

          stopLongPress()
          {
            if(this.longTimeout != null)
            {
              clearTimeout(this.longTimeout)
              this.longTimeout = null
            }
            this.longPressed = false
          }

          // for LONG PRESS behavior
          _handleKeyRelease(k)
          {
            this.stopLongPress()
          }

          _handleKey(k)
          {
            let CAS = 'C[' + (k.ctrlKey  ? '1' : '0') + '] '+
                      'A[' + (k.altKey   ? '1' : '0') + '] '+
                      'S[' + (k.shiftKey ? '1' : '0') + '] '

            // console.log('StartAgingState >>> '+CAS+'  k.keyCode: ' + k.keyCode)

            switch(k.keyCode)
            {
              case KEYS.hfr_AGING: // AGING key
              if( isAltOnly(k) || isDEBUG)
              {
                this.startLongPress( () =>
                {
                  //console.log(' StartAgingState >>>  Go to STOP AGING   GLOBAL.isAGING: ' + GLOBAL.isAGING)

                  this._setState('StopAgingState')
                }, 1000) //ms

                return true // handled
              }
              break;

              default:
                console.log('StartAgingState >>> _handleKey() CAS: ' +CAS+ '- default: ' + k.keyCode )
                break;
            }//SWITCH

            return true // eat
          }
        }, // CLASS - StartAgingState
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        class StopAgingState extends this
        {
          $enter()
          {
            // console.log(">>>>>>>>>>>>   STATE:  StopAgingState - ENTER");

            GLOBAL.isAGING = "false"
            this.Aging.setAgingState(GLOBAL.isAGING)

            this.Aging.setSmooth('alpha', 0.0, { duration: 0.2 })

            this._setState('ActiveState')
          }

          // $exit()
          // {
          //   console.log(">>>>>>>>>>>>   STATE:  StopAgingState - EXIT");
          // }

          _getFocused()
          {
            return this.mScreen
          }

        }, // CLASS - StartAgingState

        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      ]
     }//_states
  }//CLASS
