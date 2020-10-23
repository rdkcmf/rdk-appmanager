#!/bin/sh
retry_count=1
hasNetwork=0
LOGFILE=/opt/logs/residentapp.log
curl -X POST -H "Content-Type: application/json" 'http://127.0.0.1:9998/jsonrpc' -d '{"jsonrpc": "2.0","id": 4,"method": "Controller.1.deactivate", "params": { "callsign": "Cobalt" }}' >>$LOGFILE
curl -X POST -H "Content-Type: application/json" 'http://127.0.0.1:9998/jsonrpc' -d '{"jsonrpc": "2.0","id": 4,"method": "Controller.1.deactivate", "params": { "callsign": "ResidentApp" }}' >>$LOGFILE
curl -X POST -H "Content-Type: application/json" 'http://127.0.0.1:9998/jsonrpc' -d '{"jsonrpc": "2.0","id": 4,"method": "Controller.1.deactivate", "params": { "callsign": "HtmlApp" }}' >>$LOGFILE
curl -X POST -H "Content-Type: application/json" 'http://127.0.0.1:9998/jsonrpc' -d '{"jsonrpc": "2.0","id": 4,"method": "Controller.1.deactivate", "params": { "callsign": "LightningApp" }}' >>$LOGFILE
curl -X POST -H "Content-Type: application/json" 'http://127.0.0.1:9998/jsonrpc' -d '{"jsonrpc": "2.0","id": 4,"method": "Controller.1.deactivate", "params": { "callsign": "SearchAndDiscoveryApp" }}' >>$LOGFILE

