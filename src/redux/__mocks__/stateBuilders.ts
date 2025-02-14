import { StateObservable } from 'redux-observable';
import { EMPTY } from 'rxjs';
import { RootState } from '../store';
import {
    AuthenticationState,
    initialAuthenticationState,
} from '../../components/website/login/redux/AuthenticationState';
import { initialGetDevicesState } from '../../components/devices/getDevices/redux/reducer';
import { MapAppState, mapAppInitialState } from '../../components/website/mapApp/redux/MapAppState';

function buildInitialTestState(): RootState {
    return {
        authentication: initialAuthenticationState,
        getDevices: initialGetDevicesState,
        mapAppState: mapAppInitialState,
    };
}

// TODO remove this helpers and generalise buildTestStateObservable()
export function buildStateForCognitoTest(authentication: AuthenticationState): StateObservable<RootState> {
    return new StateObservable(EMPTY, {
        ...buildInitialTestState(),
        authentication,
    });
}

export function buildStateForDevicesTest(mapAppState: MapAppState): StateObservable<RootState> {
    return new StateObservable(EMPTY, { ...buildInitialTestState(), mapAppState });
}

export function buildTestStateObservable(): StateObservable<RootState> {
    return new StateObservable(EMPTY, buildInitialTestState());
}
