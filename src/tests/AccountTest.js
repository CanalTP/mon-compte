import { assert } from 'chai';
import Account, {TYPE_VIRGIN, TYPE_ANONYMOUS, TYPE_STANDARD} from './../Account';

describe('Account', function() {
    it('should be virgin at birth', function () {
        let account = new Account();
        assert.equal(account.isStandardAccount(), false);
    });

    it('should return true if standard', function () {
        let account = new Account();
        account.type = TYPE_STANDARD;
        assert.equal(account.isStandardAccount(), true);
    });

    it('should return false if anonymous', function () {
        let account = new Account();
        account.type = TYPE_ANONYMOUS;
        assert.equal(account.isStandardAccount(), false);
    });
});