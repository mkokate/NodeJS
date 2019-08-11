const chai = require('chai');
const chaiHttp = require('chai-http');

let expect = chai.expect;
chai.use(chaiHttp);

describe('Testing employee API', () => {
    it('should return status 200 for /employee', function(done){
        chai 
        .request('http://localhost:3000')
        .get('/employee')
        .then((res) => {
            expect(res).to.have.status(200);
            done();
        })
        .catch((error) => {
            throw error;
        })
    });

    it('should return status 400 for /employee/Id', function(done){
        chai 
        .request('http://localhost:3000')
        .get('/employee/305')
        .then((res) => {
            expect(res).to.have.status(400);
            done();
        })
        .catch((error) => {
            throw error;
        })
    });
})