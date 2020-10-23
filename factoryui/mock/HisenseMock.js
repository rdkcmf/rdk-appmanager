
//============================================================================================================================
//============================================================================================================================


let apis =
[
  // FACTORY - Main Sheet
  //  - Channel Init
  //  - Options
  //     +  ToFac F / M

  { plugin: 'org.rdk.System',          api: '1.getDownloadedFirmwareInfo', params: [], cb: () => { return { "currentFWVersion": "AX061AEI_VBN_RDK-29456_ConnectTV_20201012190807sdy" }} },
  { plugin: 'org.rdk.System',          api: '1.getTimeZoneDST',            params: [], cb: () => { return {"timeZone":"America/New_York","success":true} } },
  { plugin: 'TODO_Plugin',             api: '1.getRegion',                 params: [], cb: () => { return {  value: { key: "Wakanda", value: 999 } } } },
  { plugin: 'org.rdk.UserPreferences', api: '1.getUILanguage',             params: [  'params' ], cb: () => { return {"ui_language":"US_en","success":true} } },
  { plugin: 'TODO_Plugin',             api: '1.getEnableUART',             params: [], cb: () => { return {  value: true } } },
  { plugin: 'TODO_Plugin',             api: '1.getEnablePQCOM',            params: [], cb: () => { return {  value: true } } },

  { plugin: 'TODO_Plugin',             api: '1.getToFac',                  params: [],          cb: () => { return { "value":   "M"         } } },
  { plugin: 'TODO_Plugin',             api: '1.setToFac',                  params: [ 'value' ], cb: () => { return true;           } },

 // { plugin: 'TODO_Plugin', api: '1.getMACaddress',       params: [], cb: () => { return {   mac: "01:B0:B7:FC:8C:E2" } } },
  { plugin: 'org.rdk.System',          api: '1.getDeviceInfo',             params: [ 'params' ],   cb: () => { return { "estb_mac": "01:B0:B7:FC:8C:E2" } } },
  { plugin: 'org.rdk.System',          api: '1.getSerialNumber',           params: [  ],           cb: () => { return { "serialNumber": "M92012EML452"      } } },


  { plugin: 'TODO_Plugin', api: '1.getCurProjectID',     params: [], cb: () => { return {    id: "003 40A31EUV"      } } },
  { plugin: 'TODO_Plugin', api: '1.getHDCP22key',        params: [], cb: () => { return {   key: "00000009"          } } },
  { plugin: 'TODO_Plugin', api: '1.getHDCP14key',        params: [], cb: () => { return {   key: "00001108"          } } },

  { plugin: 'org.rdk.System', api: '1.requestSystemUptime', params: [  ], cb: () => { return {"systemUptime" : 1234556 }; } },

  { plugin: 'TODO_Plugin', api: '1.setRegion',           params: [ 'value' ], cb: () => { console.log('setRegion(' + JSON.stringify(this.value) + ') ... '); return true;     } },
  { plugin: 'TODO_Plugin', api: '1.setEnableUART',       params: [ 'value' ], cb: () => { console.log('setEnableUART(' + JSON.stringify(this.value) + ') ... '); return true; } },

  // FACTORY - WhiteBalance
  { plugin: 'TODO_Plugin', api: '1.getWBPanel',         params: [], cb: () => { return { value: "B1"               } } },
  { plugin: 'TODO_Plugin', api: '1.getGainR',           params: [], cb: () => { return { value: 128                } } },
  { plugin: 'TODO_Plugin', api: '1.getGainG',           params: [], cb: () => { return { value: 128                } } },
  { plugin: 'TODO_Plugin', api: '1.getGainB',           params: [], cb: () => { return { value: 128                } } },
  { plugin: 'TODO_Plugin', api: '1.getOffsetR',         params: [], cb: () => { return { value: 256                } } },
  { plugin: 'TODO_Plugin', api: '1.getOffsetG',         params: [], cb: () => { return { value: 256                } } },
  { plugin: 'TODO_Plugin', api: '1.getOffsetB',         params: [], cb: () => { return { value: 256                } } },
  { plugin: 'TODO_Plugin', api: '1.getColorTemp',       params: [], cb: () => { return { value: "Standard"         } } },

  { plugin: 'TODO_Plugin', api: '1.setWBPanel',         params: [ 'value' ], cb: () => { return true;                 } },
  { plugin: 'TODO_Plugin', api: '1.setGainR',           params: [ 'value' ], cb: () => { return true;                 } },
  { plugin: 'TODO_Plugin', api: '1.setGainG',           params: [ 'value' ], cb: () => { return true;                 } },
  { plugin: 'TODO_Plugin', api: '1.setGainB',           params: [ 'value' ], cb: () => { return true;                 } },
  { plugin: 'TODO_Plugin', api: '1.setOffsetR',         params: [ 'value' ], cb: () => { return true;                 } },
  { plugin: 'TODO_Plugin', api: '1.setOffsetG',         params: [ 'value' ], cb: () => { return true;                 } },
  { plugin: 'TODO_Plugin', api: '1.setOffsetB',         params: [ 'value' ], cb: () => { return true;                 } },
  { plugin: 'TODO_Plugin', api: '1.setColorTemp',       params: [ 'value' ], cb: () => { return true;                 } },

  // DESIGN - Video Curve
  { plugin: 'TODO_Plugin', api: '1.getCurve0',          params: [], cb: () => { return { value:   0                 } } },
  { plugin: 'TODO_Plugin', api: '1.getCurve25',         params: [], cb: () => { return { value:  16                 } } },
  { plugin: 'TODO_Plugin', api: '1.getCurve50',         params: [], cb: () => { return { value:  32                 } } },
  { plugin: 'TODO_Plugin', api: '1.getCurve75',         params: [], cb: () => { return { value:  64                 } } },
  { plugin: 'TODO_Plugin', api: '1.getCurve100',        params: [], cb: () => { return { value: 128                 } } },

  { plugin: 'TODO_Plugin', api: '1.setCurve0',          params: [ 'value' ], cb: () => { return true;                 } },
  { plugin: 'TODO_Plugin', api: '1.setCurve25',         params: [ 'value' ], cb: () => { return true;                 } },
  { plugin: 'TODO_Plugin', api: '1.setCurve50',         params: [ 'value' ], cb: () => { return true;                 } },
  { plugin: 'TODO_Plugin', api: '1.setCurve75',         params: [ 'value' ], cb: () => { return true;                 } },
  { plugin: 'TODO_Plugin', api: '1.setCurve100',        params: [ 'value' ], cb: () => { return true;                 } },

  // DESIGN - Backlight
  { plugin: 'TODO_Plugin', api: '1.getBacklightValMin', params: [], cb: () => { return { value: 0                   } } },
  { plugin: 'TODO_Plugin', api: '1.getBacklightVal20',  params: [], cb: () => { return { value: 20                  } } },
  { plugin: 'TODO_Plugin', api: '1.getBacklightValMid', params: [], cb: () => { return { value: 50                  } } },
  { plugin: 'TODO_Plugin', api: '1.getBacklightVal80',  params: [], cb: () => { return { value: 80                  } } },
  { plugin: 'TODO_Plugin', api: '1.getBacklightValMax', params: [], cb: () => { return { value: 100                 } } },

  { plugin: 'TODO_Plugin', api: '1.setBacklightValMin', params: [ 'value' ], cb: () => { return true;                 } },
  { plugin: 'TODO_Plugin', api: '1.setBacklightVal20',  params: [ 'value' ], cb: () => { return true;                 } },
  { plugin: 'TODO_Plugin', api: '1.setBacklightValMid', params: [ 'value' ], cb: () => { return true;                 } },
  { plugin: 'TODO_Plugin', api: '1.setBacklightVal80',  params: [ 'value' ], cb: () => { return true;                 } },
  { plugin: 'TODO_Plugin', api: '1.setBacklightValMax', params: [ 'value' ], cb: () => { return true;                 } },

  // DESIGN - PictureMode
  { plugin: 'org.rdk.tv.ControlSettings', api: '1.getPictureMode',      params: [], cb: () => { return { "pictureMode": "Standard" } } },
  { plugin: 'org.rdk.tv.ControlSettings', api: '1.getBrightness',       params: [], cb: () => { return { "brightness":  12         } } },
  { plugin: 'org.rdk.tv.ControlSettings', api: '1.getContrast',         params: [], cb: () => { return { "contrast":    12         } } },
  { plugin: 'org.rdk.tv.ControlSettings', api: '1.getSaturation',       params: [], cb: () => { return { "saturation":  12         } } },
  { plugin: 'org.rdk.tv.ControlSettings', api: '1.getBacklight',        params: [], cb: () => { return { "backlight":   10         } } },
  { plugin: 'org.rdk.tv.ControlSettings', api: '1.getSharpness',        params: [], cb: () => { return { "sharpness":   75         } } },

  { plugin: 'TODO_Plugin', api: '1.getColor', params: [], cb: () => { return { "color":   75         } } },
  { plugin: 'TODO_Plugin', api: '1.setColor', params: [ 'value' ], cb: () => { return true;           } },

  // { plugin: 'org.rdk.tv.ControlSettings', api: '1.getColorTemperature', params: [], cb: () => { return { "colorTemp": "Warm"       } } },

  { plugin: 'org.rdk.tv.ControlSettings', api: '1.setPictureMode',     params: [ 'pictureMode' ], cb: () => { return { 'success': true };           } },
  { plugin: 'org.rdk.tv.ControlSettings', api: '1.setBrightness',      params: [ 'brightness' ],  cb: () => { return { 'success': true };           } },
  { plugin: 'org.rdk.tv.ControlSettings', api: '1.setContrast',        params: [ 'contrast' ],    cb: () => { return { 'success': true };           } },
  { plugin: 'org.rdk.tv.ControlSettings', api: '1.setColor',           params: [ 'saturation' ],  cb: () => { return { 'success': true };           } },
  { plugin: 'org.rdk.tv.ControlSettings', api: '1.setBacklight',       params: [ 'backlight' ],   cb: () => { return { 'success': true };           } },
  { plugin: 'org.rdk.tv.ControlSettings', api: '1.setSharpness',       params: [ 'sharpness' ],   cb: () => { return { 'success': true };           } },

  // DESIGN - Test Pattern

  // DESIGN - Bypass
  { plugin: 'TODO_Plugin', api: '1.getBypassEnablePQ',     params: [], cb: () => { return { value: true             } } },
  { plugin: 'TODO_Plugin', api: '1.getBypassEnableGAMMA',  params: [], cb: () => { return { value: false            } } },
  { plugin: 'TODO_Plugin', api: '1.getBypassEnableCOLOR',  params: [], cb: () => { return { value: true             } } },
  { plugin: 'TODO_Plugin', api: '1.getBypassEnableXVYCC',  params: [], cb: () => { return { value: true             } } },

  { plugin: 'TODO_Plugin', api: '1.setBypassEnablePQ',     params: [ 'value' ], cb: () => { return true;              } },
  { plugin: 'TODO_Plugin', api: '1.setBypassEnableGAMMA',  params: [ 'value' ], cb: () => { return true;              } },
  { plugin: 'TODO_Plugin', api: '1.setBypassEnableCOLOR',  params: [ 'value' ], cb: () => { return true;              } },
  { plugin: 'TODO_Plugin', api: '1.setBypassEnableXVYCC',  params: [ 'value' ], cb: () => { return true;              } },

  // DESIGN - Audio Volume
  { plugin: 'TODO_Plugin', api: '1.getAudioVolumeMin',     params: [], cb: () => { return { 'volumeLevel': 10         } } },
  { plugin: 'TODO_Plugin', api: '1.setAudioVolumeMin',     params: [ 'volumeLevel' ], cb: () => { return { 'success': true };  } },
  { plugin: 'TODO_Plugin', api: '1.getAudioVolume25',      params: [], cb: () => { return { value: 10                  } } },
  { plugin: 'TODO_Plugin', api: '1.setAudioVolume25',      params: [ 'value' ], cb: () => { return { 'success': true };  } },
  { plugin: 'TODO_Plugin', api: '1.getAudioVolumeMid',     params: [], cb: () => { return { value: 10                  } } },
  { plugin: 'TODO_Plugin', api: '1.setAudioVolumeMid',     params: [ 'value' ], cb: () => { return { 'success': true };  } },
  { plugin: 'TODO_Plugin', api: '1.getAudioVolume75',      params: [], cb: () => { return { value: 10                  } } },
  { plugin: 'TODO_Plugin', api: '1.setAudioVolume75',      params: [ 'value' ], cb: () => { return { 'success': true };  } },
  { plugin: 'TODO_Plugin', api: '1.getAudioVolumeMax',     params: [], cb: () => { return { value: 10                  } } },
  { plugin: 'TODO_Plugin', api: '1.setAudioVolumeMax',     params: [ 'value' ], cb: () => { return { 'success': true };  } },

  { plugin: 'org.rdk.DisplaySettings', api: '1.getVolumeLevel',     params: [],  cb: () => { return { 'volumeLevel': 10     } } },
  { plugin: 'org.rdk.DisplaySettings', api: '1.setVolumeLevel',     params: [ 'volumeLevel' ], cb: () => { return { 'success': true };  } },

  // DESIGN - Audio Mode
  { plugin: 'TODO_Plugin', api: '1.getAudioMode',       params: [], cb: () => { return { value: "Standard"          } } },
  { plugin: 'TODO_Plugin', api: '1.getWALLmode',        params: [], cb: () => { return { value: true                } } },
  { plugin: 'TODO_Plugin', api: '1.get120Hz',           params: [], cb: () => { return { value: 2                   } } },
  { plugin: 'TODO_Plugin', api: '1.get500Hz',           params: [], cb: () => { return { value: 4                   } } },
  { plugin: 'TODO_Plugin', api: '1.get1p5KHz',          params: [], cb: () => { return { value: 6                   } } },
  { plugin: 'TODO_Plugin', api: '1.get5KHz',            params: [], cb: () => { return { value: 8                   } } },
  { plugin: 'TODO_Plugin', api: '1.get10KHz',           params: [], cb: () => { return { value: 10                  } } },

  { plugin: 'TODO_Plugin', api: '1.setAudioMode',       params: [ 'value' ], cb: () => { return true;                 } },
  { plugin: 'TODO_Plugin', api: '1.setWALLmode',        params: [ 'value' ], cb: () => { return true;                 } },
  { plugin: 'TODO_Plugin', api: '1.set120Hz',           params: [ 'value' ], cb: () => { return true;                 } },
  { plugin: 'TODO_Plugin', api: '1.set500Hz',           params: [ 'value' ], cb: () => { return true;                 } },
  { plugin: 'TODO_Plugin', api: '1.set1p5KHz',          params: [ 'value' ], cb: () => { return true;                 } },
  { plugin: 'TODO_Plugin', api: '1.set5KHz',            params: [ 'value' ], cb: () => { return true;                 } },
  { plugin: 'TODO_Plugin', api: '1.set10KHz',           params: [ 'value' ], cb: () => { return true;                 } },

  // DESIGN - Project ID
  { plugin: 'TODO_Plugin', api: '1.getProjectID',       params: [], cb: () => { return { value: "project ID 1"      } } },

  // DESIGN - Panel Options
  { plugin: 'TODO_Plugin', api: '1.getOverDrive',       params: [], cb: () => { return { value: true                 } } },
  { plugin: 'TODO_Plugin', api: '1.setOverDrive',       params: [ 'value' ], cb: () => { return true;                  } },
  { plugin: 'TODO_Plugin', api: '1.getDemura',          params: [], cb: () => { return { value: true                 } } },
  { plugin: 'TODO_Plugin', api: '1.setDemura',          params: [ 'value' ], cb: () => { return true;                  } },

  // DESIGN - HP DRC
  { plugin: 'TODO_Plugin', api: '1.getHpDRCEnable',     params: [], cb: () => { return { value: true                 } } },
  { plugin: 'TODO_Plugin', api: '1.setHpDRCEnable',     params: [ 'value' ], cb: () => { return true;                  } },
  { plugin: 'TODO_Plugin', api: '1.getHpDrc',           params: [], cb: () => { return { value: true                 } } },
  { plugin: 'TODO_Plugin', api: '1.setHpDrc',           params: [ 'value' ], cb: () => { return true;                  } },

  // DESIGN - PEQ
  { plugin: 'TODO_Plugin', api: '1.getSOC_DRC_Enable',  params: [], cb: () => { return { value: true                 } } },
  { plugin: 'TODO_Plugin', api: '1.setSOC_DRC_Enable',  params: [ 'value' ], cb: () => { return true;                  } },
  { plugin: 'TODO_Plugin', api: '1.getSOC_DRC_Value',   params: [], cb: () => { return { value: 15                 } } },
  { plugin: 'TODO_Plugin', api: '1.setSOC_DRC_Value',   params: [ 'value' ], cb: () => { return true;                  } },
  { plugin: 'TODO_Plugin', api: '1.getSOC_HPF_Enable',  params: [], cb: () => { return { value: false                 } } },
  { plugin: 'TODO_Plugin', api: '1.setSOC_HPF_Enable',  params: [ 'value' ], cb: () => { return true;                  } },
  { plugin: 'TODO_Plugin', api: '1.getSOC_HPF_Value',   params: [], cb: () => { return { value: 13                 } } },
  { plugin: 'TODO_Plugin', api: '1.setSOC_HPF_Value',   params: [ 'value' ], cb: () => { return true;                  } },

  { plugin: 'TODO_Plugin', api: '1.getPEQEnable',       params: [], cb: () => { return { value: true                 } } },
  { plugin: 'TODO_Plugin', api: '1.setPEQEnable',       params: [ 'value' ], cb: () => { return true;                  } },
  { plugin: 'TODO_Plugin', api: '1.getPEQband',         params: [], cb: () => { return { value: true                 } } },
  { plugin: 'TODO_Plugin', api: '1.setPEQband',         params: [ 'value' ], cb: () => { return true;                  } },
  { plugin: 'TODO_Plugin', api: '1.getFCfineStep',      params: [], cb: () => { return { value: 4                   } } },
  { plugin: 'TODO_Plugin', api: '1.setFCfineStep',      params: [ 'value' ], cb: () => { return true;                  } },
  { plugin: 'TODO_Plugin', api: '1.getFCfineHz',        params: [], cb: () => { return { value: 77                   } } },
  { plugin: 'TODO_Plugin', api: '1.setFCfineHz',        params: [ 'value' ], cb: () => { return true;                  } },
  { plugin: 'TODO_Plugin', api: '1.getPEQGainDb',       params: [], cb: () => { return { value: 88                   } } },
  { plugin: 'TODO_Plugin', api: '1.setPEQGainDb',       params: [ 'value' ], cb: () => { return true;                  } },
  { plugin: 'TODO_Plugin', api: '1.getPEQQvalue',       params: [], cb: () => { return { value: 33                   } } },
  { plugin: 'TODO_Plugin', api: '1.setPEQQvalue',       params: [ 'value' ], cb: () => { return true;                  } },

  { plugin: 'TODO_Plugin', api: '1.getCertificationMode', params: [], cb: () => { return { value: 33                   } } },
  { plugin: 'TODO_Plugin', api: '1.setCertificationMode', params: [ 'value' ], cb: () => { return true;                  } },
];

