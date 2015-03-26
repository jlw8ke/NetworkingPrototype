require("colors");
var fs = require('fs');
var wd = require('wd');
var chai = require("chai");

var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();
chaiAsPromised.transferPromiseness = wd.transferPromiseness;
//exports.browser = wd.promiseChainRemote("0.0.0.0", 4723);

var Settings = require('./testenvironment');
var Helpers = require('./modules/eventHelpers');

/////// Handle various ways from initiating the tests - override settings are a one-off to run the tests however
if (fs.existsSync('./cmdLineSettings')) {
    var OverrideSettings = require('./cmdLineSettings');
    for (var key in Settings) {
        if (OverrideSettings.hasOwnProperty(key)) {
            Settings.key = OverrideSettings.key;
            console.log("Overwriting key: " + Settings[key] + " with value from script: " + OverrideSettings[key])
        }
    }
    // Delete OverrideSettings file!
    DeleteFile("cmdLineSettings.json");
}
/////////////////////

exports.log = require('custom-logger').config({ level: Settings.loglevelmin });
exports.log.info().config({ color: 'green', format: '%event% - %message%' });

console.log("ON SAUCE: " + Settings.onsauce);
if(Settings.onsauce) {
    exports.log.info("Running on sauce");
    exports.browser = wd.promiseChainRemote(Settings.sauce.host, Settings.sauce.port, Settings.sauce.username, Settings.sauce.accesskey);

    // Must be done prior to this running - or done via sauce connect
    //curl -u mobiquity:75b72184-3f8d-45d5-ae04-8d79d2b06ccb -X POST "http://saucelabs.com/rest/v1/storage/mobiquity/cvs.apk?overwrite=true" -H "Content-Type: application/octet-stream" --data-binary "@/Users/ecarmichael/Desktop/cvs.apk"
    var parentFolder = __dirname.substring(0, __dirname.lastIndexOf('/'));
    var SauceApk = parentFolder.substring(parentFolder.lastIndexOf('/') + 1) + ".apk";
    console.log("project apk is: " + SauceApk);
    
    exports.desired = {
        name:Settings.sauce.name,
        browserName:Settings.local.browserName,
        platformName:Settings.local.platformName,
        platformVersion:Settings.local.platformVersion,
        deviceName:Settings.local.deviceName,
        deviceType:Settings.sauce.deviceType,
        app:Settings.sauce.path + SauceApk
    };
    exports.desired["appium-version"] = "1.3.3";
    //exports.desired["device-orientation"] = 'portrait';

    Settings.path = Settings.sauce.path;
}
else {
    exports.log.info("Running locally");
    exports.browser = wd.promiseChainRemote(Settings.local.host, Settings.local.port);

    exports.desired = {
        browserName:Settings.local.browserName,
        platformName:Settings.local.platformName,
        platformVersion:Settings.local.platformVersion,
        deviceName:Settings.local.deviceName,
        app:Settings.local.app
    };
    exports.desired["appium-version"] = "1.3.3";
    exports.desired["device-orientation"] = 'portrait';

    Settings.path = Settings.local.path;
}

exports.desired["autoAcceptAlerts"] = Settings.autoAcceptAlerts;

exports.helpers = new Helpers(exports.browser);

exports.writeToFile = function(content) {
    fs.appendFile(Settings.resultsFile, content + "\n\n", function(err) {
        if(err) {
            exports.log.warn(err);
        } else {
            exports.log.info("The test link file was saved!");
        }
    });
};

function DeleteFile(filename) {
    fs.unlink(filename, function(err) {
        if(err) {
            exports.log.warn("Error trying to remove file: " + filename + " - " + err);
        } else {
            exports.log.info("File " + filename + " removed!");
        }
    });
}

DeleteFile(Settings.resultsFile);

exports.settings = Settings;
exports.writeToFile("Sauce Test Results");

exports.beforeCode = function (desired, scriptName, CB) {
    desired.name = scriptName;
    exports.log.info("About to init");
    browser.init(desired)
        .then(function (adb) {
            browser.getSessionId().then(function (sid) {
                process.env["SauceOnDemandSessionID"] = sid;
                process.env["job-name"] = desired.name;

                //console.log("SauceOnDemandSessionID=" + sid + "job-name=" + scriptName); TODO://FOR EMBEDDED ON DEMAND RESULTS!

                var sessionid = sid;
                var sessionurl = "https://saucelabs.com/tests/" + sid;

                exports.writeToFile(desired.name + " - " + sessionurl);
                CB();
            });
        });
};
