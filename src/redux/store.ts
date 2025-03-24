/* External dependencies */
import { applyMiddleware, combineReducers, createStore as createReduxStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import { Epic, EpicMiddleware, combineEpics, createEpicMiddleware } from 'redux-observable';

/* Local dependencies */
import { useDispatch } from 'react-redux';
import CognitoClient from '@mancho.devs/cognito';
import {
    Query,
    SubscriptionT22NotifyDeviceCreationArgs,
    SubscriptionT22NotifyUserUpdateArgs,
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
    T22User,
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
    notifyUserUpdateSubscription,
    queryAsAnonymousUser,
    subscribeAsAuthUser,
} from '../client/query';
import { setAuthenticatedClient } from '../client/graphql';
import { user } from '../components/website/mapApp/redux/User';
import { deviceSubscriptions } from '../components/website/mapApp/redux/deviceSubscriptions';
import { userSubscriptionSender } from '../components/website/login/redux/userSubscriptionSender';
import { userSubscriptions } from '../components/website/mapApp/redux/userSubscriptions';

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
        subscribeForCreation: (creatorID: string) => (subscriber: Subscriber<T22Device>) => void;
    };
}

export interface AddressClient {
    getAddress: (input: T22GetAddressInput) => Promise<T22GetAddressResponse>;
}

export interface UsersClient {
    getUser: () => Promise<T22GetUserResponse>;
    subscribeForUpdate: (userID: string) => (subscriber: Subscriber<T22User>) => void;
}

export interface RemoteClients {
    cognitoClient?: ClassToInterface<CognitoClient>;
    devicesClient?: DevicesClient;
    addressClient?: AddressClient;
    usersClient?: UsersClient;
}

type RootMiddleWare = EpicMiddleware<AllActions, AllActions, RootState, RemoteClients>;
export type RootEpic = Epic<AllActions, AllActions, RootState, RemoteClients>;

const rootEpic: RootEpic = combineEpics(
    cognito,
    address,
    devices,
    deviceSubscriptions,
    user,
    userSubscriptions,
    userSubscriptionSender,
);

export function createStore() {
    const epicMiddleware: RootMiddleWare = createEpicMiddleware({
        dependencies: {
            cognitoClient: new CognitoClient({
                UserPoolId: process.env.GATSBY_COGNITO_USER_POOL_ID,
                ClientId: process.env.GATSBY_COGNITO_CLIENT_ID,
            }),
            devicesClient: {
                forAnonymousUser: {
                    listDevices: async () =>
                        await queryAsAnonymousUser({
                            input: {},
                            query: listDevicesQuery.query,
                            resolver: 'T22ListDevices',
                        }),
                },
                forAuthenticatedUser: {
                    createDevice: async (input) =>
                        await mutateAsAuthUser({
                            input: input,
                            mutation: createDeviceMutation,
                            resolver: 'T22CreateDeviceRequest',
                        }),
                    deleteDevice: async (input) =>
                        await mutateAsAuthUser({
                            input: input,
                            mutation: deleteDeviceMutation,
                            resolver: 'T22DeleteDeviceRequest',
                        }),
                    approveDevice: async (input) =>
                        await mutateAsAuthUser({
                            input: input,
                            mutation: approveDeviceMutation,
                            resolver: 'T22ApproveDeviceRequest',
                        }),
                    subscribeForCreation: (creatorID) =>
                        subscribeAsAuthUser<SubscriptionT22NotifyDeviceCreationArgs, T22Device>({
                            variables: { creatorID },
                            query: notifyDeviceCreationSubscription,
                            resolver: 'T22NotifyDeviceCreation',
                            closeAfterFirstAnswer: true,
                        }),
                },
            },
            addressClient: {
                getAddress: async (input) =>
                    await queryAsAnonymousUser({
                        input: input,
                        query: getAddressQuery,
                        resolver: 'T22GetAddress',
                    }),
            },
            usersClient: {
                getUser: async () =>
                    (await setAuthenticatedClient())
                        .query<Query>({ query: getUserQuery })
                        .then((response) => response.data.T22GetUser),
                subscribeForUpdate: (id) =>
                    subscribeAsAuthUser<SubscriptionT22NotifyUserUpdateArgs, T22User>({
                        variables: { id },
                        query: notifyUserUpdateSubscription,
                        resolver: 'T22NotifyUserUpdate',
                        closeAfterFirstAnswer: false,
                    }),
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
