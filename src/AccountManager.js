/**
* Generated On: 2016-11-10
* Class: AccountManager
*/

import Account, {TYPE_VIRGIN, TYPE_ANONYMOUS, TYPE_STANDARD} from './Account';

export default class AccountManager {
    constructor(OAuthClient) {
        this.account = new Account();
        this.OAuthClient = OAuthClient;
    }


    /**
    * @return  {boolean}
    *
    */
    hasAccount(){
        return this.account.type !== TYPE_VIRGIN;
    };


    /**
    * @param user
    *
    * @param password
    *
    * @param next {callback}
    *
    */
    createAccount(user, password, next){
    //TODO: Implement Me

    };


    /**
    * @param account {[object Object]}
    *
    */
    persistAccount(account){
    //TODO: Implement Me

    };


    /**
    * @param email
    *
    * @param password
    *
    * @param next {callback}
    *
    */
    login(email, password, next){
        this.OAuthClient.login(email, password, (err, data) => {
            if (!err) {
                this.account.type = TYPE_STANDARD;
                this.account.accessToken = data.access_token;
                this.account.refreshToken = data.refresh_token;
            }

            next(err, this.account);
        });
    };


    /**
    * @param next {callback}
    *
    */
    logout(next){
    //TODO: Implement Me

    };
}


