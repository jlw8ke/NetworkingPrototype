var request = require('supertest')

//request = request('http://google.com');
request = request('https://www.google.com');

describe('User', function() {
    it('can access google', function(done) {
        request.get('/').expect(200, function(err){
            if(err) {
                done(err);
            }
            else {
                done();
            }
        })
    })
})
