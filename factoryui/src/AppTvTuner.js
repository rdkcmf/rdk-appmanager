
/* <script src="thunderJS.js"></script> */

// import ThunderUtils from './ThunderUtils.js';
import { gDataModel } from './DataModel';

import { SCREEN } from './components/Globals';
import Progress   from "./components/Progress"

let OrangeCLR = 0xFFfebf00 //   #febf00
let GrayCLR   = 0xFF888888 //   #888888

export default class AppTvTuner extends lng.Component
{
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  static _template( )
  {
    console.log('#########  ATSC >>>>   _template() - ENTER')

    return  {
      Tuner_bg:
      {
        w: SCREEN.w, h: SCREEN.h,
        color: OrangeCLR,
     //   rect: true,

        Text:
        {
          mount: 0.5,
          x: (SCREEN.precision * SCREEN.w)/2,
          y: (SCREEN.precision * SCREEN.h)/2,
          text: {
            text: "Tuner",
            fontSize: ( (SCREEN.precision < 1) ? 125 : 250),
            textColor: 0xFF000000,
            textAlign:  'center'
          }
        },

        ProgressBar: {
          type: Progress,
          mount: 0.5,
          x: (SCREEN.precision * SCREEN.w) * 0.50,
          y: (SCREEN.precision * SCREEN.h) * 0.66,
          w: (SCREEN.precision * SCREEN.w) * 0.33,
          h: 80
        },
      }
    }
  };

  _init()
  {
    console.log('#########  ATSC >>>>   _init() - ENTER')

    this.tc = gDataModel.getThunder()

    console.log('#########  ATSC >>>>   _init() - this.tc: ' + this.tc)

    this.focusIndex  = 0
    this.navElements = 0
    this.bFullScreen = false
    this.isScanning  = false
    this.progressBar = this.tag("ProgressBar")

    this.progressBar.setRadius(12)

    this.en_spaInitConfig =
    {
      preferredAudioLanguage: "eng,spa"
    }

    this.spa_enInitConfig =
    {
      preferredAudioLanguage: "spa,eng"
    }

    //this.thunderUtils = new ThunderUtils();

    this._setState('TuningState')
  }

  clearConsole()
  {
    console.log("#########  ATSC >>>  DEBUG: clearConsole() - ENTER");

    //document.getElementById("console").value = "";
  }

  setGuideText(text)
  {
   // document.getElementById("guideText").value = text;
   console.log('#########  ATSC >>>  DEBUG: setGuideText( '+text+' ) ');
  }

  setCurrentPlayingChText(text)
  {
    //document.getElementById("currChSelLabel").innerHTML = text;
    console.log('#########  ATSC >>>  DEBUG: setCurrentPlayingChText( '+text+' ) ');
  }

  setChaCountLabel(text)
  {
    // document.getElementById("chcountLabel").innerHTML = text;
    console.log('#########  ATSC >>>  DEBUG: setChaCountLabel( '+text+' ) ');
  }

  clearChannelMapList()
  {
    console.log('#########  ATSC >>>  DEBUG: clearChannelMapList() ');

    // var chMapElement = document.getElementById("chMap");
    // // when length is 0, the evaluation will return false.
    // while (chMapElement.options.length)
    // {
    //   // continue to remove the first option until no options remain.
    //   chMapElement.remove(0);
    // }
  }

  // var tc;
  // var listener;
  // var listenerOnPlayerStatus;
  // var totalChannels;
  // var aampPlayer;
  // var isPlaying;
  // var serviceTable;
  // var fromPC = false;

  // var en_spaInitConfig =
  // {
  //   preferredAudioLanguage: "eng,spa"
  // };

  // var spa_enInitConfig =
  // {
  //   preferredAudioLanguage: "spa,eng"
  // };

  // Connect()
  // {
  //   const configSTB = {
  //     host: '127.0.0.1', // ipAddr of device running Thunder

  //     port: 9998,
  //     default:1 // versioning
  //   };

  //   const configFromPC = {
  //     host: '10.0.0.219', // ipAddr of device running Thunder

  //     port: 9998,
  //     default:1 // versioning
  //   };

