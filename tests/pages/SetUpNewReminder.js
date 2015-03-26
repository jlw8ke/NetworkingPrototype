var bs = require('../bootstrap.js');
var browser = bs.browser;
var eventHelpers = require('../modules/eventHelpers.js');
var eh = new eventHelpers(browser);
var wd = require('wd');

// Page Elements Here


var pobjects = {
    tapReminderType: 'new UiSelector().resourceId("com.cvshealth.specialtyrx:id/reminder_type")',
    tapFrequency: 'new UiSelector().resourceId("com.cvshealth.specialtyrx:id/reminder_frequency")',
    tapTime: 'new UiSelector().resourceId("com.cvshealth.specialtyrx:id/starting_time")',
    tapOneTimeOnly: 'new UiSelector().resourceId("com.cvshealth.specialtyrx:id/item_text")',
    tapDone: 'new UiSelector().resourceId("android:id/button1")',
    tapSave: 'new UiSelector().resourceId("com.cvshealth.specialtyrx:id/saveButton")',
    tapStartingToday: 'new UiSelector().resourceId("com.cvshealth.specialtyrx:id/starting_date")',
    setTomorrow: 'new UiSelector().text("20")',
    tapNewReminder: 'new UiSelector().resourceId("com.cvshealth.specialtyrx:id/arrow")',
    tapEditButton: 'new UiSelector().text("Edit")',
    tapDeleteButton: 'new UiSelector().text("Delete")',
    tapConfirmDelete: 'new UiSelector().text("Yes")',
    doctorAppointment: 'new UiSelector().text("Doctor Appointment")',
    //takeMedications: 'new UiSelector().resourceId("com.cvshealth.specialtyrx:id/reminderType")'
    takeMedications: 'new UiSelector().resourceId("com.cvshealth.specialtyrx:id/reminderTime")'
};

var SetUpNewReminder = function(theBrowser) {
    browser = theBrowser;
};

SetUpNewReminder.prototype.tapReminderType = function() {
    return eh.clickElementA(pobjects.tapReminderType);
}

SetUpNewReminder.prototype.getTypeValue = function() {
    return eh.findElementA(pobjects.tapReminderType).getAttribute("text");
}

SetUpNewReminder.prototype.tapFrequency = function() {
    return eh.clickElementA(pobjects.tapFrequency);
}

SetUpNewReminder.prototype.tapOneTimeOnly = function() {
    return eh.clickElementA(pobjects.tapOneTimeOnly);
}

SetUpNewReminder.prototype.getOneTimeOnlyValue = function() {
    return eh.findElementA(pobjects.tapFrequency).getAttribute("text");
}

SetUpNewReminder.prototype.tapTime = function() {
    return eh.clickElementA(pobjects.tapTime);
}

SetUpNewReminder.prototype.tapDone = function() {
    return eh.clickElementA(pobjects.tapDone);
}

SetUpNewReminder.prototype.tapSave = function() {
    return eh.clickElementA(pobjects.tapSave);
}

SetUpNewReminder.prototype.verifyNewReminder = function() {
    return eh.findElementA(pobjects.tapNewReminder).getAttribute("text");
}

SetUpNewReminder.prototype.verifyNewReminderTakeMedication = function() {
    return browser.waitForElementByAndroidUIAutomator('new UiSelector().resourceId("com.cvshealth.specialtyrx:id/reminderType")', 20000, 1000, wd.asserters.isDisplayed)
        .getAttribute("text");
    //return eh.findElementA(pobjects.takeMedications).getAttribute("resource-id");
}

SetUpNewReminder.prototype.verifyDoctorAppointment = function() {
    return eh.findElementA(pobjects.doctorAppointment).getAttribute("text");
}

SetUpNewReminder.prototype.tapStartingToday = function() {
    return eh.clickElementA(pobjects.tapStartingToday)
}

SetUpNewReminder.prototype.setTomorrow = function() {
    return eh.clickElementA(pobjects.setTomorrow);
}

SetUpNewReminder.prototype.tapNewReminder = function() {
    return eh.clickElementA(pobjects.tapNewReminder)
}

SetUpNewReminder.prototype.tapEditButton = function() {
    return eh.clickElementA(pobjects.tapEditButton)
}

SetUpNewReminder.prototype.tapDeleteButton = function() {
    return eh.clickElementA(pobjects.tapDeleteButton)
}

SetUpNewReminder.prototype.tapConfirmDelete = function() {
    return eh.clickElementA(pobjects.tapConfirmDelete)
}

SetUpNewReminder.prototype.doctorAppointment = function() {
    return eh.clickElementA(pobjects.doctorAppointment)
}

module.exports = SetUpNewReminder;

