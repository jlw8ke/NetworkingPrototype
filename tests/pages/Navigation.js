var bs = require('../bootstrap.js');
var browser = bs.browser;
var eventHelpers = require('../modules/eventHelpers.js');
var eh = new eventHelpers(browser);
 
// Page Elements Here


var pobjects = {
    signIn: "//UIAApplication[1]/UIAWindow[1]/UIATableView[2]/UIATableCell[1]/UIAStaticText[2]",
    signOut: "//UIAApplication[1]/UIAWindow[1]/UIATableView[2]/UIATableCell[6]"

 };	

var Nav = function(theBrowser) {
    browser = theBrowser;
};
 
Nav.prototype.findLogout = function() {
    return eh.findElement(pobjects.signOut);
}
 
Nav.prototype.clickLogout = function() {
    return eh.clickElement(pobjects.signOut);
}

Nav.prototype.clickSignIn = function() {
    return eh.clickElement(pobjects.signIn);
}

Nav.prototype.clickFeedback = function() {
    return eh.clickElementByXPath(pobjects.feedback);
}

Nav.prototype.isLoginButtonPresent = function() {
    return browser.hasElementByXPath(pobjects.signIn);
}


Nav.prototype.findFeedback = function() {
    return eh.findElementByUIAutomator(pobjects.feedbackUI);
}



 
 
module.exports = Nav;

