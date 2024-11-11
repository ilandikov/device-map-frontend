/* External dependencies */
import { applyMiddleware, combineReducers, createStore as createReduxStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import { Epic, EpicMiddleware, combineEpics, createEpicMiddleware } from 'redux-observable';

/* Local dependencies */
import { useDispatch } from 'react-redux';
import CognitoClient from '@mancho.devs/cognito';
import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { AUTH_TYPE, createAuthLink } from 'aws-appsync-auth-link';
import { createHttpLink } from '@apollo/client/core';
import { Observable } from 'rxjs';
import { AjaxResponse } from 'rxjs/internal/ajax/AjaxResponse';
import { ajax } from 'rxjs/internal/ajax/ajax';
import { Query, T22Device, T22Location } from '@mancho-school-t22/graphql-types';
import getDevices from '../components/devices/getDevices/redux/reducer';
import { MapAppReducer } from '../components/website/mapApp/redux/MapAppReducer';
import { authentication } from '../components/website/login/redux/Authentication';
import { cognito } from '../components/website/login/redux/cognito';
import { GeoApify } from '../components/website/mapApp/redux/GeoApify';
import { devices } from '../components/website/login/redux/devices';
import { LoginModalAction } from '../components/website/login/redux/LoginModalAction';
import { MapAppAction } from '../components/website/mapApp/redux/MapAppAction';
import { listDevicesQuery } from '../components/website/login/redux/devicesHelpers';
import { GeoApifyResponse } from '../components/website/mapApp/redux/GeoApifyHelpers';

const rootReducer = combineReducers({
    getDevices,
    mapAppState: MapAppReducer,
    authentication,
});

export type RootState = ReturnType<typeof rootReducer>;

export type AllActions = LoginModalAction | MapAppAction;

export type Dependency<T> = { [key in keyof T]: T[key] };

export interface DevicesClient {
    listDevices: () => Promise<Query>;
    createDevice: () => Promise<T22Device>;
}

export type Dependencies = {
    cognitoClient?: Dependency<CognitoClient>;
    devicesClient?: DevicesClient;
    geoApifyClient?: (location: T22Location) => Observable<AjaxResponse<GeoApifyResponse>>;
};

type RootMiddleWare = EpicMiddleware<AllActions, AllActions, RootState, Dependencies>;
export type RootEpic = Epic<AllActions, AllActions, RootState, Dependencies>;

const rootEpic: RootEpic = combineEpics(cognito, GeoApify, devices);

export function createStore() {
    const apolloClient = new ApolloClient({
        link: ApolloLink.from([
            createAuthLink({
                url: process.env.GATSBY_APPSYNC_ENDPOINT,
                region: process.env.GATSBY_REGION,
                auth: {
                    type: AUTH_TYPE.API_KEY,
                    apiKey: process.env.GATSBY_X_API_KEY,
                },
            }),
            createHttpLink({
                uri: process.env.GATSBY_APPSYNC_ENDPOINT,
            }),
        ]),
        cache: new InMemoryCache({ addTypename: false }),
    });
    const epicMiddleware: RootMiddleWare = createEpicMiddleware({
        dependencies: {
            cognitoClient: new CognitoClient({
                UserPoolId: process.env.GATSBY_COGNITO_USER_POOL_ID,
                ClientId: process.env.GATSBY_COGNITO_CLIENT_ID,
            }),
            devicesClient: {
                listDevices: () => apolloClient.query(listDevicesQuery).then((response) => response.data),
                createDevice: () => Promise.reject('not implemented'),
            },
            geoApifyClient: (location) =>
                ajax({
                    url: `https://api.geoapify.com/v1/geocode/reverse?lat=${location.lat}&lon=${location.lon}&apiKey=8b2ff18a6cd44e7a9a916eb52cc51f8b&lang=ru`,
                    method: 'GET',
                    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
                    crossDomain: true,
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