  //   var config;
  //   if(this.fromPC)
  //   {
  //     config = configFromPC; ;
  //   }
  //   else
  //   {
  //     config = configSTB;
  //   }

  //   console.log( "Thunder Configuration: " + JSON.stringify(config) );
  //   this.tc = ThunderJS(config);
  // }

  // Activate( callsign )
  // {
  //   this.tc.call( "Controller","activate", {"callsign":callsign} ).then( result => {
  //     console.log( callsign + " activated" );
  //   }).catch(err => {
  //     console.log( callsign + " activation error" );
  //   });
  // }


  toggleScan()
  {
    if(this.isScanning)
    {
      this.isScanning = false

      this.abortScan();
    }
    else
    {
      this.isScanning = true
      this.progressBar.value = 0

      this.startScan();
    }
  }

  startScan()
  {
    this.tc.call("org.rdk.MediaServices","startScan", { "type": "ATSC", "onlyFree": true} )
    .then(result =>
    {
      this.isPlaying = false;
      this.clearChannelMapList();
      console.log('#########  ATSC >>>  startScan Success'+ JSON.stringify(result))
    }).catch(err =>
    {
      console.log('#########  ATSC >>>  startScan Error' + err );
    });
  }

  abortScan()
  {
    this.tc.call("org.rdk.MediaServices","abortScan", {} ).then(result => {
    this.getAllServices();
    console.log('#########  ATSC >>>  abortScan Success'+ JSON.stringify(result));

    }).catch(err => {
      console.log('#########  ATSC >>>  abortScan Error' + err );
    });
  }

  registerOnPlayerStatus()
  {
//    this.listenerOnPlayerStatus = this.tc.on('org.rdk.MediaPlayer','onPlayerStatus',
    this.listenerOnPlayerStatus = this.tc.registerEvent('org.rdk.MediaPlayer','onPlayerStatus',
    (notification) =>
    {
      //var data = 'sts:' + notification.playerStatus + ' p:' + notification.position  + ' l:' + notification.length + ' loc:' + notification.locator + ' loff:' +  notification.liveOffset + ' spd:' + notification.speed ;

      if(this.isPlaying)
      {
        console.log('#########  ATSC >>>  Received onPlayerStatus Event ' + JSON.stringify(notification))
      }
    });
  }

  registerOnScanProgress()
  {
    this.listener = this.tc.registerEvent("org.rdk.MediaServices",'onScanProgress',
    (notification) =>
    {
      // console.log('#########  ATSC >>>  DEBUG:  Received onScanProgress Event ' + JSON.stringify(notification))

      var value = notification.progress * 100;

      this.progressBar.value = value

      // console.log('#########  ATSC >>>  ' + data);

      if('COMPLETE' == notification.state)
      {
        // console.log("#########  ATSC >>>  tuning-- " + data);
        this.getAllServices();
      }

      // console.log("#########  ATSC >>>  tuning notification.signalStrength: " + (typeof  notification.signalStrength) )

      if('TUNING' == notification.state && notification.signalStrength != "0.000000")
      {
        var data = ' State:'    + notification.state +
                   ' sInfo:'    + notification.displaySignalInfo +
                   ' strength:' + notification.signalStrength +
                   ' nTv:'      + notification.numTvServices +
                   ' nRadio:'   + notification.numRadioServices +
                   ' nData:'    + notification.numDataService

        console.log("#########  ATSC >>> ")
        console.log("#########  ATSC >>>  FOUND >> " + data)
        console.log("#########  ATSC >>> ")
      }
    })
  }

  registerOnScanAction()
  {
    //this.listener = this.tc.on("org.rdk.MediaServices",'onScanAction ',
    this.listener = this.tc.registerEvent("org.rdk.MediaServices",'onScanAction ',
    (notification) =>
    {
        console.log('#########  ATSC >>>  Received onScanAction Event ' + JSON.stringify(notification))
    })
  }

