#!/bin/sh
##########################################################################
# If not stated otherwise in this file or this component's Licenses.txt
# file the following copyright and licenses apply:
#
# Copyright 2018 RDK Management
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
##########################################################################

. /etc/device.properties

startupFile="file:///home/root/startup.js"

if [ -f /home/root/startup_partnerapp.js ]; then
    startupFile="file:///home/root/startup_partnerapp.js"
fi

echo "The startup file is: $startupFile"

export SPARK_TEXTURE_LIMIT_IN_MB=130
export XDG_RUNTIME_DIR=/tmp
export PLAYERSINKBIN_USE_WESTEROSSINK=1
export NODE_PATH=/home/root
#export WAYLAND_DISPLAY=main0

if [ -z "$HOME" ]
then
   export HOME=/home/root
fi

killall -9 westeros

#if [ "$BOX_TYPE" != "pi" ]; then
export PXCORE_FRAMERATE=60
#fi

partnerAppArguments=""
ethIP=""
getIPAddress()
{
    ethIP=`ifconfig eth0 | grep "inet addr" | cut -d ':' -f 2 | cut -d ' ' -f 1`
}

cleanupProcess()
{
     echo "Cleanup Process"
     wayland_applications=`grep "binary" $WAYLAND_APPS_CONFIG | cut -d ":" -f2 | tr -d ' "' | rev | cut -d "/" -f1 | rev`
     for application in ${wayland_applications[@]}
     do
        echo "killing $application"
        killall $application
     done

# TODO Add check to kill only native applications
     rne_applications=`grep "uri" $PXSCENE_APPS_CONFIG | rev | cut -d "\"" -f2 | cut -d "/" -f1 | rev`
     for application in ${rne_applications[@]}
     do
        echo "killing $application"
        killall $application
     done
}


#if [ -f /lib/rdk/runWesteros.soc.sh ]; then
#  /lib/rdk/runWesteros.soc.sh &
#else
#  /lib/rdk/runWesteros.sh & 
#fi

export ENABLE_XRE_WAYLAND=1

cd /home/root

export WAYLAND_APPS_CONFIG=/home/root/waylandregistryreceiver.conf
export PXSCENE_APPS_CONFIG=/usb/partnerapps/appmanagerregistry.conf
export WAYLAND_EGL_PRELOAD=/usr/lib/libwayland-client.so.0:/usr/lib/libwayland-egl.so:/usr/lib/libopenmaxil.so
export LD_PRELOAD=$WAYLAND_EGL_PRELOAD
export SPARK_TEXTURE_LIMIT_IN_MB=100

touch /tmp/.xreSplashDrawn

touch /opt/remote_input_enable
sync

if [ -f /home/root/waylandregistryrne.conf ]; then
  export WAYLAND_APPS_CONFIG=/home/root/waylandregistryrne.conf
fi

if [ -f /opt/waylandregistry.conf ]; then
  export WAYLAND_APPS_CONFIG=/opt/waylandregistry.conf
fi

if [ -f /opt/appmanagerregistry.conf ]; then
  export PXSCENE_APPS_CONFIG=/opt/appmanagerregistry.conf
fi

if [ -f /opt/sparkpermissions.conf -a "$BUILD_TYPE" != "prod" ]; then
    export PXSCENE_PERMISSIONS_CONFIG=/opt/sparkpermissions.conf
elif [ -f /etc/sparkpermissions.conf ]; then
    export PXSCENE_PERMISSIONS_CONFIG=/etc/sparkpermissions.conf
elif [ -f /home/root/sparkpermissions.conf ]; then
    export PXSCENE_PERMISSIONS_CONFIG=/home/root/sparkpermissions.conf
fi
if [ -f /opt/.sparkEnableCORS -a "$BUILD_TYPE" != "prod" ]; then
    export USE_ACCESS_CONTROL_CHECK=1
fi

if [ "$BOX_TYPE" = "pi" ]; then
    for try in {1..10} ; do
        getIPAddress
        [[ $ethIP ]] && break
        sleep 1
    done  
    partnerAppArguments="%3FethIP%3D$ethIP"
fi


while :
do
  if [ -f /opt/appmanager_start.js ]; then
    ./pxscene file:///home/root/appmanager.js?baseApp=file:///opt/appmanager_start.js
  else
    if [ -f appmanager_partnerapp.js ]; then
      ./pxscene file%3A%2F%2F%2Fhome%2Froot%2Fappmanager.js%3FhandleMenuKey%3Dtrue%26baseApp%3Dfile%3A%2F%2F%2Fhome%2Froot%2Fappmanager_partnerapp.js$partnerAppArguments
    else
      if [ -f /lib/rdk/appmanager.soc ]; then
        . /lib/rdk/appmanager.soc
      fi
      ./pxscene $startupFile$partnerAppArguments
    fi
  fi
  echo "pxscene exited"
  cleanupProcess
  sleep 1 
done

