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

import { gDataModel } from './DataModel';

// import { Utils } from 'wpe-lightning-sdk'

import { KEYS, SCREEN } from './components/Globals';


export default class AppAgingScreen extends lng.Component
{
  static _template( )
  {
    return  {

      w: SCREEN.w,
      h: SCREEN.h,
      color: "0xFFffffff",
      rect: true,

      MText:
          {
            x: (SCREEN.precision * SCREEN.w) * 0.15,
            y: (SCREEN.precision * SCREEN.h) * 0.025,
            text: {
              text: "M",
              fontSize: ( (SCREEN.precision < 1) ? 125 : 250),
              textColor: 0xFFff0000,
              textAlign:  'center'
            }
          }
    }
  };

  _init()
  {

  }

  _getFocused()
  {
    return this;
  }

  getAgingState()
  {
    var ans = gDataModel.getPStore('AgingState')

    // console.log('>>>>>>>>>>>>   AGING:  getState() - ans: >>' + ans + '<<');
    // console.log('>>>>>>>>>>>>   AGING:  getState() - ans: ' + JSON.stringify(ans) );

    return ans
  }

  setAgingState( v )
  {
    console.log('>>>>>>>>>>>>   AGING:  setAgingState('+ v +') - ENTER' )

    if(v)
    {
      this._setState('AgingState')
    }
    var ans = gDataModel.setPStore('AgingState', v)

   // console.log('>>>>>>>>>>>>   AGING:  setState('+v+') - ans: ' + JSON.stringify(ans) );

    return ans
  }

  static _states()
  {
    return [
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      class AgingState extends this
      {
        $enter()
        {
          console.log('AgingState - ENTER ')
        }

        _handleKey(k)
        {
          switch(k.keyCode )
          {
            case KEYS.hfr_AGING: // AGING key
            if( isAltOnly(k) || isDEBUG)
            {
              console.log('AgingState >>> _handleKey() - default: ' +k.keyCode )
              return false // propagate
            }
            break;
            default:
              console.log('AgingState >>> _handleKey() - default: ' +k.keyCode )
              return true // eat EVERYTHING !!!
          }//SWITCH

          return true // eat EVERYTHING !!!
        }

      }, // CLASS - AgingState
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      class FooState extends this
      {
        $enter(event)
        {

        }

        $exit()
        {
          // console.log(">>>>>>>>>>>>   STATE:  FooState - EXIT");

          //  this.player.setSmooth('alpha',  0.0, {duration: 0.2 });
          //  this.mainGui.setSmooth('alpha', 1.0, {duration: 0.4 });
        }

        _getFocused()
        {
          return this
        }

      }// CLASS - FooState
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    ]
    }//_states
}//CLASS
