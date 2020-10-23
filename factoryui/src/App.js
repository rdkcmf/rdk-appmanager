import { Lightning, Utils } from 'wpe-lightning-sdk'

import AppMainScreen    from './AppMainScreen';
import AppMScreen       from './AppMScreen';
import AppMediaPlayer   from './AppMediaPlayer';
import AppTvTuner       from './AppTvTuner';
import AppF7screen      from './AppF7screen';

import InfoToast        from './components/InfoToast'
import TestPattern      from './components/TestPattern';
import InlayPattern     from './components/InlayPattern';

import DataModel        from './DataModel';
import { gDataModel }   from './DataModel';

import JSONKeyPath      from 'json-keypath';

import { isDEBUG, GLOBAL, KEYS, SCREEN, ALL_PLUGINS_KEYPATH, isAltOnly } from './components/Globals';

export default class App extends Lightning.Component
{
  static getFonts() {
    return [{ family: 'Regular', url: Utils.asset('fonts/Roboto-Regular.ttf') }]
  }

  static _template() {

    return {

      GuiContainer: {
        alpha: 0.0,
        type: AppMainScreen
      },

      MScreen: {
        alpha: 0.0,
        type: AppMScreen,
      },

      TestContainer:
      {
        alpha: 0.0,
        type: TestPattern
      },

      InlayContainer:
      {
        alpha: 0.0,
        type: InlayPattern
      },

      Tuner: {
        visible: false,
        type: AppTvTuner,
      },

      Player: {
        visible: false,
        type: AppMediaPlayer,
      },

      WifiBT: {
        visible: false,
        type: AppF7screen,
      },

      MacAddressInfo:
      {
        alpha: 0.0,

        Background:  {
          w: SCREEN.w, h: SCREEN.h, rect: true, color: 0xFF000000
        },

        Lines:
        {
          x: 20,
          y: 10,

          LabelMac:
          {
            y: ( (SCREEN.precision < 1) ? 60 : 120) * 0,
            text: {
              text: "MAC Addr.",
              fontSize: ( (SCREEN.precision < 1) ? 30 : 60),
              textColor: 0xFFffffff,
            // ...shdw
            }
          },
          ValueMac:
          {
            x: ( (SCREEN.precision < 1) ? 300 : 600) * 1,
            y: ( (SCREEN.precision < 1) ?  60 : 120) * 0,
            text: {
              text: "- - - - - - -",
              fontSize: ( (SCREEN.precision < 1) ? 30 : 60),
              textColor: 0xFFffffff,
            // ...shdw
            }
          },
          LabelIP:
          {
            y: ( (SCREEN.precision < 1) ? 60 : 120) * 1,
            text: {
              text: "IP",
              fontSize: ( (SCREEN.precision < 1) ? 30 : 60),
              textColor: 0xFFffffff,
            // ...shdw
            }
          },
          ValueIP:
          {
            x: ( (SCREEN.precision < 1) ? 300 : 600) * 1,
            y: ( (SCREEN.precision < 1) ?  60 : 120) * 1,
            text: {
              text: "0.0.0.0",
              fontSize: ( (SCREEN.precision < 1) ? 30 : 60),
              textColor: 0xFFffffff,
            // ...shdw
            }
          },
          LabelBT:
          {
            y: ( (SCREEN.precision < 1) ? 60 : 120) * 2,
            text: {
              text: "Bluetooth MAC",
              fontSize: ( (SCREEN.precision < 1) ? 30 : 60),
              textColor: 0xFFffffff,
            // ...shdw
            }
          },
          ValueBT:
          {
            x: ( (SCREEN.precision < 1) ? 300 : 600) * 1,
            y: ( (SCREEN.precision < 1) ?  60 : 120) * 2,
            text: {
              text: "- - - - - - -",
              fontSize: ( (SCREEN.precision < 1) ? 30 : 60),
              textColor: 0xFFffffff,
            // ...shdw
            }
          },
        }

      },

      InfoDialog:
      {
        type: InfoToast,
        w: 800,
        h: 300
      },

      ErrorMsg:
      {
        alpha: 0.0,
        mount: 0.5,
        x: (SCREEN.precision * SCREEN.w)/2,
        y: (SCREEN.precision * SCREEN.h)/2,
        text: {
          text: "ERROR:  message goes here ...  ",
          fontSize: ( (SCREEN.precision < 1) ? 40 : 80),
          textColor: 0xFFff0000,
          textAlign:  'center',
         // ...shdw
        },
      },
    }
  }

