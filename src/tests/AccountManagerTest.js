import chai, { assert } from 'chai';
import sinon from 'sinon';
import AccountManager from './../AccountManager';
import Account, {TYPE_VIRGIN, TYPE_ANONYMOUS, TYPE_STANDARD} from './../Account';

describe('AccountManager', function() {
    describe('hasAccount', function() {
        it('should return false if AccountManager have virgin account', function () {
            let accountManager = new AccountManager();

            assert.equal(accountManager.hasAccount(), false);
        });

        it('should return true if AccountManager have not virgin account', function () {
            let accountManager = new AccountManager();
            accountManager.account.type = TYPE_ANONYMOUS;

            assert.equal(accountManager.hasAccount(), true);
        });
    });

    describe('login', function() {
        it('should return account information', function (done) {
            let stub = sinon.stub();
            let wsData = {
                "access_token": "79eee7d0ea378d7cc196679e5a6",
                "token_type": "bearer",
                "expires_in": 2002087,
                "scope": "moncompte",
                "refresh_token": "40e37a07a27d95cb269c84f139"
            };
            stub.callsArgWith(2, null, wsData);
            let OauthMock = {
                login: stub
            };
            let accountManager = new  AccountManager(OauthMock);
            accountManager.login('jgozo', 'jgozo', function(err, account) {
                assert.equal(account.type, TYPE_STANDARD);
                assert.equal(account.accessToken, wsData.access_token);
                assert.equal(account.refreshToken, wsData.refresh_token);
                assert.isNull(err);

                done();
            });
        });

        it('should throw an error in case of bad oauth call', function (done) {
            let stub = sinon.stub();
            let wsData = {
                "error": 'invalid_grant'
            };
            stub.callsArgWith(2, wsData, null);
            let OauthMock = {
                login: stub
            };
            let accountManager = new  AccountManager(OauthMock);
            let accountClone = Object.assign(accountManager.account);
            accountManager.login('jgozo', 'jgozo', function(err, account) {
                assert.isNotNull(err);
                assert.equal(accountClone, account);

                done();
            });
        });
    });
});