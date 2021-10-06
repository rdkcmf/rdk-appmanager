#!/bin/bash
retry_count=1
hasNetwork=0
LOGFILE=/opt/logs/residentapp.log

. /etc/device.properties

log()
{
    echo "$(date '+%Y %b %d %H:%M:%S.%6N') [#$$]: ${FUNCNAME[1]}: $*" >> $LOGFILE
}
srv_restart=0
if [ $# -gt 0 ]; then
   if [[ $1 == "stop" ]]; then
      curl -s -X POST -H "Content-Type: application/json"  'http://127.0.0.1:9998/jsonrpc' -d '{"jsonrpc": "2.0","id": 4,"method": "org.rdk.RDKShell.1.destroy", "params": {"callsign":"ResidentApp","type": "ResidentApp"}}' >>$LOGFILE 2>&1  
      log "Stop called. Exiting gracefully" 
      exit 0
   fi
fi

partnerApps=`cat /usb/partnerapps/appmanagerregistry.conf|sed -e 's/[\r\n]//g'`
log "connectivity check."$partnerApps
if [ -f /opt/appmanagerregistry.conf ]; then
  partnerApps=`cat /opt/appmanagerregistry.conf|sed -e 's/[\r\n]//g'`
fi
partnerApps=$(echo $partnerApps | sed -e 's/%/%25/g' -e 's/ /%20/g' -e 's/!/%21/g' -e 's/"/%22/g' -e 's/#/%23/g' -e 's/\$/%24/g' -e 's/\&/%26/g' -e 's/'\''/%27/g' -e 's/(/%28/g' -e 's/)/%29/g' -e 's/\*/%2a/g' -e 's/+/%2b/g' -e 's/,/%2c/g' -e 's/-/%2d/g' -e 's/\./%2e/g' -e 's/\//%2f/g' -e 's/:/%3a/g' -e 's/;/%3b/g' -e 's//%3e/g' -e 's/?/%3f/g' -e 's/@/%40/g' -e 's/\[/%5b/g' -e 's/\\/%5c/g' -e 's/\]/%5d/g' -e 's/\^/%5e/g' -e 's/_/%5f/g' -e 's/`/%60/g' -e 's/{/%7b/g' -e 's/|/%7c/g' -e 's/}/%7d/g' -e 's/~/%7e/g')


residentApp="https://apps.rdkcentral.com/rdk-apps/accelerator-home-ui/index.html#splash"
offlineApp="http://127.0.0.1:50050/lxresui/index.html#splash"

if [ -n "$COMMUNITY_BUILDS" ]; then
   log "Enabling RFC for setting WIFI interface when ethernet is connected .. Status"
   tr181 -s -t boolean -v true  Device.DeviceInfo.X_RDKCENTRAL-COM_RFC.Feature.PreferredNetworkInterface.Enable
   tr181  Device.DeviceInfo.X_RDKCENTRAL-COM_RFC.Feature.PreferredNetworkInterface.Enable >> $LOGFILE 2>&1
else
   touch /tmp/.xreSplashDrawn
fi

waitForServer()
{
      status="closed"
      host="127.0.0.1"
      port="9998"
       log "Checking for connectivity"
      while [ "$status" != "open" ] 
      do
      {
         status="$((echo >/dev/tcp/${host}/${port}) &>/dev/null && echo "open" || echo "closed")"
 	 if [ "$status" = "open" ] ; then
            log "connectivity check passed"
            break;
	 else
            log "connectivity check failed"
	    sleep 2
	 fi
      }
      done
}

waitForNetwork()
{
    status="closed"
    log "Checking for connectivity"
    while [ "$status" != "open" ]
    do
    {
	 status="$([  -f  /tmp/route_available ] && echo "open" ||echo "closed")"
         if [ "$status" = "open" ] ; then
            log "connectivity check passed"
            break;
         else
            log "connectivity check failed"
            sleep 2
         fi
    }
    done
}

if [ -n "$COMMUNITY_BUILDS" ]; then
	waitForServer
else
	waitForNetwork
fi

if [ -f /lib/rdk/insertPartnerId.sh ] ;then
      /lib/rdk/insertPartnerId.sh  
fi  


appurl=$offlineApp

if [ -f  /tmp/route_available ] ; then
  appurl=$residentApp
fi

log "Selected reference app is $appurl"
#System plugin needs to be activated for properly showing the time in UI
curl -X POST -H "Content-Type: application/json" 'http://127.0.0.1:9998/jsonrpc' -d '{"jsonrpc": "2.0","id": 4,"method": "Controller.1.activate", "params": { "callsign": "org.rdk.System" }}' ; echo
curl -X POST -H "Content-Type: application/json" 'http://127.0.0.1:9998/jsonrpc' -d '{"jsonrpc": "2.0","id": 4,"method": "Controller.1.activate", "params": { "callsign": "org.rdk.RDKShell" }}' ; echo
sleep 3
curl -s -X POST -H "Content-Type: application/json"  'http://127.0.0.1:9998/jsonrpc' -d '{"jsonrpc": "2.0","id": 4,"method": "org.rdk.RDKShell.1.launch", "params": {"callsign":"ResidentApp","type": "ResidentApp","uri":'"$appurl?data=$partnerApps"'}}' >>$LOGFILE 2>&1
curl -s -X POST -H "Content-Type: application/json"  'http://127.0.0.1:9998/jsonrpc' -d '{"jsonrpc":"2.0","id":"3","method": "org.rdk.RDKShell.1.setFocus", "params": {"client": "ResidentApp"}}'
curl -s -X POST -H "Content-Type: application/json"  'http://127.0.0.1:9998/jsonrpc' -d '{"jsonrpc":"2.0","id":"3","method": "org.rdk.RDKShell.1.setVisibility", "params": {"client": "ResidentApp", "visible": true}}'
