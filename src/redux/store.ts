/* External dependencies */
import { applyMiddleware, combineReducers, createStore as createReduxStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import { Epic, EpicMiddleware, combineEpics, createEpicMiddleware } from 'redux-observable';

/* Local dependencies */
import { useDispatch } from 'react-redux';
import CognitoClient from '@mancho.devs/cognito';
import getDevices from '../components/devices/getDevices/redux/reducer';
import { MapAppReducer } from '../components/website/mapApp/redux/MapAppReducer';
import { loginModalAuthentication } from '../components/website/login/redux/LoginModalAuthentication';
import { cognito } from '../components/website/login/redux/cognito';
import { GeoApify } from '../components/website/mapApp/redux/GeoApify';
import { devices } from '../components/website/login/redux/devices';
import { LoginModalAction } from '../components/website/login/redux/LoginModalAction';
import { MapAppAction } from '../components/website/mapApp/redux/MapAppAction';
import { CognitoClients } from '../components/website/login/redux/cognitoHelpers';

const rootReducer = combineReducers({
    getDevices,
    mapAppState: MapAppReducer,
    loginModalAuthentication,
});

export type RootState = ReturnType<typeof rootReducer>;

export type RootEpic = Epic<
    LoginModalAction | MapAppAction,
    LoginModalAction | MapAppAction,
    RootState,
    { cognitoClient?: CognitoClients }
>;

const rootEpic: RootEpic = combineEpics(cognito, GeoApify, devices);

export function createStore() {
    type RootMiddleWare = EpicMiddleware<
        LoginModalAction | MapAppAction,
        LoginModalAction | MapAppAction,
        RootState,
        { cognitoClient }
    >;

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