//============================================================================================================================
//============================================================================================================================

var WebSocketServer = new require('ws');
var JsonRPC         = require('simple-jsonrpc-js');

console.log('Starting up Mock ...')

var webSocketServer = new WebSocketServer.Server({
  host: '0.1.2.3',
  port: 9998
}).on('connection', function(ws)
{
  var jrpc = new JsonRPC();
  ws.jrpc = jrpc;

  console.log('Mock ... connected')

  ws.jrpc.toStream = function(message)
  {
      // console.log('Mock ... TX: ' + JSON.stringify(message))
      ws.send(message);
  };


  //==================================================================================
  ws.on('message', function(message)
  {
    var json = JSON.parse(message)
    console.log('Mock ... RX: ' + JSON.stringify(json))

    jrpc.messageHandler(message);
  });
  //==================================================================================

  // Register ALL
  apis.map( o =>
  {
    let f = (o.plugin + '.' + o.api)// + "FAIL_THEM_ALL")
    console.log('Mock ... Register on("'+f+'")');

    jrpc.on(f, o.params, o.cb);
  });

  // setInterval(() => {

  //   console.log('Mock ... Fire >>> "onMyEvent" ');
  //   jrpc.notification('client.MyPackage.events.onMyEvent', { result: "Good"});

  //   // jrpc.call('MyPackage.onMyEvent', { "result": "Good"}).then(function (result)
  //   // {
  //   //   console.log('Mock ... Fire >>> "onMyEvent"  ... CALLED');
  //   // });

  //   }, 3000);

  var stdin = process.stdin;

// without this, we would only get streams once enter is pressed
stdin.setRawMode( true );

// resume stdin in the parent process (node app won't quit all by itself
// unless an error or process.exit() happens)
stdin.resume();

// i don't want binary, do you?
stdin.setEncoding( 'utf8' );


// on any data into stdin
stdin.on( 'data', function( key )
{
  // ctrl-c ( end of text )
  if ( key === '\u0003' ) {
    process.exit();
  }
  console.log('GOT KEY >> "' + key +'"')

  switch(key)
  {
    case 'n':
    {
      console.log('Mock ... Fire >>> "onMyEvent" ');
      jrpc.notification('client.MyPackage.events.onMyEvent', { result: "Good"});
    }
    break;

    case 'r':
    {
      console.log('Mock ... Fire >>> "R_Gain" ');
      jrpc.notification('client.MyPackage.events.onWB_R_Gain', { value: 9 });
    }
    break;

    case 's':
    {
      let ans =
      {
        "jasonrpc":"2.0",
        "method":"org.rdk.FactoryComms.1.onCommandEvent",
        "params":
        {
          "payload":"0xA1090000",
          "data": 0x88,
          "name":"1.10 Set the volume",
          "seqNum": 759
        }
      }

      console.log('Mock ... Fire >>> SERIAL >> "onCommandEvent" ');
      jrpc.notification("client.org.rdk.FactoryComms.events.onCommandEvent", JSON.stringify(ans) );
    }
    break;


  }//SWITCH

  // write the key to stdout all normal like
  //process.stdout.write( key );
});

  //==================================================================================

  // var item_id = 120;

  // jrpc.on('create', ['item', 'rewrite'], function(item, rewrite){
  //     item_id ++;
  //     item.id = item_id;
  //     return item;
  // });

});