  _init()
  {
    SCREEN.precision = this.stage.getOption('precision');

    this.toastTimeout = null;
    this.lastState    = null;
    this.mScreen      = this.tag('MScreen')
    this.mainGui      = this.tag('GuiContainer')
    this.WifiBT       = this.tag('WifiBT');

    this._setState('ReadJsonState');

    this.lastState = this._getState();

    this.tuner = this.tag('Tuner');

    if(this.tuner != undefined)
    {
      this.tuner.initTuner();
    }
  }

  $onScanWifiBT()
  {
    console.log('########  GOT >>>  onScanWifiBT')
    this._setState('F7screenState')
  }

  $onPlayDefaultVideo()
  {
    this._setState('PlayVideoState')
  }

  $closeMediaPlayer()
  {
    console.log('########  GOT >>>  closeMediaPlayer')
    console.log('########  GOT >>>  closeMediaPlayer')
    console.log('########  GOT >>>  closeMediaPlayer')
    console.log('########  GOT >>>  closeMediaPlayer')

    this._setState('MainGuiState')
  }

  $onShowToast(params = null)
  {
    if(params == null)
    {
      console.log('ERROR:  onShowToast() - BAD Args !')
      return
    }

    let toast = this.tag('InfoDialog')
    toast.showToast(params)
  }

  onSerialCMD(params)
  {
    console.log(' ##########  onSerialCMD() - params:  ' + JSON.stringify(params) )

    try
    {
      let ans = JSON.parse(params)

      if(ans != undefined && ans != null)
      {
        let rpcPath = gDataModel.getSerialRPC(ans.params.payload)

        if( (rpcPath != undefined && rpcPath != null) &&
            (ans.params.data != undefined &&
             ans.params.data != null) )
        {
          console.log(' ##########  onSerialCMD >>> setting ... ')
          gDataModel.setValue(rpcPath, ans.params.data)
        }
        else
        {
          console.log('ERROR: onSerialCMD() >>> Bad Args !  ans.params.data: ' + ans.params.data )
        }
      }
      else
      {
        console.log('ERROR: onSerialCMD() >>> Bad Args !  params: ' + JSON.stringify(params) )
      }

    }
    catch(e)
    {
      console.log('ERROR: onSerialCMD() >>> EXCEPTION => ' + e)
    }
  }

  // NB:  Activate ALL the needed plugins !
  //         >>>  Presume Nothing <<<
  //
  activatePlugins(plugins)
  {
    return new Promise( (resolve, reject)  =>
    {
      if(gDataModel == null || gDataModel == undefined)
      {
        console.log('FATAL:  activatePlugins() -  "gDataModel" is NULL ...')
        reject()
      }

      if(plugins == undefined || plugins == null)
      {
        console.log('FATAL:  "plugins" is null / undefined ... unable to Activate')
        reject()
      }

      plugins = plugins.filter( o => o != 'TODO_Plugin');

      var allReady = plugins.map(o => gDataModel.activatePlugin(   // CALL THUNDER
                                            { callsign: o } ));

      Promise.all( allReady ).then( (allResolve, allReject)  =>
      {
        console.log('INFO: >>>>>>  ACTIVATING ... ')

        plugins.map( o => console.log(' ** ACTIVATE >>>  ' + o) );

        this.frontAndFocus(); // Set APP in front

        resolve();
      })
      .catch(e =>
      {
        console.log('EXCEPTION: >>>>>>  ACTIVATE >>  Promise.all <<< FAILED   e: ' + e)
      });

    }); // PROMISE
  }

  frontAndFocus()
  {
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      //  Register Events
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

      gDataModel.registerEvent('org.rdk.FactoryComms', 'onCommandEvent', this.onSerialCMD )
      // gDataModel.registerEvent('MyPackage', 'onMyEvent',   this.onMyEvent )     // JUNK
      // gDataModel.registerEvent('MyPackage', 'onWB_R_Gain', this.onWB_R_Gain )   // JUNK

      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      //  RDKShell >>> Capture MENU key
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

      let getMENU = { "params":{
        "keyCode": 27, // MENU
        "modifiers": [],
        "client": "FactoryApp" } }

      gDataModel.callThunderNoCatch(   // CALL RDKSHELL
        { plugin: "org.rdk.RDKShell",
          method: "addKeyIntercept",
          params: getMENU } );

      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      //  RDKShell >>> Set FOCUS
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      let setFOCUS = {
        "params":{ "client": "FactoryApp" }
      }

      gDataModel.callThunderNoCatch(   // CALL RDKSHELL
        { plugin: "org.rdk.RDKShell",
          method: "setFocus",
          params: setFOCUS } );

      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      //  RDKShell >>> Move to FRONT
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

      let moveFRONT = {
        "params":{ "client": "FactoryApp" }
      }

      gDataModel.callThunderNoCatch(   // CALL RDKSHELL
        { plugin: "org.rdk.RDKShell",
          method: "moveToFront",
          params: moveFRONT } );

      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  }

