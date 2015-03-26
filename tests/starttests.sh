#!/bin/sh
#
# No arguments: error
# Settings get written to cmdLineSettings file - these will override testenvironment.json settings
#

if [ $# -eq 0 ]
then
echo "$0 : 
# No arguments: error
# Todo - add final list of settings for our lovely user here"
exit 1
fi

overrideFile="cmdLineSettings.json"
onSauceVal="false"
platformName=
platformVersion=
deviceName=
deviceType=
logLevel= 

mochaArgs=()

while [ $# -gt 0 ]
do
  case $1 in
    -s | --onsauce  ) 
        onSauceVal=$2
        echo "on sauce set to : $onSauceVal"
        shift; shift;; 
    -p | --platformName )
        platformName=$2
        echo "On Sauce set to : $platformName"
        shift; shift;;
    -d | --deviceName ) 
        deviceName=$2
        echo "Device Name set to : $deviceName"
        shift; shift;;
    -t | --deviceType ) 
        deviceType=$2
        echo "Device Type set to : $deviceType"
        shift; shift;;
    -v | --platformVersion )
        platformVersion=$2
        echo "Platform Version set to : $platformVersion"
        shift; shift;;
    -l | --loglevel ) 
        logLevel=$2
        echo "Log level set to : $logLevel"
        shift; shift;;
    *)
        echo "new mocha arg: $1"
        mochaArgs[${#mochaArgs[@]}]="$1"
        shift;;
  esac
done

echo "{" > "$overrideFile"

echo "\"overridesettings\": \"true\"," >> "$overrideFile"

if [ "$onSauceVal" == "true" ]
then
    echo "Going to run on sauce!"
    echo "\"onsauce\": \"$onSauceVal\"," >> "$overrideFile"
else 
    echo "Going to run locally!"
    echo "\"onsauce\": \"$onSauceVal\"," >> "$overrideFile"
fi

if [ "$logLevel" != "" ]
then
    echo "newLogLevel: $logLevel,"
    echo "\"loglevelmin\": $logLevel," >> "$overrideFile"
fi

sed -i '' '$s/.$//' "$overrideFile"

echo "}" >> "$overrideFile"

if [ "$logLevel" > "0" ]
then
    echo "Running: ./node_modules/.bin/mocha $mochaArgs"
    ./node_modules/.bin/mocha "$mochaArgs"
else
    echo "Running: ./node_modules/.bin/mocha --recursive -R xunit scripts/ > test-reports.xml"
    ./node_modules/.bin/mocha --recursive -R xunit scripts/ > test-reports.xml
fi

exit 0

