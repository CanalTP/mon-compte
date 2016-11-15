/**
* Generated On: 2016-11-10
* Class: OAuthClient
*/
import HttpError from './HttpError';

export default class OAuthClient {
    constructor(httpClient, tokenEndpoint, userInfoEndpoint, clientId, clientSecret) {
        this.httpClient = httpClient;
        this.tokenEndpoint = tokenEndpoint;
        this.userInfoEndpoint = userInfoEndpoint;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }


    /**
    * @param username
    *
    * @param password
    *
    * @param next {callback}
    *
    */
    login(username, password, next){
        this.httpClient.post(this.tokenEndpoint, (err, res) => {
            this.handleResponse(err, res, next);
        }, {
            body : {
                grant_type: 'password',
                username: username,
                password: password
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: 'Basic ' + new Buffer(this.clientId + ':' + this.clientSecret).toString('base64')
            }
        });
    };


    /**
    * @param next {callback}
    *
    */
    logout(next){
    //TODO: Implement Me

    };


    /**
    * @param accessToken
    *
    * @param next {callback}
    *
    */
    validateAuth(accessToken, next){
        this.httpClient.get(this.userInfoEndpoint, (err, res) => {
            this.handleResponse(err, res, next);
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    };

    /**
     * @param err
     * @param res
     * @param next {callback}
     */
    handleResponse(err, res, next) {
        let error = null;
        let data = null;

        if (err) {
            error = err;
        } else if (res.code >= 400) {
            error = new HttpError(
                res.code,
                this.httpClient.ticlient.statusText
            );
        } else {
            data = res.json;
        }

        next(error, data);
    }
}