  getService()
  {
    // this.tc.call("org.rdk.MediaServices","getService",{"servicePk":1, "attributes": [ "pk","name","signalStrength" ]})
    this.tc.call("org.rdk.MediaServices","getService",{"servicePk":1, "attributes": [ "pk","name","signalStrength" ]})
    .then(result =>
    {
      console.log('#########  ATSC >>>  getService Success '+ JSON.stringify(result))
      //console.log('success:' + result.success)
      //var value = result.signalStrength * 100
      //var value = 0.27 * 100
//    this.progressBar.value = value

    }).catch(err =>
    {
      console.log('#########  ATSC >>>  getService Error '+ err)
    });
  }

  ProcessServiceTable( result )
  {
    console.log('#########  ATSC >>>  DEBUG: ProcessServiceTable( ' + JSON.stringify(result) + ') ');

    // this.serviceTable = result; //store for future use
    // var chMapElement = document.getElementById("chMap");
    // this.totalChannels = 0;
    // for (var i in result.table)
    // {
    //   var strData = result.table[i].displayChannel + ' ' +
    //     result.table[i].shortName +
    //     ' str=' + result.table[i].signalStrength +
    //     ' qual=' + result.table[i].signalQuality;
    //     // +' ' + result.table[i].locator;

    //   var opt = document.createElement('option');
    //   opt.text = strData;
    //   opt.value = result.table[i].locator;
    //   if( i==0 )
    //   {
    //     opt.selected = true;
    //   }
    //   chMapElement.add(opt,null);
    //   this.totalChannels = this.totalChannels +1;
    //   console.log('channel:' + strData);
    // }//FOR

    // console.log('total channels found:' + this.totalChannels);
    // setChaCountLabel( this.totalChannels );
  }

  getAllServices()
  {
    this.clearChannelMapList();

    if( false )
    { // for simulator testing in chrome - canned channel map
      result = {
        "table":[]
      };
      for( var i=0; i<32; i++ )
      {
        result.table[i] = {};
        result.table[i].locator = "live://"+(i+1);
        result.table[i].displayChannel = "1."+(i+1);
        result.table[i].shortName = "ABC"+(i+1);
        result.table[i].signalStrength = "1.0";
        result.table[i].signalQuality = "1.0";
      }
      this.ProcessServiceTable( result );
    }

    console.log('#########  ATSC >>>>   getAllServices() - ENTER' )

    this.tc.call("org.rdk.MediaServices","getServices",{}).then(result =>
    {
      console.log('#########  ATSC >>>>   getServices() - OK   result: ' + JSON.stringify(result) )
      this.ProcessServiceTable(result);
    })
    .catch(err =>
    {
      console.log('#########  ATSC >>>  getService Error '+ err)
    });
  }

  getHiddenServices()
  {
    this.tc.call("org.rdk.MediaServices","getServices",
    {
      "listId": "clist:1",
      "attributes": ["pk", "name", "channel"],
      "aliases": ["pk", "n"],
      "filter": {
        "hidden": "HIDDEN",
        "categories": ["TV", "RADIO", "DATA"]
      }
    })
    .then(result =>
    {
      console.log('#########  ATSC >>>  getServices ... Success '+ JSON.stringify(result));
    }).catch(err =>
    {
      console.log('#########  ATSC >>>  getServices ... Error '+ err)
    });
  }

  //	Request : {"jsonrpc":"2.0", "id":3, "method":"org.rdk.MediaGuide.1.startScan", "params":{ "servicePk": [123] }
  //Response: {"jsonrpc":"2.0", "id":3, "result": { "success": true } }
  startGuideScan()
  {
    this.tc.call("org.rdk.MediaGuide","startScan", { "type": "ATSC", "onlyFree": true} )
    .then(result =>
    {
      this.isPlaying = false;
      console.log('#########  ATSC >>>  startScan Success'+ JSON.stringify(result))
    }).catch(err =>
    {
      console.log('#########  ATSC >>>  startScan Error' + err );
    });
  }

  abortGuideScan()
  {
    this.tc.call("org.rdk.MediaGuide","abortScan", {} )
    .then(result =>
    {
      console.log('#########  ATSC >>>  abortScan Success'+ JSON.stringify(result));
    }).catch(err =>
    {
      console.log('#########  ATSC >>>  abortScan Error' + err );
    });
  }

