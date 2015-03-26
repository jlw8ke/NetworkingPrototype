var bs = require('../bootstrap.js');
var browser = bs.browser;
var eventHelpers = require('../modules/eventHelpers.js');
var eh = new eventHelpers(browser);

// Page Elements Here


var pobjects = {
    reminderButton: 'new UiSelector().resourceId("com.cvshealth.specialtyrx:id")'
};

var Reminders = function(theBrowser) {
    browser = theBrowser;
};

Reminders.prototype.tapReminder = function() {
    return eh.clickElementA(pobjects.reminderButton);
}

module.exports = Reminders;

