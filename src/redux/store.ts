/* External dependencies */
import { applyMiddleware, combineReducers, createStore as createReduxStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import { Epic, EpicMiddleware, combineEpics, createEpicMiddleware } from 'redux-observable';

/* Local dependencies */
import { useDispatch } from 'react-redux';
import CognitoClient from '@mancho.devs/cognito';
import { ApolloClient, ApolloLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { AUTH_TYPE, createAuthLink } from 'aws-appsync-auth-link';
import { createHttpLink } from '@apollo/client/core';
import getDevices from '../components/devices/getDevices/redux/reducer';
import { MapAppReducer } from '../components/website/mapApp/redux/MapAppReducer';
import { loginModalAuthentication } from '../components/website/login/redux/LoginModalAuthentication';
import { cognito } from '../components/website/login/redux/cognito';
import { GeoApify } from '../components/website/mapApp/redux/GeoApify';
import { devices } from '../components/website/login/redux/devices';
import { LoginModalAction } from '../components/website/login/redux/LoginModalAction';
import { MapAppAction } from '../components/website/mapApp/redux/MapAppAction';

const rootReducer = combineReducers({
    getDevices,
    mapAppState: MapAppReducer,
    loginModalAuthentication,
});

export type RootState = ReturnType<typeof rootReducer>;

type AllActions = LoginModalAction | MapAppAction;

export type Dependency<T> = { [key in keyof T]: T[key] };
type Dependencies = {
    cognitoClient?: Dependency<CognitoClient>;
    apolloClient?: Dependency<ApolloClient<NormalizedCacheObject>>;
};

type RootMiddleWare = EpicMiddleware<AllActions, AllActions, RootState, Dependencies>;
export type RootEpic = Epic<AllActions, AllActions, RootState, Dependencies>;

const rootEpic: RootEpic = combineEpics(cognito, GeoApify, devices);

export function createStore() {
    const epicMiddleware: RootMiddleWare = createEpicMiddleware({
        dependencies: {
            cognitoClient: new CognitoClient({
                UserPoolId: process.env.GATSBY_COGNITO_USER_POOL_ID,
                ClientId: process.env.GATSBY_COGNITO_CLIENT_ID,
            }),
            apolloClient: new ApolloClient({
                link: ApolloLink.from([
                    createAuthLink({
                        url: process.env.APPSYNC_ENDPOINT,
                        region: process.env.REGION,
                        auth: {
                            type: AUTH_TYPE.API_KEY,
                            apiKey: process.env.X_API_KEY,
                        },
                    }),
                    createHttpLink({
                        uri: process.env.APPSYNC_ENDPOINT,
                    }),
                ]),
                cache: new InMemoryCache(),
            }),
        },
    });

    // @ts-expect-error
    const store = createReduxStore(rootReducer, composeWithDevTools(applyMiddleware(epicMiddleware)));

    epicMiddleware.run(rootEpic);

    return store;
}

const store = createStore();

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
