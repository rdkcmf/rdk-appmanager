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

setupContainerBundle()
{
	SRC_DIR=$1
	PLUGIN_NAME=$2
	USR=$3
	GRP=$4

	CONTAINER_BUNDLE_DIR=/opt/persistent/rdkservices/
	PLUGIN_DIR=${CONTAINER_BUNDLE_DIR}/${PLUGIN_NAME}
	DST_DIR=${PLUGIN_DIR}/Container

	if [ ! -f "${SRC_DIR}/config.json" ]; then
		echo "OCI bundle not present in firmware - ${SRC_DIR}/config.json not found" >> $LOGFILE
		return 1
	fi

	# Copy bundle only if different
	if [ -f ${DST_DIR}/config-dobby.json ]; then
		image_sum=$(md5sum ${SRC_DIR}/config.json | cut -d' ' -f1)
		opt_sum=$(md5sum ${DST_DIR}/config-dobby.json | cut -d' ' -f1)

		if [ "x$image_sum" != "x$opt_sum" ]; then
			echo "Copying OCI bundle from firmware as config.json doesn't match expected" >> $LOGFILE
			rm -rf ${DST_DIR:?}/*
			cp ${SRC_DIR}/config.json ${DST_DIR}
			cp -R ${SRC_DIR}/rootfs_dobby ${DST_DIR}
		else
			echo "Valid OCI bundle found, not recreating" >> $LOGFILE
		fi
	else
		echo "No OCI bundle found in opt, copying from firmware" >> $LOGFILE
		mkdir -p ${DST_DIR}
		rm -rf ${DST_DIR:?}/*
		cp ${SRC_DIR}/config.json ${DST_DIR}
		cp -R ${SRC_DIR}/rootfs_dobby ${DST_DIR}
	fi

	# Set permissions on the container bundle directory
	chmod +x ${CONTAINER_BUNDLE_DIR}

	chmod -R 744 "${PLUGIN_DIR}"
	chown -R ${USR}:${GRP} "${PLUGIN_DIR}"


	echo "setupContainerBundle() done" >> $LOGFILE
	return 0
}

setContainerPermissions()
{
	# Set generic container permissions
	# All containers should run in the dobbyapp group

	# Set permissions applicable to all containers
	chown -R root:dobbyapp /tmp/ocdm
	chown -R root:dobbyapp /tmp/OCDM
	chown -R root:dobbyapp /opt/drm
	chmod -R g+rwx /opt/drm

	chown root:dobbyapp /opt/persistent/rdkservices/
	chmod 770 /opt/persistent/rdkservices/

	chmod 775 /run/resource
}

enableNetflixContainer()
{
  FLASH_OCI_BUNDLE_DIR=/container/netflix

  if setupContainerBundle ${FLASH_OCI_BUNDLE_DIR} "Netflix" "netflix" "dobbyapp"; then
    # Set permissions as necessary for this container
    echo "Fixing permissions for Netflix container" >> $LOGFILE

    mkdir /run/Netflix/
    chown -R netflix:dobbyapp /run/Netflix

    mkdir -p /opt/netflix
    chown -R netflix:dobbyapp /opt/netflix
    chown -R netflix:dobbyapp /opt/drm/netflix
    chown netflix:dobbyapp /tmp/.deviceDetails*

    chown -R root:netflix /opt/logs/rfcscript.log
    chmod g+rw /opt/logs/rfcscript.log
  else
    echo "Failed to setup Netflix container" >> $LOGFILE
  fi
}


enableWebkitContainer()
{
	HTMLAPP_FIRMWARE_BUNDLE=/container/htmlapp
	LIGHTNINGAPP_FIRMWARE_BUNDLE=/container/lightningapp

	if setupContainerBundle ${HTMLAPP_FIRMWARE_BUNDLE} "HtmlApp" "htmlapp" "dobbyapp"; then
		# Set permissions as necessary for this container
		echo "Fixing permissions for HtmlApp container" >> $LOGFILE

		# Set htmlapp-specific permissions
		mkdir /run/HtmlApp/
		chown -R htmlapp:dobbyapp /run/HtmlApp
	else
		echo "Failed to setup HtmlApp container" >> $LOGFILE
	fi
	if setupContainerBundle ${LIGHTNINGAPP_FIRMWARE_BUNDLE} "LightningApp" "lightningapp" "dobbyapp"; then
		# Set permissions as necessary for this container
		echo " Fixing permissions for LightningApp container" >> $LOGFILE

		# Set lightningapp-specific permissions
		mkdir /run/LightningApp/
		chown -R lightningapp:dobbyapp /run/LightningApp
	else
		echo " Failed to setup LightningApp container" >> $LOGFILE
	fi

}

# Netflix container mode
netflixContainerEnabled=`tr181 Device.DeviceInfo.X_RDKCENTRAL-COM_RFC.Feature.Dobby.Netflix.Enable 2>&1 > /dev/null`
if [ -n "${netflixContainerEnabled}" ] && [ "${netflixContainerEnabled}" = "true" ]; then
  setContainerPermissions
  enableNetflixContainer
else
  echo "Netflix not running in container mode" >> $LOGFILE
fi


# WPE Container mode
wpeContainerEnabled=`tr181 Device.DeviceInfo.X_RDKCENTRAL-COM_RFC.Feature.Dobby.WPE.Enable 2>&1 > /dev/null`
if [ -n "${wpeContainerEnabled}" ] && [ "${wpeContainerEnabled}" = "true" ]; then
	setContainerPermissions
	enableWebkitContainer
else
	echo "WPE not running in container mode" >> $LOGFILE
fi


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
THUNDERSECURITY=`tr181 Device.DeviceInfo.X_RDKCENTRAL-COM_RFC.Feature.ThunderSecurity.Enable 2>&1`
log "Selected reference app is $appurl"
log "Is THUNDERSECURITY enabled ?= '$THUNDERSECURITY'"
TOKEN=`WPEFrameworkSecurityUtility | sed -r 's/[{:",}]/ /g' | awk '{print $2}'`

#System plugin needs to be activated for properly showing the time in UI
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" 'http://127.0.0.1:9998/jsonrpc' -d '{"jsonrpc": "2.0","id": 4,"method": "Controller.1.activate", "params": { "callsign": "org.rdk.System" }}' ; echo
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" 'http://127.0.0.1:9998/jsonrpc' -d '{"jsonrpc": "2.0","id": 4,"method": "Controller.1.activate", "params": { "callsign": "org.rdk.RDKShell" }}' ; echo
sleep 3
curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" 'http://127.0.0.1:9998/jsonrpc' -d '{"jsonrpc": "2.0","id": 4,"method": "org.rdk.RDKShell.1.launch", "params": {"callsign":"ResidentApp","type": "ResidentApp","visible": true,"focus": true,"uri":'"$appurl?data=$partnerApps"'}}' >>$LOGFILE 2>&1

