/**
* Generated On: 2016-11-10
* Class: Account
*/

export const TYPE_VIRGIN = 0;
export const TYPE_ANONYMOUS = 1;
export const TYPE_STANDARD = 2;

export default class Account {

    constructor() {
        this.id = null;
        this.type = TYPE_VIRGIN;
        this.email = null;
        this.password = null;
        this.accessToken = null;
        this.refreshToken = null;
    }

    /**
    * @return  {boolean}
    *
    */
    isStandardAccount(){

        return this.type == TYPE_STANDARD;
    };
}