  $fireValueSET(o)
  {
    if(o)
    {
      let   rpc = o["rpc"]
      let value = o["value"]

      if(value && rpc && rpc.rpcNode)
      {
        console.log( " #####  >> fireValueSET()  ... rpcNode: " + rpc.rpcNode)

        DataModel.dataValueSET(rpc.rpcNode, value);
      }
      else
      {
        console.log( " #####  >> fireValueSET() ... rpc.rpcNode = NULL <<< ERROR " )
      }
    }
    else
    {
      console.log('fireValueSET - FAILED ');
    }
  }

  $fireCOMMAND(item)
  {
    let cmd = item["cb"]

    switch(cmd)
    {
      case "HideAddressInfo":   this._setState(this.lastState);       break;
      case "ShowAddressInfo":   this.lastState = this._getState();
                                this._setState('MacAddressInfoState'); break;

      case "HideTestPattern":   this._setState(this.lastState);      break;
      case "ShowTestPattern":   this.lastState = this._getState();
                                this._setState('TestPatternState');  break;

      case "HideInlayPattern":  this._setState(this.lastState);      break;
      case "ShowInlayPattern":  this.lastState = this._getState();
                                this._setState('InlayPatternState'); break;

      case "PlayVideoA":        this._setState('PlayVideoA_State');  break;
      case "PlayVideoB":        this._setState('PlayVideoB_State');  break;

      default:
        console.log('ERROR:  fireCOMMAND() ... unknown cmd: ' + cmd)
    }//SWITCH
  }