echo "Dectivating existing apps ... done " >>$LOGFILE
if [ $# -gt 0 ]; then
   if [[ $1 == "stop" ]]; then
      echo "Stop called. Exiting gracefully"  >>$LOGFILE
      exit 0
   fi
fi


partnerApps=`cat /usb/partnerapps/appmanagerregistry.conf|sed -e 's/[\r\n]//g'`
echo "connectivity check."$partnerApps
if [ -f /opt/appmanagerregistry.conf ]; then
  partnerApps=`cat /opt/appmanagerregistry.conf|sed -e 's/[\r\n]//g'`
fi
partnerApps=$(echo $partnerApps | sed -e 's/%/%25/g' -e 's/ /%20/g' -e 's/!/%21/g' -e 's/"/%22/g' -e 's/#/%23/g' -e 's/\$/%24/g' -e 's/\&/%26/g' -e 's/'\''/%27/g' -e 's/(/%28/g' -e 's/)/%29/g' -e 's/\*/%2a/g' -e 's/+/%2b/g' -e 's/,/%2c/g' -e 's/-/%2d/g' -e 's/\./%2e/g' -e 's/\//%2f/g' -e 's/:/%3a/g' -e 's/;/%3b/g' -e 's//%3e/g' -e 's/?/%3f/g' -e 's/@/%40/g' -e 's/\[/%5b/g' -e 's/\\/%5c/g' -e 's/\]/%5d/g' -e 's/\^/%5e/g' -e 's/_/%5f/g' -e 's/`/%60/g' -e 's/{/%7b/g' -e 's/|/%7c/g' -e 's/}/%7d/g' -e 's/~/%7e/g')

while (( $retry_count <= 20 ))
do
        echo "connectivity check."
        curl -X POST -H "Content-Type: application/json" 'http://127.0.0.1:9998/jsonrpc' -d '{"jsonrpc": "2.0","id": 4,"method": "Controller.1.activate", "params": { "callsign": "org.rdk.System" }}'
        response=$(curl -X POST -H "Content-Type: application/json" 'http://127.0.0.1:9998/jsonrpc' -d '{"jsonrpc": "2.0","id": 4,"method": "org.rdk.System.1.getDeviceInfo", "params":{"params":["estb_ip"]}}')
        echo $response
        echo $response | grep -F -q '"estb_ip"'
        if [ $? -eq 0 ]; then
      echo "The network is up" >>$LOGFILE 2>&1
          retry_count=20
          hasNetwork=1
    else
          sleep 1
      echo "The network is down" >>$LOGFILE 2>&1
          hasNetwork=0
    fi
        retry_count=$(( retry_count+1 ))
done
residentApp="https://rdkwiki.com/rdk-apps/FireboltUI/index.html"
offlineApp="http://127.0.0.1:50050/fireboltui/index.html"

if [[ $hasNetwork -eq 1 ]] ; then
        if [ -f /opt/startupApp.conf ]; then
              startupapp=`cat /opt/startupApp.conf`
              echo "startupapp "$startupapp >>$LOGFILE
              sleep 2
              curl -X POST -H "Content-Type: application/json" 'http://127.0.0.1:9998/jsonrpc' -d '{"jsonrpc": "2.0","id": 4,"method": "Controller.1.activate", "params": { "callsign": "ResidentApp" }}' >>$LOGFILE 2>&1
              sleep 2
              curl -X POST -H "Content-Type: application/json" 'http://127.0.0.1:9998/jsonrpc' -d '{"jsonrpc": "2.0","id": 4,"method": "ResidentApp.1.state", "params": "resumed"}' >>$LOGFILE 2>&1
              sleep 2
              curl -X POST -H "Content-Type: application/json" 'http://127.0.0.1:9998/jsonrpc' -d '{"jsonrpc": "2.0","id": 4,"method": "ResidentApp.1.url", "params": '"$startupapp"'}' >>$LOGFILE 2>&1
              curl -X POST -H "Content-Type: application/json" 'http://127.0.0.1:9998/jsonrpc' -d '{"jsonrpc":"2.0","id":"3","method": "org.rdk.RDKShell.1.setFocus", "params": {"client": "ResidentApp"}}'
        else 
              echo " Starting resident app" >>$LOGFILE
              curl -X POST -H "Content-Type: application/json" 'http://127.0.0.1:9998/jsonrpc' -d '{"jsonrpc": "2.0","id": 4,"method": "Controller.1.activate", "params": { "callsign": "org.rdk.RDKShell" }}' >>$LOGFILE
              sleep 2
              curl -X POST -H "Content-Type: application/json" 'http://127.0.0.1:9998/jsonrpc' -d '{"jsonrpc": "2.0","id": 4,"method": "Controller.1.activate", "params": { "callsign": "ResidentApp" }}' >>$LOGFILE 2>&1
              sleep 2
              curl -X POST -H "Content-Type: application/json" 'http://127.0.0.1:9998/jsonrpc' -d '{"jsonrpc": "2.0","id": 4,"method": "ResidentApp.1.state", "params": "resumed"}' >>$LOGFILE 2>&1
              sleep 2
              curl -X POST -H "Content-Type: application/json" 'http://127.0.0.1:9998/jsonrpc' -d '{"jsonrpc": "2.0","id": 4,"method": "ResidentApp.1.url", "params": '"$residentApp?data=$partnerApps"'}' >>$LOGFILE 2>&1
              curl -X POST -H "Content-Type: application/json" 'http://127.0.0.1:9998/jsonrpc' -d '{"jsonrpc":"2.0","id":"3","method": "org.rdk.RDKShell.1.setFocus", "params": {"client": "ResidentApp"}}'  
        fi
else
        sleep 2
        curl -X POST -H "Content-Type: application/json" 'http://127.0.0.1:9998/jsonrpc' -d '{"jsonrpc": "2.0","id": 4,"method": "Controller.1.activate", "params": { "callsign": "ResidentApp" }}'  >>$LOGFILE 2>&1
        sleep 2
        curl -X POST -H "Content-Type: application/json" 'http://127.0.0.1:9998/jsonrpc' -d '{"jsonrpc": "2.0","id": 4,"method": "ResidentApp.1.state", "params": "resumed"}'  >>$LOGFILE 2>&1
        curl -X POST -H "Content-Type: application/json" 'http://127.0.0.1:9998/jsonrpc' -d '{"jsonrpc":"2.0","id":"3","method": "org.rdk.RDKShell.1.setVisibility", "params": {"client": "ResidentApp", "visible": false}}'
        curl -X POST -H "Content-Type: application/json" 'http://127.0.0.1:9998/jsonrpc' -d '{"jsonrpc": "2.0","id": 4,"method": "ResidentApp.1.url", "params": '"$offlineApp?data=$partnerApps"'}'  >>$LOGFILE 2>&1
        sleep 2
        curl -X POST -H "Content-Type: application/json" 'http://127.0.0.1:9998/jsonrpc' -d '{"jsonrpc": "2.0","id": 4,"method": "Controller.1.activate", "params": { "callsign": "SearchAndDiscoveryApp" }}'  >>$LOGFILE 2>&1
        sleep 2
        curl -X POST -H "Content-Type: application/json" 'http://127.0.0.1:9998/jsonrpc' -d '{"jsonrpc": "2.0","id": 4,"method": "SearchAndDiscoveryApp.1.state", "params": "resumed"}'  >>$LOGFILE 2>&1
        sleep 2
        curl -X POST -H "Content-Type: application/json" 'http://127.0.0.1:9998/jsonrpc' -d '{"jsonrpc": "2.0","id": 4,"method": "SearchAndDiscoveryApp.1.url", "params": "http://127.0.0.1:50050/lxdiag/index.html"}'  >>$LOGFILE 2>&1
        curl -X POST -H "Content-Type: application/json" 'http://127.0.0.1:9998/jsonrpc' -d '{"jsonrpc":"2.0","id":"3","method": "org.rdk.RDKShell.1.setFocus", "params": {"client": "SearchAndDiscoveryApp"}}'
        curl -X POST -H "Content-Type: application/json" 'http://127.0.0.1:9998/jsonrpc' -d '{"jsonrpc":"2.0","id":"3","method": "org.rdk.RDKShell.1.moveToFront", "params": {"client": "SearchAndDiscoveryApp"}}'
        sleep 2
        curl -X POST -H "Content-Type: application/json" 'http://127.0.0.1:9998/jsonrpc' -d '{"jsonrpc":"2.0","id":"3","method": "org.rdk.RDKShell.1.setVisibility", "params": {"client": "ResidentApp", "visible": true}}'
fi
