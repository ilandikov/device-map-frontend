import { StateObservable } from 'redux-observable';
import { EMPTY } from 'rxjs';
import { RootState } from '../store';
import { initialAuthenticationState } from '../../components/website/login/redux/AuthenticationState';
import { initialGetDevicesState } from '../../components/devices/getDevices/redux/reducer';
import { mapAppInitialState } from '../../components/website/mapApp/redux/MapAppState';

function buildInitialTestState(partialRootState: Partial<RootState>): RootState {
    return {
        authentication: initialAuthenticationState,
        getDevices: initialGetDevicesState,
        mapAppState: mapAppInitialState,
        ...partialRootState,
    };
}

export function buildTestStateObservable(partialRootState: Partial<RootState>): StateObservable<RootState> {
    return new StateObservable(EMPTY, buildInitialTestState(partialRootState));
}