  static _states(){
    return [

          // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          class ReadJsonState extends this
          {
            $enter()
            {
              this.mScreen.alpha = 0.0
              this.mainGui.alpha = 0.0

              this.loadData()
            } // enter()

            loadData()
            {
              const URL_PARAMS = new window.URLSearchParams(window.location.search)

              var        cfg = URL_PARAMS.get('cfg')
              this.keysURL   = '';
              this.serialURL = '';
              this.dataURL   = '';
              this.menuURL   = '';

              if(cfg != undefined)
              {
                this.keysURL   = Utils.asset('3rdParty/' + cfg + '/' + cfg+ 'Keys.json')
                this.serialURL = Utils.asset('3rdParty/' + cfg + '/' + cfg+ 'Serial.json')
                this.dataURL   = Utils.asset('3rdParty/' + cfg + '/' + cfg+ 'Data.json')
                this.menuURL   = Utils.asset('3rdParty/' + cfg + '/' + cfg+ 'Menu.json')
              }
              else
              {
                console.log('ERROR: Bad >>> cfg: ' + cfg  )
                return
              }

              // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
              // JSON:  Keys
              // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
              DataModel.fetchJSON(this.keysURL).then( keysMap =>
              {
                gDataModel.setKeycodeMap(keysMap.keys);
                console.log('GOT KEYS ... GOT KEYS ... GOT KEYS ... ')
              })
              .catch( () =>
              {
                console.log('REJECT KEYS ... REJECT KEYS ... REJECT KEYS ... ')
                console.log('REJECT KEYS ... REJECT KEYS ... REJECT KEYS ... ')
                console.log('REJECT KEYS ... REJECT KEYS ... REJECT KEYS ... ')

                let msg = this.tag("ErrorMsg");
                msg.text = "ERROR: Unable to find ... \n \n" + keysURL;
                msg.setSmooth('alpha',  1.0, {duration: 0.4 });
              });

              // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
              // JSON:  Serial
              // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
              DataModel.fetchJSON(this.serialURL).then( serialMap =>
              {
                gDataModel.setSerialMap(serialMap.cmds);
                console.log('GOT SERIAL ... GOT SERIAL ... GOT SERIAL ... ')
              })
              .catch( () =>
              {
                console.log('REJECT SERIAL ... REJECT SERIAL ... REJECT SERIAL ... ')

                let msg = this.tag("ErrorMsg");
                msg.text = "ERROR: Unable to find ... \n \n" + this.serialURL;
                msg.setSmooth('alpha',  1.0, {duration: 0.4 });
              });

              // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
              // JSON:  Data
              // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
              DataModel.fetchJSON(this.dataURL).then( data =>
              {
                let allPlugins = JSONKeyPath.getValue(data, ALL_PLUGINS_KEYPATH);

                gDataModel.setDataMap(data)

                this._setState('CreateGuiState')

                // Activate PLUGINS ...
                try
                {
                  this.activatePlugins(allPlugins).then( () =>
                  {
                    console.log('activatePlugins() - ACTIVATED:  allPlugins:' + JSON.stringify(allPlugins) + ' ... ' );
                  })
                }
                catch(e)
                {
                  console.log('activatePlugins() - EXCEPTION:  e:' + e + ' ... ' );
                }
              })
              .catch( () =>
              {
                console.log('REJECT DATA ... REJECT DATA ... REJECT DATA ... ')

                let msg = this.tag("ErrorMsg");
                msg.text = "ERROR: Unable to find ... \n \n" + this.dataURL;
                msg.setSmooth('alpha',  1.0, {duration: 0.4 });
              });
              // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
            }
          }, // CLASS - ReadJsonState
          // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          class CreateGuiState extends this
          {
            $enter()
            {
              DataModel.fetchJSON(this.menuURL).then( items =>
              {
                let gui  = this.tag("GuiContainer");
                let data = gDataModel.getDataMap();

                if(gui && data)
                {
                  gui.processMenuJSON(items, data)
                }
                else
                {
                  console.log('ERROR:  CreateGuiState >>> Bad Args ')
                }

                this._setState('MScreenState')
              })
              .catch( () =>
              {
                console.log('REJECT MENU ... REJECT MENU ... REJECT MENU ... ')

                let msg  = this.tag("ErrorMsg");
                msg.text = "ERROR: Unable to find ... \n \n" + this.menuURL;

                msg.setSmooth('alpha',  1.0, {duration: 0.4 })
              })
            }
          },
          // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          class MScreenState extends this
          {
            $enter()
            {
              console.log(">>>>>>>>>>>>   STATE:  MScreenState - ENTER");

              this.mScreen.setSmooth('alpha', 1.0, { duration: 0.2 });
              this.mainGui.setSmooth('alpha', 0.0, { duration: 0.2 });

             // this.tuner.toggleScan()
            }

            $exit()
            {
              console.log(">>>>>>>>>>>>   STATE:  MScreenState - EXIT");
            }

            _getFocused()
            {
              return this.mScreen
            }

            _handleKey(k)
            {
              let CAS = 'C[' + (k.ctrlKey  ? '1' : '0') + '] '+
                        'A[' + (k.altKey   ? '1' : '0') + '] '+
                        'S[' + (k.shiftKey ? '1' : '0') + '] '

            console.log('MScreenState >>> '+CAS+'  k.keyCode: ' + k.keyCode)

              switch(k.keyCode)
              {
                case  8: // 'LAST' key on remote
                case 27: // ESC key on keyboard - also MENU key on Factory Remote
                case 73: // '...' Menu key on PlatCo remote
                {
                  this._setState('MainGuiState')
                  return true // handled
                }
                break;

                //case KEYS.hfr_EX
                case 77: // "Menu" on Factory Remote
                {
                  if( isAltOnly(k) )
                  {
                    this._setState('MainGuiState')
                    return true // handled
                  }
                }
                break;

                default:
                  console.log('MScreenState >>> _handleKey() CAS: ' +CAS+ '- default: ' + k.keyCode )
                  break;
              }//SWITCH

              return false // propagate
            }
          }, // CLASS - MScreenState
          // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          class MainGuiState extends this
          {
            $enter()
            {
              console.log(">>>>>>>>>>>>   STATE:  MainGuiState - ENTER");

              this.mScreen.setSmooth('alpha', 0.0, { duration: 0.2 });
              this.mainGui.setSmooth('alpha', 1.0, { duration: 0.2 });
            }

            $exit()
            {
              console.log(">>>>>>>>>>>>   STATE:  MainGuiState - EXIT");
            }

            _getFocused()
            {
              return this.tag('GuiContainer')
            }

            _handleKey(k)
            {
              let CAS = 'C[' + (k.ctrlKey  ? '1' : '0') + '] '+
                        'A[' + (k.altKey   ? '1' : '0') + '] '+
                        'S[' + (k.shiftKey ? '1' : '0') + '] '

              console.log('TOP >> MainGuiState >>> '+CAS+'  k.keyCode: ' + k.keyCode)

              if(k.keyCode == 27) // ESCAPE
              {
                console.log('TOP >> MainGuiState >>> M SCREEN')
                this._setState('MScreenState')
              }

              if(!k.ctrlKey && k.altKey && !k.shiftKey)
              {
                if(k.keyCode == KEYS.hfr_M)
                {
                  console.log('TOP >> MainGuiState >>> M SCREEN')
                  this._setState('MScreenState')
                }
              }

              return false // propagate
            }

          }, // CLASS - MainGuiState
          // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          class PlayVideoState extends this
          {
            $enter()
            {
              this.tag('Player').visible = true;
              console.log(">>>>>>>>>>>> $enter() ...  STATE:  PlayVideoState");

              this.tag('Player').playVideoHD()
            }

            $exit()
            {
              this.tag('Player').visible = false;
              console.log(">>>>>>>>>>>> $exit() ...  STATE:  PlayVideoState");
            }

            _getFocused()
            {
              return this.tag('Player');
            }
          }, // CLASS - PlayVideoState
          // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          class TestPatternState extends this
          {
            $enter()
            {
              this.tag('TestContainer').alpha = 1.0;
              console.log(">>>>>>>>>>>> $enter() ...  STATE:  TestPatternState");
            }

            $exit()
            {
              this.tag('TestContainer').alpha = 0.0;
              console.log(">>>>>>>>>>>> $exit() ...  STATE:  TestPatternState");
            }

            _getFocused()
            {
              return this.tag('TestContainer');
            }
          }, // CLASS - TestPatternState
          // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          class InlayPatternState extends this
          {
            $enter()
            {
              this.tag('InlayContainer').alpha = 1.0;
            }

            $exit()
            {
              this.tag('InlayContainer').alpha = 0.0;
            }

            _getFocused()
            {
              return this.tag('InlayContainer');
            }
          }, // CLASS - InlayPatternState
          // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          class MacAddressInfoState extends this
          {
            $enter()
            {
              let mac = gDataModel.getValue('RPC.MACaddr')
              let ip  = gDataModel.getValue('RPC.STBaddr')

              this.tag('MacAddressInfo').alpha = 1.0;
              this.tag('ValueMac').text = mac
              this.tag('ValueIP').text  = ip
            }

            $exit()
            {
              this.tag('MacAddressInfo').alpha = 0.0;
            }

            _handleKey(e)
            {
              this._setState(this.lastState); // dismiss
            }

            _getFocused()
            {
              return this
            }
          }, // CLASS - InlayPatternState
          // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          class F7screenState extends this
          {
            $enter()
            {
              console.log(">>>>>>>>>>>>   STATE:  F7screenState - ENTER");

              // this.mScreen.setSmooth('alpha', 1.0, { duration: 0.2 });
              // this.mainGui.setSmooth('alpha', 0.0, { duration: 0.2 });

              this.WifiBT.startScan()
              this.WifiBT.visible = true
            }

            $exit()
            {
              console.log(">>>>>>>>>>>>   STATE:  F7screenState - EXIT");
            }

            _getFocused()
            {
              return this.mScreen
            }

            _handleKey(k)
            {
              let CAS = 'C[' + (k.ctrlKey  ? '1' : '0') + '] '+
                        'A[' + (k.altKey   ? '1' : '0') + '] '+
                        'S[' + (k.shiftKey ? '1' : '0') + '] '

            console.log('F7screenState >>> '+CAS+'  k.keyCode: ' + k.keyCode)

              switch(k.keyCode)
              {
                case  8: // 'LAST' key on remote
                case 27: // ESC key on keyboard - also MENU key on Factory Remote
                case 73: // '...' Menu key on PlatCo remote
                {
                  this._setState('MainGuiState')
                  return true // handled
                }
                break;

                case 77: // "Menu" on Factory Remote
                {
                  if( isAltOnly(k) )
                  {
                    this._setState('MainGuiState')
                    return true // handled
                  }
                }
                break;

                default:
                  console.log('F7screenState >>> _handleKey() CAS: ' +CAS+ '- default: ' + k.keyCode )
                  break;
              }//SWITCH

              return false // propagate
            }
          }, // CLASS - F7screenState

          // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      ]
  }//_states
} // CLASS - App