  getAllGuideEvents()
  { // todo: get guide data only for currently tuned program
    this.tc.call("org.rdk.MediaGuide","getEvents",{})
    .then(result =>
    {
      var guideEventsStr = JSON.stringify(result);
      this.setGuideText(guideEventsStr);
    }).catch(err =>
    {
      console.log('#########  ATSC >>>  getService Error '+ err)
    });
  }

  // onChSelected() {}

  fullscreen(enable)
  {
    //var videoWindowElement = document.getElementById("vidWindow");
    if(enable)
    {
      this.SetRectangle(0.0,0.0,1.0,1.0);
    }
    else
    {
      this.SetRectangle(0.6,0.0,0.4,0.4);
    }
  }

    update()
    {
      // var element = document.getElementById("myprogressBar");
      // var width = 1;
      // var identity = setInterval(scene, 10);

      // scene()
      // {
      //   if (width >= 100) {
      //     clearInterval(identity);
      //   } else {
      //     width++;
      //     element.style.width = width + '%';
      //     element.innerHTML = width * 1 + '%';
      //   }
      // }
  }

  SetRectangle( pctx, pcty, pctw, pcth )
  {
  //   var graphics_width  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  //   var graphics_height = window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight;
  //   console.log("window width=" + graphics_width + ", height=" + graphics_height);

    var x = 0 ;//Math.floor(pctx * graphics_width);
    var y = 0 ;//Math.floor(pcty * graphics_height);
    var w = 1920 ;//Math.floor(pctw * graphics_width);
    var h = 1080 ;//Math.floor(pcth * graphics_height);

    // var videoWindowElement = document.getElementById("vidWindow");
    // videoWindowElement.style['height'] = h;
    // videoWindowElement.style['width'] = w;
    // videoWindowElement.style['top'] =  y;
    // videoWindowElement.style['left'] = x;

    console.log( "#########  ATSC >>>  holepunch: x=" + x + ",y=" + y + ",w="+ w + ",h=" + h);
    //this.tc.call("org.rdk.MediaPlayer", "setVideoRectangle", {"id":"MainPlayer","x":x,"y":y,"w":w,"h":h,"meta":{"resWidth":graphics_width,"resHeight":graphics_height}} );

    if( this.aampPlayer )
    {
      this.aampPlayer.setVideoRect(x,y,w,h);
    }
  }

  initTuner() // HUGH
  {
    console.log('#########  ATSC >>>>   startTuner() - ENTER')

    //window.resizeBy(1280,720);

    this.totalChannels = 0;
    this.isPlaying = false;

    try
    {
      if( AAMPMediaPlayer )
      {
        this.fromPC = false;
        console.log('#########  ATSC >>>>   startTuner() - STB')
      }
    }
    catch( e )
    {
      console.log('#########  ATSC >>>>   startTuner() - PC')
      this.fromPC = true;
    }

    // this.CollectButtons();
    // this.Connect();
    // this.Activate('org.rdk.MediaServices');
    // this.Activate('org.rdk.MediaPlayer');
    // this.Activate('org.rdk.MediaGuide');

    this.registerOnScanProgress();
    this.registerOnScanAction();
    this.registerOnPlayerStatus();

    console.log('#########  ATSC >>>>   getAllServices() - now !')
    this.getAllServices();

    //this.startScan()
  }

   // var focusIndex;
   // var navElements;
   // var bFullScreen = false;

  Blur()
  {
   // this.navElements[this.focusIndex].blur();
  }

  Focus()
  {
   // this.navElements[this.focusIndex].focus();
  }

  // CollectButtons()
  // {
  //   this.navElements = document.querySelectorAll( "select,input" );//document.getElementsByTagName("select");
  //   this.focusIndex = 0;
  //   Focus();
  // }


  playerLoad(url)
  {
    this.tc.call("org.rdk.MediaPlayer","create",{"id":"main"});
    this.tc.call("org.rdk.MediaPlayer","load",{"id":"main","url":url});
  }

