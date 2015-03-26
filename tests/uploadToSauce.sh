key="75b72184-3f8d-45d5-ae04-8d79d2b06ccb"
newapkname=${PWD##*/}

echo "About to upload $1 to be named $newapkname.apk"

echo "Command: curl -u mobiquity:$key -X POST 'http://saucelabs.com/rest/v1/storage/mobiquity/$1?overwrite=true'     -H 'Content-Type: application/octet-stream' --data-binary @$1"

curl -u mobiquity:"75b72184-3f8d-45d5-ae04-8d79d2b06ccb" -X POST "http://saucelabs.com/rest/v1/storage/mobiquity/$newapkname.apk?overwrite=true" -H "Content-Type: application/octet-stream" --data-binary @$1

echo "\n\nTo verify the app got uploaded to sauce, go to http://saucelabs.com/rest/v1/storage/mobiquity SAUCE_USERNAME=mobiquity SAUCE_ACCESS_KEY=75b72184-3f8d-45d5-ae04-8d79d2b06ccb\n\n"
exit 0
