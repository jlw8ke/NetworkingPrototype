var bootstrap = require('./bootstrap');
var request = require('supertest-as-promised');
var XMLParser = require('xmldom').DOMParser;
var fs = require('fs');
var settings = bootstrap.settings;
var log = bootstrap.log;
var resultsXmlFile;
var TheAPI = request(settings.qtest.apiurl);
var authkey; // Get when we login
var testrunids = {}; // {tcname1: id, tcname2: id}

fs.readFile(settings.xunitResultsFile, 'utf8', function(err, data) {
    if(err) {
        log.error("Unable to read xunit results file: " + err);
        return;
    }

    if(!data) {
        return;
    }

    resultsXmlFile = new XMLParser().parseFromString(data);

    GetTestResultsAndUpload();
});



function GetTestResultsAndUpload() {
    Login(function() {
        GetTestRuns(ParseAndUploadTestCases)
    });
}

// Result looks like
// [
//    {
//        "links": [
//            {
//                "rel": "self",
//                "href": "http://nephele.qtestnet.com/api/v3/projects/1/test-runs/192"
//            }
//        ],
//        “id”: 192,
//        “name”: “TC-Add a Comment to Event “
//    },
// etc
function GetTestRuns(cbfxn) {
    TheAPI
        .get('/v3/projects/' + settings.qtest.projectid + '/test-suites/' + 
            settings.qtest.regressionsuiteid + '/test-runs')
        .set('Authorization', authkey)
        .send()
        .expect(200)
        .end(function(err, res) {
            if(err) {
                log.error("Problem getting test run ids: " + err);
                return;
            }
            var testruns = res.body;
            for(var i = 0; i < testruns.length; i++) {
                var run = testruns[i];
                testrunids[run.name] = run.id;
            }

            //console.log("Result from qtest: " + JSON.stringify(testrunids, null, 4));
            cbfxn();
        });
}

function ParseAndUploadTestCases() {
    // Get each tag TestCase
    var cases = resultsXmlFile.getElementsByTagName("testcase");

    // Get classname, name, time, message attributes
    for(var i = 0; i < cases.length; i++) {
        var thecase = cases[i];
        var classname = thecase.getAttribute("classname");
        var name = thecase.getAttribute("name");
        var time = thecase.getAttribute("time");
        var message = thecase.getAttribute("message");

        // See if it has a failure node under it
        var failure = thecase.getElementsByTagName("failure");
        var failM;
        if(failure.length > 0) {
            failM = failure[0].toString();
        }
        else {
            failM = "";
        }

        UploadResultToQTest(classname, name, time, message, failM);
    }
}

function UploadResultToQTest(classname, name, time, message, failMessage) {
    var runid = GetRunId(name);
    if(!runid) {
        log.error("Unable to find test run!");
        return;
    }

    var testdata = {
            'exe_start_date': new Date(),
            'exe_end_date': new Date(),
            'status': failMessage ? "FAIL" : "PASS",
            'class_name': name,
            'note': "Time: " + time + " -- " + failMessage ? message + " : " + failMessage : message
             };

    //console.log(JSON.stringify(testdata, null, 4));

    TheAPI
        .post('/v3/projects/' + settings.qtest.projectid + '/test-runs/' + runid + '/auto-test-logs')
        .set('Authorization', authkey)
        .set('Content-Type', 'application/json')
        .send(testdata)
        .expect(201)
        .end(function(err, res) {
            if(err) {
                log.error("Problem upload qtest automation result: " + err);
                return;
            }
            console.log("Successfully uploaded result data for test: " + name);
        });
}

function GetRunId(name) {
    try {
        var id = testrunids[name];
        console.log("Found test run id: " + id);
        return id;
    }
    catch(e) {
        log.error("Unable to find test run!");
        return;
    }
}

function Login(cbfxn) {
    TheAPI
    .post('/login')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('Cache-Control', 'no-cache')
    .send({
        'j_username': settings.qtest.username,
        'j_password': settings.qtest.password,
         })
    .expect(200)
    .end(function(err, res) {
        if(err) {
            log.error("Problem logging into qtest: " + err);
            return;
        }
        authkey = res.text;
        cbfxn();
    });
}