  playChannel()
  {
    console.log('#########  ATSC >>>  DEBUG:  playChannel() ...')

    // var chMapElement = document.getElementById("chMap");
    // var strLocator = chMapElement.options[chMapElement.selectedIndex].value;
    // var strData = chMapElement.options[chMapElement.selectedIndex].text;
    // setCurrentPlayingChText(strData);

    // //setGuideText(strData);
    // if(this.fromPC)
    // {
    //   playerLoad(strLocator);
    // }
    // else
    // {
    //   if( this.aampPlayer )
    //   {
    //     this.aampPlayer.stop(); // needed for AMLOGIC-550 workaround?
    //   }
    //   else
    //   {
    //     this.aampPlayer = new AAMPMediaPlayer();
    //     this.aampPlayer.addEventListener("playbackStateChanged", playbackStateChanged, null);;
    //   }
    //   this.aampPlayer.load(strLocator);
    // }
    // this.isPlaying = true;
  }

  toggleVistoggleVis(divId)
  {
    console.log('#########  ATSC >>>  DEBUG:  toggleVistoggleVis(' + divId + ') ...')

    // var div = document.getElementById(divId);
    // setGuideText('toggleVistoggleVis');

    // if (div.style.display === "none")
    // {
    //   div.style.display = "block";
    //     setGuideText('display_none:' + div.style.display);
    // }
    // else
    // {
    //   div.style.display = "none";
    //   setGuideText('display:' + div.style.display);
    // }
  }

  onChannelMapNav()
  {
    console.log('#########  ATSC >>>  DEBUG:  onChannelMapNav() ...')

    // var chMapElement = document.getElementById("chMap");
    // var selectedValue = chMapElement.options[chMapElement.selectedIndex].value;
    // //console.log(selectedValue);
  }

  /**
   * Sets the Audio Language
   */
  SetPreferredLanguages(languageListInitConfig)
  {
    console.log('#########  ATSC >>>  DEBUG:  SetPreferredLanguages(' + languageListInitConfig + ') ...')

    /*
    var chMapElement = document.getElementById("chMap");
    var strLocator = chMapElement.options[chMapElement.selectedIndex].value;
    var strData = chMapElement.options[chMapElement.selectedIndex].text;

    setCurrentPlayingChText(strData);

    if( this.aampPlayer )
    {
      // this is hack as setting pref lang is hangging . hence stoping and creating new with
      // init config
      this.aampPlayer.stop(); // needed for AMLOGIC-550 workaround?
    }

    this.aampPlayer = new AAMPMediaPlayer();
    this.aampPlayer.initConfig(languageListInitConfig);
    this.aampPlayer.addEventListener("playbackStateChanged", playbackStateChanged, null);;
    this.aampPlayer.load(strLocator);

    this.isPlaying = true;
    */
  }
  /**
   * Gets the current Audio Track
   */
  getAudioTrack()
  {
    console.log("#########  ATSC >>>  DEBUG: getAudioTrack() - ENTER");

    var audioTrack = this.aampPlayer.getAudioTrack();
    console.log("Invoked getAudioTrack " +audioTrack);
    setGuideText("Invoked getAudioTrack " +audioTrack);
  }

  /*For browser testing without box*/
  _getAvailableAudioTracks()
  {
    var _avlAudioTracks =  [{
                "name": "16",
                "language":     "eng",
                "codec":        "AC3",
                "rendition":    "NORMAL"
        }, {
                "name": "17",
                "language":     "spa",
                "codec":        "AC3",
                "rendition":    "NORMAL"
        }];
    return _avlAudioTracks;
  }

  clearAudioList()
  {
    console.log("#########  ATSC >>>  DEBUG: clearAudioList() - ENTER");

    // var audioListElement = document.getElementById("AudioList");
    // // when length is 0, the evaluation will return false.
    // while (audioListElement.options.length)
    // {
    //   // continue to remove the first option until no options remain.
    //   audioListElement.remove(0);
    // }
  }

