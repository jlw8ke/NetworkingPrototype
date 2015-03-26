var bs = require('../bootstrap.js');
var browser = bs.browser;
var eventHelpers = require('../modules/eventHelpers.js');
var eh = new eventHelpers(browser);

// Page Elements Here


var pobjects = {
    selectTakeMedication: 'new UiSelector().resourceId("com.cvshealth.specialtyrx:id/item_text")'
};

var SelectReminderType = function(theBrowser) {
    browser = theBrowser;
};

SelectReminderType.prototype.tapTakeMedication = function() {
    return eh.clickElementA(pobjects.selectTakeMedication);
}

//SelectReminderType.prototype.verifyTakeMedication = function() {
//    return eh.findElement(SelectReminderType).getValue();
//}

module.exports = SelectReminderType;

