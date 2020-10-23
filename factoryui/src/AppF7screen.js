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

import { Utils } from 'wpe-lightning-sdk'

import { KEYS, SCREEN, COLOR_BG, COLOR_BG2, COLOR_HILITE } from './components/Globals';

let tmpCLR = 0xFF0f5e0f //   #0f5E0F

export default class AppF7screen extends lng.Component
{
  static _template( )
  {
    return  {
      x: 200, y: 200,
      w: 800,
      h: 400,
      color: COLOR_BG,
      rect: true,
    }
  };

  _init()
  {
    //this.tc = gDataModel.getThunder()

    this._setState('ScanWifiState')
  }

  _getFocused()
  {
    return this;
  }

  onWIFIStateChanged(e)
  {
    console.log('DEBUG: onWIFIStateChanged() >>>> e: ' + JSON.stringify(e))

  /*
  {
    "jsonrpc":"2.0",
    "method":"org.rdk.Wifi.1.onWIFIStateChanged",
    "params": {
      "state": 0,
      "isLNF" : false
    }
  }
  */
  }

  onError(e)
  {
    console.log('DEBUG: onError() >>>> e: ' + JSON.stringify(e))

  /*
  {
    "jsonrpc":"2.0",
    "method":"org.rdk.Wifi.1.onError",
    "params": { "code": 2 }
  }
  */
  }

  onWifiSignalThresholdChanged(e)
  {
    console.log('DEBUG: onWifiSignalThresholdChanged() >>>> e: ' + JSON.stringify(e))

  /*

  {
    "jsonrpc":"2.0",
    "method":"org.rdk.Wifi.1.onWifiSignalThresholdChanged",
    "params": {"signalStrength": -35, "strength": "Excellent"}
  }
  */
  }

  onAvailableSSIDs(e)
  {
    console.log('DEBUG: onAvailableSSIDs() >>>> e: ' + JSON.stringify(e))

  /*
  {
    "jsonrpc":"2.0",
    "method":"org.rdk.Wifi.1.onAvailableSSIDs",
    "params": { "ssids": [
      {
        "ssid": "123412341234",
        "security": 2,
        "signalStrength": -33,
        "frequency": 5.0
      },
      {
        "ssid": "456745674567",
        "security": 2,
        "signalStrength": -33,
        "frequency": 5.0
      }
    ],
    "moreData": true
  }
  }
  */
  }

  registerEvents()
  {
    console.log('DEBUG: registerEvents() - ENTER ')

    gDataModel.registerEvent('org.rdk.FactoryComms', 'onWIFIStateChanged', this.onWIFIStateChanged )
    gDataModel.registerEvent('org.rdk.FactoryComms', 'onError', this.onError )
    gDataModel.registerEvent('org.rdk.FactoryComms', 'onWifiSignalThresholdChanged', this.onWifiSignalThresholdChanged )
    gDataModel.registerEvent('org.rdk.FactoryComms', 'onAvailableSSIDs', this.onAvailableSSIDs )
  }

  startScan()
  {
    console.log('DEBUG: startScan() - ENTER ')

    this.registerEvents()
/*
Request: {"jsonrpc":"2.0", "id":3, "method":"org.rdk.Wifi.1.startScan", "params":{"incremental":false,"ssid":"","frequency":""}}'

Response: {"jsonrpc":"2.0", "id":3, "result":{"success":true}}
*/

    let pp = { "incremental": false,
                      "ssid":"",
                      "frequency":""}

    gDataModel.callThunderNoCatch(   // CALL THUNDER
      { plugin: "org.rdk.Wifi",
        method: "startScan",
        params: pp } );
  }

  stopScan()
  {
    console.log('DEBUG: stopScan() - ENTER ')

/*
Request: {"jsonrpc":"2.0", "id":3, "method":"org.rdk.Wifi.1.stopScan", "params":{}}

Response: {"jsonrpc":"2.0", "id":3, "result":{"success":true}}
*/

    gDataModel.callThunderNoCatch(   // CALL RDKSHELL
    { plugin: "org.rdk.Wifi",
    method: "stopScan",
    params: {}  } );
  }

  static _states()
  {
    return [
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      class ScanWifiState extends this
      {
        $enter()
        {
          console.log('ScanWifiState - ENTER ')
          this.startScan()
        }
      }, // CLASS - ScanWifiState
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

        _handleKey(k)
        {
          switch(k.keyCode )
          {
            default:
              console.log('FooState >>> _handleKey() - default: ' +k.keyCode )
              return false
          }//SWITCH

          return true
        }
      }// CLASS - FooState
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    ]
    }//_states
}//CLASS
