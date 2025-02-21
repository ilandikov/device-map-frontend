/* External dependencies */
import { ApolloClient, ApolloLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { createHttpLink } from '@apollo/client/core';
import * as AWSCognito from 'amazon-cognito-identity-js';
import { LocalStorageWrapper, persistCache } from 'apollo3-cache-persist';
import { AUTH_TYPE, createAuthLink } from 'aws-appsync-auth-link';
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link';
import AWS, { CognitoIdentityCredentials } from 'aws-sdk/global';
import { v4 as uuidv4 } from 'uuid';

export let anonymousClient: ApolloClient<NormalizedCacheObject>;

export async function setAnonymousClient(): Promise<ApolloClient<NormalizedCacheObject>> {
    if (anonymousClient) {
        return anonymousClient;
    }

    const anonymousClientConfig = {
        url: process.env.GATSBY_APPSYNC_ENDPOINT,
        region: process.env.GATSBY_REGION,
        auth: {
            type: AUTH_TYPE.API_KEY as AUTH_TYPE.API_KEY,
            apiKey: process.env.GATSBY_AVERSPAY_APP_SYNC_API_KEY,
        },
        offlineConfig: {
            keyPrefix: `client-instance-${uuidv4()}`,
        },
    };

    const { url } = anonymousClientConfig;
    const httpLink = createHttpLink({ uri: url });

    const link = ApolloLink.from([
        createAuthLink(anonymousClientConfig),
        createSubscriptionHandshakeLink(anonymousClientConfig, httpLink),
    ]);

    const cache = new InMemoryCache();

    if (typeof window !== 'undefined') {
        await persistCache({
            cache,
            storage: new LocalStorageWrapper(window.localStorage),
        });
    }

    return (anonymousClient = new ApolloClient({
        link,
        cache,
    }));
}

function getCognitoIdentityCredentials(token: string) {
    return new CognitoIdentityCredentials({
        IdentityPoolId: process.env.GATSBY_COGNITO_IDENTITY_POOL_ID!,
        Logins: {
            [`cognito-idp.us-west-2.amazonaws.com/${process.env.GATSBY_COGNITO_USER_POOL_ID}`]: token,
        },
    });
}

export async function setAuthenticatedClient() {
    const userPool = new AWSCognito.CognitoUserPool({
        UserPoolId: process.env.GATSBY_COGNITO_USER_POOL_ID!,
        ClientId: process.env.GATSBY_COGNITO_CLIENT_ID!,
    });

    const currentUser: AWSCognito.CognitoUser | null = userPool.getCurrentUser();

    if (!currentUser) {
        throw new Error('No current user');
    }

    const session: AWSCognito.CognitoUserSession = await new Promise((resolve, reject) => {
        currentUser.getSession((err, session) => {
            if (err) {
                reject(err);
            } else {
                resolve(session);
            }
        });
    });

    if (!session.isValid()) {
        throw new Error('Session is not valid');
    }

    const idToken = session.getIdToken().getJwtToken();

    const credentials = getCognitoIdentityCredentials(idToken);

    AWS.config.update({
        region: process.env.GATSBY_REGION,
        credentials,
    });

    const authLink = createAuthLink({
        url: process.env.GATSBY_APPSYNC_ENDPOINT!,
        region: process.env.GATSBY_REGION!,
        auth: {
            type: AUTH_TYPE.AWS_IAM,
            credentials: AWS.config.credentials!,
        },
    });

    const httpLink = createHttpLink({ uri: process.env.GATSBY_APPSYNC_ENDPOINT! });

    const link = ApolloLink.from([
        authLink,
        createSubscriptionHandshakeLink(
            {
                url: process.env.GATSBY_APPSYNC_ENDPOINT!,
                region: process.env.GATSBY_REGION!,
                auth: {
                    type: AUTH_TYPE.AWS_IAM,
                    credentials: AWS.config.credentials!,
                },
            },
            httpLink,
        ),
    ]);

    return (anonymousClient = new ApolloClient({
        link,
        cache: new InMemoryCache({
            addTypename: false,
        }),
    }));
}