  /**
   * Get available audio track info
   */
  getAvailableAudioTracks()
  {
    console.log("#########  ATSC >>>  DEBUG: getAvailableAudioTracks() - ENTER");

    // //var avlAudioTracks = _getAvailableAudioTracks();
    // var audioListBox = document.getElementById("AudioList");

    // var avlAudioTracks = this.aampPlayer.getAvailableAudioTracks();

    // if(avlAudioTracks != undefined)
    // {
    //   var textTrackList = JSON.parse(avlAudioTracks);
    //   console.log("Invoked getAvailableAudioTracks " +avlAudioTracks);

    //   setGuideText("Invoked getAvailableAudioTracks " +avlAudioTracks);
    //   clearAudioList();

    //   for (var i in textTrackList) // map()
    //   {
    //     var strData = textTrackList[i].language;
    //     var opt   = document.createElement('option');
    //     opt.text  = strData + " " +textTrackList[i].codec;
    //     opt.lang  = strData;
    //     opt.value = i;
    //     console.log("Invoked getAvailableAudioTracks loop: " +opt.text);

    //     audioListBox.add(opt,null);
    //   }//FOR
    // }
  }

  /**
   * Sets the Audio Language
   */
  setAudioLanguage()
  {
    console.log("#########  ATSC >>>  DEBUG: setAudioLanguage() - ENTER");

    // var audioListElement = document.getElementById("AudioList");
    // var language = audioListElement.options[audioListElement.selectedIndex].lang;
    // console.log("Invoked setAudioLanguage with language " +language);

    // this.aampPlayer.setAudioLanguage(language);
  }

  /**
   * Sets audio track
   */
  setAudioTrack()
  {
    console.log("#########  ATSC >>>  DEBUG: setAudioTrack() - ENTER");

    // var audioListElement = document.getElementById("AudioList");
    // var track = audioListElement.options[audioListElement.selectedIndex].value;
    // console.log("Invoked setAudioTrack with track " +track);
    // this.aampPlayer.setAudioTrack(track);
  }

  playbackStateChanged(e)
  {
    let playerStatesEnum = { "idle":0, "initializing":1, "initialized":2, "preparing":3, "prepared":4, "playing":8, "paused":6, "seeking":7, "complete":11, "error":12 };

    console.log("#########  ATSC >>>  Playback state changed event: " + JSON.stringify(e));
    switch (e.state) {
        case playerStatesEnum.idle:
            playerState = playerStatesEnum.idle;
            break;
        case playerStatesEnum.initializing:
            playerState = playerStatesEnum.initializing;
            break;
        case playerStatesEnum.initialized:
            playerState = playerStatesEnum.initialized;
            break;
        case playerStatesEnum.preparing:
            playerState = playerStatesEnum.preparing;
            break;
        case playerStatesEnum.prepared:
            playerState = playerStatesEnum.prepared;
            break;
        case playerStatesEnum.playing:
            playerState = playerStatesEnum.playing;
            break;
        case playerStatesEnum.complete:
            playerState = playerStatesEnum.complete;
            break;
        case playerStatesEnum.error:
            playerState = playerStatesEnum.error;
            break;
        default:
            playerState = e.state;
            console.log("State not expected");
            break;
        }
        var evetStr = "Player state is: " + playerState;
        console.log(evetStr);

        this.setGuideText(evetStr);
  }

