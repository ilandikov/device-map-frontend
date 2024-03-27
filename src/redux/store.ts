/* External dependencies */
import { Store, applyMiddleware, combineReducers, createStore as createReduxStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import { combineEpics, createEpicMiddleware } from 'redux-observable';

/* Local dependencies */
import { useDispatch } from 'react-redux';
import getDevices from '../components/devices/getDevices/redux/reducer';
import { MapAppReducer } from '../components/website/mapApp/MapAppReducer';
import { authentication } from '../components/website/login/redux/reducer';
import { cognito } from '../components/website/login/redux/epic';

const rootEpic = combineEpics(cognito);

const rootReducer = combineReducers({
    getDevices,
    mapAppState: MapAppReducer,
    authentication,
});

let store;

export function createStore(): Store {
    const epicMiddleware = createEpicMiddleware();
    // @ts-ignore
    store = createReduxStore(rootReducer, composeWithDevTools(applyMiddleware(epicMiddleware)));

    epicMiddleware.run(rootEpic);

    return store;
}

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
