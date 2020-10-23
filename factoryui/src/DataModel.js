import { PSTORE_NAMESPACE, MENU_FONT_PTS, MENU_FONT_PTS_lo } from './components/Globals';

import { Utils } from 'wpe-lightning-sdk'

import ThunderUtils from './ThunderUtils.js';
import JSONKeyPath  from 'json-keypath';

export default class DataModel
{
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  constructor()
  {
    this.dataStore = {} // empty

    this.dataMap    = null
    this.keycodeMap = null
    this.serialMap  = null

    this.thunderUtils = new ThunderUtils();
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  getThunder()
  {
    return this.thunderUtils;
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // FORMATTER:  seconds to "uptime" string
  //
  static formatUptime(secs)
  {
    var d = Math.abs(secs);
    var r = {};          // result
    var s =              // structure
    {
        year:   1536000,
        month:  2592000,
        week:    604800, // uncomment row to ignore
        day:      86400, // feel free to add your own row
        hour:      3600,
        minute:      60,
        second:       1
    };

    Object.keys(s).forEach(function(key)
    {
        r[key] = Math.floor(d / s[key]);
            d -= r[key] * s[key];
    });

    return ''+ (r["day"] + (r["week"] * 7) + (r["month"] * 4.285)) + 'd:' + r["hour"] + 'h:' + r["minute"] + 'm';
  }

  static formatBoolean(val)
  {
    return val ? "True" : "False"
  }
  static formatOnOff(val)
  {
    return val ? "On" : "Off"
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  static getFn(fn)
  {
    // console.log(' >>>>  getFn( '+fn+') - ENTER' )

    switch(fn)
    {
      case "formatBoolean": return DataModel.formatBoolean; break;
      case "formatUptime":  return DataModel.formatUptime;  break;
      case "formatOnOff":   return DataModel.formatOnOff;   break;
      default: return null;
    }

    return null;
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  static measureTextWidth(text = {})
  {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const {
      fontStyle,
      fontWeight,
      fontSize,
      fontFamily = text.fontFace || 'sans-serif'
    } = text;
    const fontCss = [
      fontStyle,
      fontWeight,
      fontSize ? `${fontSize}px` : (MENU_FONT_PTS) + 'px',  //'0',
      `'${fontFamily}'`
    ]
      .filter(Boolean)
      .join(' ');
    ctx.font = fontCss;

    // console.log("#############   measureTextWidth("+text.text +") ... fontCss: " + JSON.stringify(fontCss))

    const textMetrics = ctx.measureText(text.text || '');
    // try using the actual bounding box first because it will be more accurate
    if (textMetrics.actualBoundingBoxLeft && textMetrics.actualBoundingBoxRight)
    {
      let ww = Math.round(
        Math.abs(textMetrics.actualBoundingBoxLeft) +
          Math.abs(textMetrics.actualBoundingBoxRight)
      );
      // console.log("#############   measureTextWidth() ... AA ww: " + ww)

      return  ww;
    }

    // console.log("#############   measureTextWidth() ... BB ww: " + Math.round(textMetrics.width))

    return Math.round(textMetrics.width);
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  callThunder(rpc)
  {
    if(this.thunderUtils != null)
    {
      if(rpc == null || rpc == undefined)
      {
        console.log( 'DataUtils::callThunderNoCatch() >>> BAD ARGS' );
        return ans;
      }

      return this.thunderUtils.callThunder(rpc)
    }
    else
    {
      console.log('DataUtils::callThunder() ... THUNDER NOT READY ')
    }
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  async activatePlugin( pp )
  {
    if(this.thunderUtils != null)
    {
      if(pp == null || pp == undefined)
      {
        console.log( 'DataUtils::activatePlugin() >>> BAD ARGS' );
        return null;
      }

      return this.thunderUtils.activatePlugin(pp)
    }
    else
    {
      console.log('DataUtils::activatePlugin() ... THUNDER NOT READY ')
    }
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  async callThunderNoCatch(rpc)
  {
    var ans = null

    // console.log( 'INFO:  DataUtils::callThunderNoCatch() >>> ' + (typeof this.thunderUtils) );

    if(this.thunderUtils != null)
    {
      if(rpc == null || rpc == undefined)
      {
        console.log( 'DataUtils::callThunderNoCatch() >>> BAD ARGS' );
        return ans;
      }

      ans = await this.thunderUtils.callThunder(rpc)
    }
    else
    {
      console.log('DataUtils::callThunderNoCatch() ... THUNDER NOT READY ')
    }

    return ans;
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  static fetchJSON(url)
  {
    return new Promise( (resolve, reject)  =>
    {
      console.log("fetchJSON() ... using url: " + url);

      // Fetch JSON
      //
      fetch(url)
      .then( res => res.json() )
      .then(data =>
      {
        console.log('fetchJSON() - complete ... ' );

        resolve(data)
      })
      .catch(err =>
      {
        console.log("Error parsing Keys map ... err: " + JSON.stringify(err));
        reject()
      });
    });
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  setDataMap(data)
  {
    this.dataMap = data
  }

  getDataMap()
  {
    return this.dataMap
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  setKeycodeMap(keys)
  {
    this.keycodeMap = keys
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  setSerialMap(serial)
  {
    this.serialMap = serial
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  getKeymapRPC(keyPath)
  {
    let kc = '0x' + keyPath.toString(16)
    try
    {
      let rpc = this.keycodeMap[kc]
      if( rpc != undefined)
      {
        return rpc
      }
      else
      {
        console.log('ERROR:  getKeymapRPC("' + kc + '") - NOT found.');
        return null
      }
    }
    catch(e)
    {
      console.log('EXCEPTION:  getKeymapRPC("' + keyPath + '") - NOT found.');
      return null;
    }
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  getSerialRPC(keyPath)
  {
    var has0x = keyPath.startsWith("0x");
    var    kc = has0x ? keyPath : '0x' + keyPath

    try
    {
      let cmd = this.serialMap[kc]
      if(cmd != undefined && cmd != null)
      {
        let rpc = this.dataStore[cmd.Rpc] // get the RPC path from the Serial obj
        if( rpc != undefined)
        {
          return cmd.Rpc
        }
        else
        {
          console.log('ERROR:  getSerialRPC("' + kc + '") - NOT found.');
          return null
        }
      }
      else
      {
        console.log('ERROR:  getSerialRPC() >>  cmd: "' + cmd + '" - NOT found.');
        return null
      }
    }
    catch(e)
    {
      console.log('EXCEPTION:  getSerialRPC("' + keyPath + '") - NOT found.');
      return null;
    }
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  static dataValueSET(keyPath, value)
  {
    console.log( " #####  >> dataValueSET()  ... keyPath: " + keyPath + "  value: " + JSON.stringify(value) )

    if(gDataModel)
    {
      gDataModel.setValue(keyPath, value)
    }
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  registerEvent(pkg, event, handler)
  {
    if(this.thunderUtils != null)
    {
      this.thunderUtils.registerEvent( pkg, event, handler );
    }
    else
    {
      console.log('NOT READY ')
    }
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  addDataItem( rpc, keyPath = null)
  {
    if(keyPath == null)
    {
      keyPath = rpc.keyPath
    }

    if(keyPath == null)
    {
      console.log('ERROR:  addDataItem() - keypath is NULL !')
      return;
    }

    var dataItem = this.dataStore[keyPath];

    if(dataItem != null && dataItem != undefined)
    {
      console.log('ERROR:  addDataItem() - keypath: ' + keyPath + ' - ALREADY exists !')
      return;
    }
    else
    {
      // console.log('INFO:  addDataItem() - keyPath: ' + keyPath + ' - Created !')

      this.dataStore[keyPath] = rpc;
      this.dataStore[keyPath].value = null   // new
      this.dataStore[keyPath].listeners = [] // new

      // Set a DEFAULT value for this property
      if(rpc.Default != undefined)
      {
        this.setValue(keyPath, rpc.Default)
      }

      // Initial Update...
      this.getValue(keyPath)
    }
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  addListener( keyPath, obj )
  {
    if( (keyPath == undefined || keyPath == null) ||
        (obj     == undefined || obj     == null) ||
        (obj.didChange == undefined ) )
    {
      console.log('ERROR:  addListener() - BAD ARGS')
      return;
    }

    var dataItem = this.dataStore[keyPath];

    if(dataItem != null && dataItem != undefined)
    {
      dataItem.listeners.push( obj )

      // console.log('INFO:  addListener() -  keyPath: ' + keyPath + ' - ADDED  len: ' + dataItem.listeners.length)
    }
    else
    {
      console.log('ERROR:  addListener() - data item not found.  keyPath: ' + keyPath)
    }
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  removeListener( keyPath, obj )
  {
    if( (keyPath == undefined || keyPath == null) ||
        (obj     == undefined || obj     == null) ||
        (obj.didChange == undefined ) )
    {
      console.log('ERROR:  removeListener() - BAD ARGS')
      return;
    }

    var dataItem = this.dataStore[keyPath];

    if(dataItem != null && dataItem != undefined)
    {
      var listeners = dataItem.listeners.filter( (o) => { return (o != obj) }) ;

      dataItem.listeners = listeners

      // console.log('INFO:  removeListener() -  keyPath: ' + keyPath + ' - REMOVED  len: ' + dataItem.listeners.length)
    }
    else
    {
      console.log('ERROR:  removeListener() - data item not found.  keyPath: ' + keyPath)
    }
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  //
  // SET to PersistentStore
  //
  async setPStore(key, val)
  {
    if(key && val != undefined)
    {
      var rc = this.thunderUtils.callThunderNoCatch(   // CALL THUNDER
              { plugin: "org.rdk.PersistentStore",
                method: "setValue",
                params: { "namespace": PSTORE_NAMESPACE,
                                "key": key,
                              "value": val } } )
      return rc
    }
    else
    {
      console.log('ERROR:  setPStore( key: '+key+', val: '+val+') ... BAD args')
      return null
    }
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  //
  // GET from PersistentStore
  //
  async getPStore(key)
  {
    var ans = this.thunderUtils.callThunderNoCatch(
                { plugin: "org.rdk.PersistentStore",
                  method: "getValue",
                  params: { "namespace": PSTORE_NAMESPACE,
                                  "key":  key} } )
    return ans
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  getValue(keyPath)
  {
    if(this.thunderUtils == null || this.thunderUtils == undefined)
    {
      console.log('FATAL:  getValue() -  thunderUtils is NULL ...')
      return
    }

    var dataItem = this.dataStore[keyPath];

    if(dataItem != null && dataItem != undefined)
    {
      console.log('INFO:  getValue() - keyPath: "' + keyPath + '" - value: ' + dataItem.value)

      let getRPC = dataItem.GET

//JUNK
//JUNK
//JUNK
//JUNK
if(getRPC.plugin == 'TODO_Plugin')
{
  // console.log('Skipping - plugin:  ' + getRPC.plugin + ' .... N/A')
  return null;
}
// if(getRPC.plugin == 'org.rdk.System' && getRPC.keyPath == 'currentFWVersion') // currentFWVersion, estb_mac, systemUptime
// {
//   console.log('Skipping - plugin:  ' + getRPC.plugin + ' .... keyPath: ' + getRPC.keyPath)
//   return null;
// }

//JUNK
//JUNK
//JUNK
//JUNK

      var ans = this.thunderUtils.callThunder(getRPC); // CALL THUNDER
      ans.then( (rawValue) =>
      {
        console.log('INFO:  getValue() - keyPath: ' + keyPath + '" - rawValue: "'+ JSON.stringify(rawValue) + '" ...' )

        if(rawValue != null && rawValue != undefined)
        {
          var value = JSONKeyPath.getValue(rawValue, getRPC.keyPath);

          if(value != null && rawValue != undefined)
          {
            // Value Formatter ?
            if(getRPC.formatter != undefined)
            {
              var fn = DataModel.getFn(getRPC.formatter);
              if(typeof fn != null)
              {
                value = fn(value);
              }
            }

            dataItem.value = value // UPDATE VALUE
            console.log('INFO:  getValue() - keyPath: ' + keyPath + '" - rawValue: "'+ JSON.stringify(rawValue) + '"  value: "' + value + '" ...' )

            var listeners = dataItem.listeners;

            // NOTIFY Listeners ... if any
            if(listeners.length > 0)
            {
              listeners.map( l => l.didChange(value) ) // NOTIFY
            }
          }
          else
          {
            console.log('INFO:  getValue() - keyPath: ' + keyPath + '"  value: "' + value + '" ... BAD BAD BAD' )
          }//ENDIF
        }
        else
        {
          console.log('INFO:  getValue() - keyPath: ' + keyPath + '" - rawValue: "'+ rawValue +  ' ... BAD BAD BAD' )
        }
      })
      .catch(e =>
      {
        console.log('EXCEPTION:  getValue() ... keyPath: ' + keyPath + '  e: ' + e)
      })

      return dataItem.value;
    }
    else
    {
      console.log('INFO:  getValue() -  keyPath: "' + keyPath + '" ... NO dataItem !!!')
    }

    return null;
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  setValue(keyPath, value)
  {
    if(this.thunderUtils == null || this.thunderUtils == undefined)
    {
      console.log('FATAL:  setValue() -  this.thunderUtils is NULL ...')
      return
    }

    console.log('INFO:  setValue() -  keyPath: "' + keyPath + '" - ENTER')

    var dataItem = this.dataStore[keyPath];

    if(dataItem != null && dataItem != undefined)
    {
      var setRPC = dataItem.SET

//JUNK
//JUNK
//JUNK
//JUNK
if(setRPC.plugin == 'TODO_Plugin')
{
  console.log('Skipping - plugin:  ' + setRPC.plugin + ' .... N/A')
  return null;
}
//JUNK
//JUNK
//JUNK
//JUNK
      var params = {}

      if(setRPC.params == null)
      {
        //console.log('INFO:  setValue() - CREATE params');

        params[setRPC.keyPath] = value
        setRPC.params = params
      }
      else
      {
        //console.log('INFO:  setValue() - USE params');

        setRPC.params[setRPC.keyPath] = value
      }

      console.log('INFO:  setValue() -  params: "' + JSON.stringify(params)  + '" - value: ' + value)

      var ans = this.thunderUtils.callThunder(setRPC); // CALL THUNDER
      ans.then( (rawValue) =>
      {
        if(rawValue.success == true )
        {
          console.log('INFO:  setValue() ... SUCCESS !! ...  keyPath: "' + keyPath + '" - value: ' + value + '   rawValue.success: ' + rawValue.success)

          dataItem.value = value; // new value

          var listeners = dataItem.listeners;

          // NOTIFY Listeners ... if any
          if(listeners.length > 0)
          {
            listeners.map( l => l.didChange(value) ) // NOTIFY
          }

          // PRESETS
          if(value.Presets != undefined)
          {
            console.log('INFO:  setValue() -  value.RpcRoot: "' + value.RpcRoot + '" - has PRESETS')
            value.Presets.map( p =>
            {
              let kp = value.RpcRoot + '.' + p.Key;

              console.log('INFO:  setValue() -  PRESET: "' + kp + '" = ' + p.Value)

              gDataModel.setValue(kp, p.Value);
            } ) // NOTIFY
          }
        }
        else
        {
          console.log('INFO:  setValue() ... FAILED !! ...  keyPath: "' + keyPath + '" - value: ' + value + '   rawValue.success: ' + rawValue.success)
        }
      })
      .catch(e =>
      {
        console.log('EXCEPTION:  setValue() ... keyPath: ' + keyPath + '  e: ' + e)
      })
    }
    else
    {
      console.log('INFO:  setValue() -  keyPath: "' + keyPath + '" ... NO dataItem !!!')
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

}//CLASS

export var gDataModel = new DataModel();

