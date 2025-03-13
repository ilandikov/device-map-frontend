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
import {
    Query,
    Subscription,
    SubscriptionT22NotifyDeviceCreationArgs,
    T22ApproveDeviceRequestInput,
    T22ApproveDeviceRequestResponse,
    T22CreateDeviceRequestInput,
    T22CreateDeviceRequestResponse,
    T22DeleteDeviceRequestInput,
    T22Device,
    T22GetAddressInput,
    T22GetAddressResponse,
    T22GetUserResponse,
    T22ListDevicesResponse,
} from '@mancho-school-t22/graphql-types';
import { Subscriber } from 'rxjs';
import { MapAppReducer } from '../components/website/mapApp/redux/MapAppReducer';
import { authentication } from '../components/website/login/redux/Authentication';
import { cognito } from '../components/website/login/redux/cognito';
import { address } from '../components/website/mapApp/redux/Address';
import { devices } from '../components/website/mapApp/redux/devices';
import { LoginModalAction } from '../components/website/login/redux/LoginModalAction';
import { MapAppAction } from '../components/website/mapApp/redux/MapAppAction';
import {
    approveDeviceMutation,
    createDeviceMutation,
    deleteDeviceMutation,
    getAddressQuery,
    getUserQuery,
    listDevicesQuery,
    mutateAsAuthUser,
    notifyDeviceCreationSubscription,
} from '../client/query';
import { anonymousClient, setAuthenticatedClient } from '../client/graphql';
import { user } from '../components/website/mapApp/redux/User';
import { deviceSubscriptions } from '../components/website/mapApp/redux/deviceSubscriptions';

const rootReducer = combineReducers({
    mapAppState: MapAppReducer,
    authentication,
});

export type RootState = ReturnType<typeof rootReducer>;

export type StateBuilder<TState> = (partialState: Partial<TState>) => TState;

export type AllActions = LoginModalAction | MapAppAction;

export type ClassToInterface<T> = { [key in keyof T]: T[key] };

export interface DevicesClient {
    forAnonymousUser: {
        listDevices: () => Promise<T22ListDevicesResponse>;
    };
    forAuthenticatedUser: {
        createDevice: (createDeviceInput: T22CreateDeviceRequestInput) => Promise<T22CreateDeviceRequestResponse>;
        deleteDevice: (deleteDeviceInput: T22DeleteDeviceRequestInput) => Promise<T22DeleteDeviceRequestInput>;
        approveDevice: (approveDeviceInput: T22ApproveDeviceRequestInput) => Promise<T22ApproveDeviceRequestResponse>;
    };
}

export interface DeviceSubscriptionClient {
    creation: (creatorID: string) => (subscriber: Subscriber<T22Device>) => void;
}

export interface AddressClient {
    getAddress: (input: T22GetAddressInput) => Promise<T22GetAddressResponse>;
}

export interface UsersClient {
    getUser: () => Promise<T22GetUserResponse>;
}

export interface RemoteClients {
    cognitoClient?: ClassToInterface<CognitoClient>;
    devicesClient?: DevicesClient;
    deviceSubscriptionClient?: DeviceSubscriptionClient;
    addressClient?: AddressClient;
    usersClient?: UsersClient;
}

type RootMiddleWare = EpicMiddleware<AllActions, AllActions, RootState, RemoteClients>;
export type RootEpic = Epic<AllActions, AllActions, RootState, RemoteClients>;

const rootEpic: RootEpic = combineEpics(cognito, address, devices, deviceSubscriptions, user);

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
                forAnonymousUser: {
                    listDevices: () =>
                        apolloClient.query<Query>(listDevicesQuery).then((response) => response.data.T22ListDevices),
                },
                forAuthenticatedUser: {
                    createDevice: async (input) =>
                        await mutateAsAuthUser(input, createDeviceMutation, 'T22CreateDeviceRequest'),
                    deleteDevice: async (input) =>
                        await mutateAsAuthUser(input, deleteDeviceMutation, 'T22DeleteDeviceRequest'),
                    approveDevice: async (input) =>
                        await mutateAsAuthUser(input, approveDeviceMutation, 'T22ApproveDeviceRequest'),
                },
            },
            deviceSubscriptionClient: {
                creation: (creatorID) => (subscriber) => {
                    const subscription = anonymousClient
                        .subscribe<
                            Subscription,
                            SubscriptionT22NotifyDeviceCreationArgs
                        >({ query: notifyDeviceCreationSubscription, variables: { creatorID } })
                        .subscribe({
                            next: (fetchResult) => {
                                subscriber.next(fetchResult.data.T22NotifyDeviceCreation);
                                subscriber.complete();
                            },
                            error: (error) => {
                                subscriber.error(error);
                                subscriber.complete();
                            },
                            complete: () => subscriber.complete(),
                        });
                    return () => subscription.unsubscribe();
                },
            },
            addressClient: {
                getAddress: (input) =>
                    apolloClient
                        .query<Query>({ query: getAddressQuery, variables: { input } })
                        .then((response) => response.data.T22GetAddress),
            },
            usersClient: {
                getUser: async () =>
                    (await setAuthenticatedClient())
                        .query<Query>({ query: getUserQuery })
                        .then((response) => response.data.T22GetUser),
            },
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
