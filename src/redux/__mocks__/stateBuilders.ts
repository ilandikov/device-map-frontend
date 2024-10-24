import { StateObservable } from 'redux-observable';
import { EMPTY } from 'rxjs';
import { RootState } from '../store';
import {
    LoginModalAuthenticationState,
    authenticationInitialState,
} from '../../components/website/login/redux/LoginModalAuthenticationState';
import { initialGetDevicesState } from '../../components/devices/getDevices/redux/reducer';
import { mapAppInitialState } from '../../components/website/mapApp/redux/MapAppState';

function buildInitialTestState(): RootState {
    return {
        loginModalAuthentication: authenticationInitialState,
        getDevices: initialGetDevicesState,
        mapAppState: mapAppInitialState,
    };
}

export function buildStateForCognitoTest(loginModalAuthentication: LoginModalAuthenticationState) {
    return new StateObservable(EMPTY, {
        ...buildInitialTestState(),
        loginModalAuthentication,
    });
}

export function buildStateForDevicesTest() {
    return new StateObservable(EMPTY, buildInitialTestState());
}
