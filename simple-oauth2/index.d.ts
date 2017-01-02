// Type definitions for simple-oauth2 1.0
// Project: https://github.com/lelylan/simple-oauth2
// Definitions by: [Michael Müller] <https://github.com/mad-mike>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

import Bluebird = require("bluebird");

/** Creates a new simple-oauth2 client with the passed configuration */
export function create(options: ModuleOptions): OAuthClient;

interface ModuleOptions {
    client: {
        /** Service registered client id. Required. */
        id: string,
        /** Service registered client secret. Required. */
        secret: string,
        /** Parameter name used to send the client secret. Default to client_secret. */
        secretParamName?: string,
        /** Parameter name used to send the client id. Default to client_id. */
        idParamName?: string
    };
    auth: {
        /** String used to set the host to request the tokens to. Required. */
        tokenHost: string,
        /** String path to request an access token. Default to /oauth/token. */
        tokenPath?: string,
        /** String path to revoken an access token. Default to /oauth/revoke. */
        revokePath?: string,
        /** String used to set the host to request an "authorization code". Default to the value set on auth.tokenHost. */
        authorizeHost?: string,
        /** String path to request an authorization code. Default to /oauth/authorize. */
        authorizePath?: string
    };
    /** optional object used to set global options to the internal http library (request-js). */
    http?: {};
    options?: {
        /** Wheather or not the client.id/client.secret params are sent in the request body. Defaults to true. */
        useBodyAuth?: boolean,
        useBasicAuthorizationHeader?: boolean
    };
}

type TokenType = "access_token" | "refresh_token";

interface AccessToken {
    token: {};

    /** Check if the access token is expired or not */
    expired(): boolean;
    /** Refresh the access token */
    refresh(params: {}, callback: (error: any, result: AccessToken) => void): Bluebird<AccessToken>;
    refresh(callback?: (error: any, result: AccessToken) => void): Bluebird<AccessToken>;
    /** Revoke access or refresh token */
    revoke(tokenType: TokenType, callback?: (error: any) => void): Bluebird<void>;
}

interface Token {
    [x: string]: any;
}
type AuthorizationCode = string;
interface AuthorizationTokenConfig {
    code: AuthorizationCode;
    redirect_uri: string;
}

interface PasswordTokenConfig {
    /** A string that represents the registered username */
    username: string;
    /** A string that represents the registered password. */
    password: string;
    /** A string that represents the application privileges */
    scope: string;
}

interface ClientCredentialTokenConfig {
    /** A string that represents the application privileges */
    scope?: string;
}

export interface OAuthClient {
    authorizationCode: {
        /**
         * Redirect the user to the autorization page
         * @return {string} the absolute authorization url
         */
        authorizeURL(params?: {
            /** A string that represents the registered application URI where the user is redirected after authentication */
            redirect_uri?: string,
            /** A String that represents the application privileges */
            scope?: string,
            /** A String that represents an option opaque value used by the client to main the state between the request and the callback */
            state?: string
        }): string,

        /** Returns the Access Token object */
        getToken(params: AuthorizationTokenConfig, callback?: (error: any, result: Token) => void): Bluebird<Token>;
    };

    ownerPassword: {
        /** Returns the Access Token Object */
        getToken(params: PasswordTokenConfig, callback?: (error: any, result: Token) => void): Bluebird<Token>;
    };

    clientCredentials: {
        /** Returns the Access Token Object */
        getToken(params: ClientCredentialTokenConfig, callback?: (error: any, result: Token) => void): Bluebird<Token>;
    };

    accessToken: {
        /** Creates an OAuth2.AccessToken instance */
        create(tokenToUse: Token): AccessToken;
    };
}