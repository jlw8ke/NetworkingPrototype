var fs = require('fs');
var wd = require('wd');
var pollTime = 500;
var maxWaitTime = 120000;
var asserters = wd.asserters;

var eventHelpers = function(theBrowser) {
    browser = theBrowser;
}

writeScreenshot = function(data, name) {
    name = name || 'ss.png';
    var screenshotPath = 'screenshots/';
    fs.writeFileSync(screenshotPath + name, data, 'base64');
};

eventHelpers.prototype.screenshot = function(elementName, screenshotName) {
    return browser
        .waitForElementByXPath(elementName, asserters.isDisplayed, maxWaitTime, pollTime)
        .takeScreenshot()
        .then(function (data) {
            writeScreenshot(data, screenshotName);
        })
};

eventHelpers.prototype.clickElementA = function(elementName) {
    return browser.waitForElementByAndroidUIAutomator(elementName, asserters.isDisplayed, maxWaitTime, pollTime)
        .click();
};

//
//eventHelpers.prototype.clickElementByName = function(elementName) {
//    return browser.waitForElementByName(elementName, asserters.isDisplayed, maxWaitTime, pollTime)
//        .click();
//};

eventHelpers.prototype.findElementA = function(elementName) {
    return browser.waitForElementByAndroidUIAutomator(elementName, asserters.isDisplayed, maxWaitTime, pollTime)
};

eventHelpers.prototype.typeIntoA = function(elementName, text) {
    return browser.waitForElementByAndroidUIAutomator(elementName, asserters.isDisplayed, maxWaitTime, pollTime)
        .clear()
        .sendKeys(text);
};
//
//eventHelpers.prototype.clearElement= function(elementName, text) {
//    return browser.waitForElementByXPath(elementName, asserters.isDisplayed, maxWaitTime, pollTime)
//        .clear();
//};

eventHelpers.prototype.HandleErrors = function(didNotWorkCB, workedCB) {
    return function(err, other) {
        if(err) {
            console.log("A big blue whale has died!");
            didNotWorkCB(err);
        }
        else {
            console.log("A big blue whale has surfaced!");
            workedCB(null, other);
        }
    }
}

module.exports = eventHelpers;
