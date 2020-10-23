import ThunderJS  from 'ThunderJS'
import Events     from './components/Events.js'

const default_cfg =
{
  host: '127.0.0.1',
  port: 9998, //9999
  debug: false, // VERY USEFUL
  versions: {
    default: 1, // use version 5 if plugin not specified
    Controller: 1,
    Packager: 1,
    // etc ..
  }
}

export default class ThunderUtils
{
  // Properties
  get thunderJS() { return this.thunderJS_ };
  // set thunderJS() { return this.thunderJS_ };

  constructor()
  {
    const URL_PARAMS = new window.URLSearchParams(window.location.search)

    var cfgURL = URL_PARAMS.get('thunderCfg')

    this.thunderJS_ = null;
    this.myEvents_  = null;

    this.fetchThunderCfg(cfgURL);
  }

  fetchThunderCfg(url)
  {
    // Fetch Thunder Cfg
    //
    fetch(url)
    .then( res => res.json())
    .then((cfg) =>
    {
      console.log(' >>> Creating CUSTOM ThunderJS ...')
      this.thunderJS_ = ThunderJS(cfg);
      this.myEvents_  = new Events(this.thunderJS_);
    })
    .catch(err =>
    {
      // console.log("Failed to get ThunderJS URL: " + url);

      console.log(' >>> Creating DEFAULT ThunderJS ...')
      this.thunderJS_ = ThunderJS(default_cfg);
      this.myEvents_  = new Events(this.thunderJS_);
    });
  }

  async activatePlugin( pp )
  {
    var ans = null
    if(pp          == undefined || pp          == null ||
       pp.callsign == undefined || pp.callsign == null)
    {
      console.log( 'activatePlugin() >>> BAD ARGS' );
      return ans;
    }

    ans = await this.thunderJS_.call("Controller", "activate", { "callsign": pp.callsign } );

    return ans
  }

  async callThunder(rpc)
  {
    var ans = null
    if(rpc == null || rpc == undefined)
    {
      console.log( 'callThunder() >>> BAD ARGS' );
      return ans;
    }

    try
    {
      ans = await this.thunderJS_.call(rpc.plugin, rpc.method, rpc.params);
    }
    catch(e)
    {
      console.log( "callThunder() >>> CAUGHT:  plugin: '" + rpc.plugin + "'  method: '" + rpc.method + "'  params: >" + JSON.stringify(rpc.params) + "<    e: " + JSON.stringify(e) );
    }

    return ans
  }


  async callThunderNoCatch(rpc)
  {
    var ans = null
    if(rpc == null || rpc == undefined)
    {
      console.log( 'callThunder() >>> BAD ARGS' );
      return ans;
    }

    ans = await this.thunderJS_.call(rpc.plugin, rpc.method, rpc.params);

    return ans
  }


  async call(plugin,method, params)
  {
    var ans = null
    if( (plugin == null      || method == null      || params == null)   &&
        (plugin == undefined || method == undefined || method == undefined) )
    {
      console.log( 'call() >>> BAD ARGS' );
      return ans;
    }

    ans = await this.thunderJS_.call(plugin, method, params);

    return ans
  }

  registerEvent(pkg, event, handler )
  {
    if(this.myEvents_)
    {
      this.myEvents_.add( pkg, event, handler );
    }
  }

}//CLASS
