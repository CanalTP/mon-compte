import chai, { assert } from 'chai';
import sinon from 'sinon';
import OAuthClient from './../OAuthClient';
import HttpError from './../HttpError';

describe('OAuthClient', function() {
    describe('login', function() {
        it('should return OAuth infos', function (done) {
            let stub = sinon.stub();
            let wsRes = {
                code: 200,
                json: {
                    "access_token": "79eee7d0ea378d7cc196679e5a69386293d",
                    "token_type": "bearer",
                    "expires_in": 1674234,
                    "scope": "moncompte",
                    "refresh_token": "40e37a07a27d95cb269c84f139b6e07373"
                }
            };
            stub.callsArgWith(1, null, wsRes);
            let http = {
                post: stub
            };
            let tokenEndpoint = 'http://oauth2.ctp.com/token';
            let client = new OAuthClient(http, tokenEndpoint, 'http://oauth2.ctp.com/userinfo', '89e39ddaa5142072', 'ab3333fef68f56afd');
            let userName = 'test@moncompte.com';
            let userPassword = 'E14+KnYtP8eT';

            client.login(userName, userPassword, function(err, data) {
                assert.equal(stub.getCall(0).args[0], tokenEndpoint);
                assert.deepEqual(stub.getCall(0).args[2], {
                    body: {
                        grant_type: 'password',
                        username: userName,
                        password: userPassword
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Authorization: 'Basic ODllMzlkZGFhNTE0MjA3MjphYjMzMzNmZWY2OGY1NmFmZA=='
                    }
                });
                assert.equal(wsRes.json, data);
                assert.isNull(err);

                done();
            });
        });

        it('should return an HttpError on fail', function(done) {
            let stub = sinon.stub();
            let wsRes = {
                code: 401,
                json: {
                    "error": "invalid_client"
                }
            };
            let statusText = "Unauthorized";
            stub.callsArgWith(1, null, wsRes);
            let http = {
                post: stub,
                ticlient: {
                    statusText: statusText
                }
            };
            let userName = 'test@moncompte.com';
            let userPassword = 'E14+KnYtP8eT';
            let client = new OAuthClient(http, 'http://oauth2.ctp.com/token', 'http://oauth2.ctp.com/userinfo', '89e39ddaa5142072', 'ab3333fef68f56afd');
            client.login(userName, userPassword, function(err, data) {
                assert.instanceOf(err, HttpError);
                assert.deepEqual(err, {
                    code: wsRes.code,
                    text: statusText
                });
                assert.isNull(data);

                done();
            });
        });

        it('should pass errors', function(done) {
            let stub = sinon.stub();
            let wsRes = {
                message: 'timeout'
            };
            stub.callsArgWith(1, wsRes, null);
            let http = {
                post: stub
            };
            let client = new OAuthClient(http, 'http://oauth2.ctp.com/token', 'http://oauth2.ctp.com/userinfo', '89e39ddaa5142072', 'ab3333fef68f56afd');
            client.login('test@moncompte.com', 'E14+KnYtP8eT', function(err, data) {
                assert.equal(wsRes, err);
                assert.isNull(data);

                done();
            });
        });
    });

    describe('validateAuth', function() {
        it('should return user info when token is valid', function(done) {
            let stub = sinon.stub();
            let wsRes = {
                code: 200,
                json: {
                    "filiale": "MONTARGIS",
                    "idTechPortail": "100000090",
                    "statutCompte": "0",
                    "email": "test@moncompte.com"
                }
            };
            stub.callsArgWith(1, null, wsRes);
            let http = {
                get: stub
            };
            let accessToken = '79eee7d0ea378d7cc196679e5a693862';
            let userInfoEndpoint = 'http://oauth2.ctp.com/userinfo';
            let client = new OAuthClient(http, 'http://oauth2.ctp.com/token', userInfoEndpoint, '89e39ddaa5142072', 'ab3333fef68f56afd');
            client.validateAuth(accessToken, function(err, data) {
                assert.deepEqual(stub.getCall(0).args[2], {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                assert.equal(stub.getCall(0).args[0], userInfoEndpoint);
                assert.equal(wsRes.json, data);

                done();
            });
        });

        it('should return an HttpError when token is invalid', function(done) {
            let stub = sinon.stub();
            let wsRes = {
                code: 401
            };
            let statusText = 'Unauthorized';
            stub.callsArgWith(1, null, wsRes);
            let http = {
                get: stub,
                ticlient: {
                    statusText: statusText
                }
            };
            let client = new OAuthClient(http, 'http://oauth2.ctp.com/token', 'http://oauth2.ctp.com/userinfo', '89e39ddaa5142072', 'ab3333fef68f56afd');
            client.validateAuth('thisisnotavalidtoken', function(err, res) {
                assert.instanceOf(err, HttpError);
                assert.deepEqual(err, {
                    code: wsRes.code,
                    text: statusText
                });
                assert.isNull(res);

                done();
            });
        });

        it('should return an error when library don\'t receive valid response', function(done) {
            let stub = sinon.stub();
            let wsRes = {
                code: 401
            };
            let statusText = 'Unauthorized';
            stub.callsArgWith(1, null, wsRes);
            let http = {
                get: stub,
                ticlient: {
                    statusText: statusText
                }
            };
            let client = new OAuthClient(http, 'http://oauth2.ctp.com/token', 'http://oauth2.ctp.com/userinfo', '89e39ddaa5142072', 'ab3333fef68f56afd');
            client.validateAuth('thisisnotavalidtoken', function(err, res) {
                assert.instanceOf(err, HttpError);
                assert.deepEqual(err, {
                    code: wsRes.code,
                    text: statusText
                });
                assert.isNull(res);

                done();
            });

        });

        it('should pass errors', function(done) {
            let stub = sinon.stub();
            let wsRes = {
                message: 'timeout'
            };
            stub.callsArgWith(1, wsRes, null);
            let http = {
                get: stub
            };
            let client = new OAuthClient(http, 'http://oauth2.ctp.com/token', 'http://oauth2.ctp.com/userinfo', '89e39ddaa5142072', 'ab3333fef68f56afd');
            client.validateAuth('thisisnotavalidtoken', function(err, data) {
                assert.equal(wsRes, err);
                assert.isNull(data);

                done();
            });
        });
    });
});