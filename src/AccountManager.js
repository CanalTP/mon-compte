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
        this.OAuthClient.login(email, password, (err, account) => {
            let data = null;
            if (!err) {
                this.account.email = email;
                this.account.password = password;
                this.account.type = TYPE_STANDARD;
                this.account.accessToken = account.access_token;
                this.account.refreshToken = account.refresh_token;

                data = this.account;
            }

            next(err, data);
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


