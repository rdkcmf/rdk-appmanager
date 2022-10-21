# 
#   If not stated otherwise in this file or this component's LICENSE
#   file the following copyright and licenses apply:
#  
#   Copyright 2022 RDK Management
#  
#   Licensed under the Apache License, Version 2.0 (the "License");
#   you may not use this file except in compliance with the License.
#   You may obtain a copy of the License at
#  
#   http://www.apache.org/licenses/LICENSE-2.0
#  
#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and
#   limitations under the License.
# 


MACHINENAME=$1
FILE_PATH=$2
VBoxManage createvm --name $MACHINENAME --ostype Linux --register
#Set memory and network
VBoxManage modifyvm $MACHINENAME --cpus 4 --memory 2048 --vram 128 --cpuexecutioncap 100 --graphicscontroller vmsvga --ioapic on --rtcuseutc on --usbohci on
VBoxManage modifyvm $MACHINENAME --nic1 bridged --bridgeadapter1 'Intel(R) Wireless-AC 9462'
VBoxManage storagectl $MACHINENAME --name "IDE" --add ide --controller PIIX4


VBoxManage storageattach $MACHINENAME --storagectl "IDE" --port 0 --device 0 --type hdd --medium $FILE_PATH




#Start the VM
VBoxManage startvm $MACHINENAME
