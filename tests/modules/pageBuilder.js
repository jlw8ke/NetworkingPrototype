var Home = require('../pages/Home.js');
var Login = require('../pages/Login.js');
var Nav = require('../pages/Navigation.js');
var Reminders = require('../pages/Reminders.js');
var SetUpNewReminder = require('../pages/SetUpNewReminder.js');
var SelectReminderType = require('../pages/SelectReminderType.js');

var pages = function(theBrowser) {
    this.home = new Home(theBrowser);
    this.login = new Login(theBrowser);
    this.nav = new Nav(theBrowser);
    this.reminders = new Reminders(theBrowser);
    this.setupnewreminder = new SetUpNewReminder(theBrowser);
    this.selectremindertype = new SelectReminderType(theBrowser);
}

module.exports = pages;