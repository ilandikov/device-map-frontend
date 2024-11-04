import { StateObservable } from 'redux-observable';
import { EMPTY } from 'rxjs';
import { RootState } from '../store';
import {
    AuthenticationState,
    initialAuthenticationState,
} from '../../components/website/login/redux/AuthenticationState';
import { initialGetDevicesState } from '../../components/devices/getDevices/redux/reducer';
import { mapAppInitialState } from '../../components/website/mapApp/redux/MapAppState';

function buildInitialTestState(): RootState {
    return {
        authentication: initialAuthenticationState,
        getDevices: initialGetDevicesState,
        mapAppState: mapAppInitialState,
    };
}

export function buildStateForCognitoTest(authentication: AuthenticationState): StateObservable<RootState> {
    return new StateObservable(EMPTY, {
        ...buildInitialTestState(),
        authentication,
    });
}

export function buildStateForDevicesTest(): StateObservable<RootState> {
    return new StateObservable(EMPTY, buildInitialTestState());
}

export function buildStateForGeoApifyTest(): StateObservable<RootState> {
    return new StateObservable(EMPTY, buildInitialTestState());
}
