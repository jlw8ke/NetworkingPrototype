var bs = require('../bootstrap.js');
var browser = bs.browser;
var eventHelpers = require('../modules/eventHelpers.js');
var eh = new eventHelpers(browser);
var wd = require('wd');
var waitTime = 5000;
var pollTime = 500;
var maxWaitTime = 10000;
var asserters = wd.asserters;

// Page Elements Here
var pobjects = {
    emailUIAutomator:'new UiSelector().resourceId("com.cvshealth.specialtyrx:id/login_email")',
    passwordUIAutomator:'new UiSelector().resourceId("com.cvshealth.specialtyrx:id/login_password")',
    usernameErrorTextUIAutomator: 'new UiSelector().resourceId("com.cvshealth.specialtyrx:id/login_password")', // Text should be cleared after an invalid input
    signInUIAutomator:'new UiSelector().resourceId("com.cvshealth.specialtyrx:id/email_sign_in_button")'
};

var Login = function(theBrowser) {
    browser = theBrowser;
};

Login.prototype.typeEmail = function(text) {
    return eh.typeIntoA(pobjects.emailUIAutomator, text);
}

Login.prototype.typePassword = function(text) {
    return eh.typeIntoA(pobjects.passwordUIAutomator, text);
}

Login.prototype.clickSignIn = function() {
    return eh.clickElementA(pobjects.signInUIAutomator);
}

//
//Login.prototype.isLoginButtonPresent = function(done) {
//    return browser.hasElementByName(pobjects.signIn);
//}
//

Login.prototype.wasLoginInvalid = function() {
    //return eh.findElementA(pobjects.passwordUIAutomator).getAttribute("text")
    return browser.waitForElementByAndroidUIAutomator(pobjects.passwordUIAutomator, !asserters.nonEmptyText, maxWaitTime, pollTime, function(err) {
        log.warn("Was able to find empty login box after maxwaittime? : " + err)
        var promise = new Promise;
        if(err) {
            // It was valid!
            promise.resolve(false);
        }
        else {
            // It was an invalid login attempt!
            promise.resolve(true);
        }
        return promise;
    })
}

//Login.prototype.getUserErrorMessage = function() {
    //return eh.findElementA(pobjects.passwordUIAutomator);
    //return eh.findElementA();
//}

module.exports = Login;
