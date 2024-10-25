/* External dependencies */
import { applyMiddleware, combineReducers, createStore as createReduxStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import { Epic, EpicMiddleware, combineEpics, createEpicMiddleware } from 'redux-observable';

/* Local dependencies */
import { useDispatch } from 'react-redux';
import CognitoClient from '@mancho.devs/cognito';
import { ApolloClient, InMemoryCache } from '@apollo/client';
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
    apolloClient?: Dependency<ApolloClient<InMemoryCache>>;
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
