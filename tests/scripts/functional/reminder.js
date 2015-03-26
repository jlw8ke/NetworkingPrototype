var bs = require('../../bootstrap.js');
var browser = bs.browser;
var pages = require('../../modules/pageBuilder.js');
var p = new pages(browser);
var log = bs.log;

var testCounter = 0;

describe('Android Boiler Plate - Functional Test - App should open! ', function() {
    this.timeout(bs.MaxWaittime); // Set wait time for whole describe


    beforeEach(function(done) {
        bs.beforeCode(bs.desired, "Android - Boiler Plate Test - " + testCounter, function() {
            testCounter++;
            done();
        });
    });

    afterEach(function(done) {
         browser.quit().nodeify(done);
    });

    it("should open", function (done) {
        done();
    })
});
