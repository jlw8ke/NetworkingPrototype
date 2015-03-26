var bs = require('../bootstrap.js');
var browser = bs.browser;
var eventHelpers = require('../modules/eventHelpers.js');
var eh = new eventHelpers(browser);
var wd = require('wd');
var asserters = wd.asserters;
var waitTime = 5000;
var pollTime = 500;
var maxWaitTime = 12000;


// Page Elements Here
var pobjects = {
    //signInUiAutomator: "com.cvshealth.specialtyrx:id/startHere",
    signInUiAutomator: 'new UiSelector().resourceId("com.cvshealth.specialtyrx:id/startHere")',
    newReminderName: 'new UiSelector().resourceId("com.cvshealth.specialtyrx:id/new_reminder")'
};

var Home = function(theBrowser) {
    browser = theBrowser;
};

Home.prototype.clickNewReminder = function() {
    return eh.clickElementA(pobjects.newReminderName);
}

Home.prototype.clickLogin = function() {
    return eh.clickElementA(pobjects.signInUiAutomator);
}

module.exports = Home;