  static _states(){
    return [
          // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          class TuningState extends this
          {
            $enter()
            {
              console.log(">>>>>>>>>>>>   STATE:  TuningState - ENTER");
            }

            $exit()
            {
              console.log(">>>>>>>>>>>>   STATE:  TuningState - EXIT");
            }


  //ch down 34
  // ch up 33
  // vol down - 174, up - 175
  //playpause - 179
  //red - 69
  //green - 8
  // yellow - 77
  // 0 - 48, 1 - 49 , 2 - 50 , 8 - 56 9 - 57
  // red big record - 118
  // search 114
  // info 120
  //? 113
  //volume - 173

            _handleKey(k)
            {
              console.log('TuningState >>> k.keyCode: ' + k.keyCode)

              switch( keyCode )
              {
                case 65:
                case 118: // big red record button
                {
                  if(this.bFullScreen)
                  {
                    this.bFullScreen = false;
                  }
                  else
                  {
                    this.bFullScreen = true;
                  }
                  // todo: replace with use of SetRectangle helper function
                  this.fullscreen(this.bFullScreen);
                }
                break;
                case 37: // left
                // if( this.focusIndex>0 )
                // {
                //   Blur();
                //   this.focusIndex--;
                //   Focus();
                // }
                break;

                case 39: // right
                // if( this.focusIndex<this.navElements.length-1 )
                // {
                //   Blur();
                //   this.focusIndex++;
                //   Focus();
                // }
                break;

                //down - 174, up - 175

                case 40: // down
                  break;

                case 38: // up
                  break;

                //case 33: // ch up
                case 175: // volume up
                  //channelUp(true);
                  break;

                //case 34: // ch down
                case 174: // volume down
                  //channelDown(true);
                  break;

                case 13: // return
                case 32: // space
                if( this.focusIndex == 0 )
                {
                  this.playChannel(true);
                }
                break;
                default:
                  return false // propagate
              }//SWITCH

              let rpc = gDataModel.getKeymapRPC(k.keyCode);

              console.log('TuningState >>> _handleKey: rpc:' + rpc)
              if(rpc != true)
              {
                return true // handled
              }

              return true
            }
          }, // CLASS - TuningState
    ]
  }//_states

}//CLASS

/*
<body bgcolor = "#FFFFCC" text = "#000000" topmargin="50" leftmargin="100">
	<div id="videoContainer">
		<video id="vidWindow" style="height:40%; width:40%; position:absolute; top:50; left:500">
			<source src="dummy.mp4" type="video/ave"> <!-- hole punching -->
		</video>
	</div>

	<div id="content">
		<select id = "chMap" size="28" onchange="onChannelMapNav();" onclick="playChannel();"></select>

		<input type="button" value="startScan" onclick="startScan();"/>
		<input type="button" value="abortScan" onclick="abortScan();"/>
		<input type="button" value="RefreshChannelMap" onclick="getAllServices();"/>
		<input type="button" value="getAllGuideEvents" onclick="getAllGuideEvents();"/>

		<input type="button" value="full" onclick="SetRectangle(0,0,1,1);"/>
		<input type="button" value="TR" onclick="SetRectangle(0.5,0,0.5,0.5);"/>
		<input type="button" value="TL" onclick="SetRectangle(0.0,0,0.5,0.5);"/>
		<input type="button" value="BL" onclick="SetRectangle(0.0,0.5,0.5,0.5);"/>
		<input type="button" value="BR" onclick="SetRectangle(0.5,0.5,0.5,0.5);"/>

		<br/>

		<input type="button" value="GetTrack" onclick="getAudioTrack();"/>
		<input type="button" value="GetAvlTracks" onclick="getAvailableAudioTracks();"/>
		<select id = "AudioList" size="3"></select>
		<input type="button" value="SetAudLan" onclick="setAudioLanguage();"/>
		<input type="button" value="SetAudTrack" onclick="setAudioTrack();"/>

		<!-- <input type="button" value="Preferred-Eng" onclick="SetPreferredLanguages(`eng`);"/> -->
		<input type="button" value="Preferred-Eng,Spa" onclick="SetPreferredLanguages(this.en_spaInitConfig);"/>
		<input type="button" value="Preferred-Spa,Eng" onclick="SetPreferredLanguages(this.spa_enInitConfig);"/>

		<br/>
		<!-- <input type="button" value="startGuideScan" onclick="startGuideScan();"</input>
		<input type="button" value="abortGuideScan" onclick="startGuideScan();"</input> -->

		<br/>
		<b>Total Channels:</b><label id="chcountLabel"></label>
		<b> Tuned:</b> <label id = "currChSelLabel"></label>
		<br/>
		<div id="myprogressBar">1%</div>
		<textarea rows="4" cols="120" id="console" style="border:solid 1px orange;"></textarea>
		<br/>
		<b>Guide Data</b>
		<br/>
		<textarea rows="4" cols="120" id="guideText" style="border:solid 1px orange;"></textarea>
		<br/>
		<b>Use red record key to toggle fullscreen mode</b>
	</div>
	</body>
</html>
*/
