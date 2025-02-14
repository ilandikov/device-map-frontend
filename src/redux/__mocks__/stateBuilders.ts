import { StateObservable } from 'redux-observable';
import { EMPTY } from 'rxjs';
import { RootState } from '../store';
import { initialAuthenticationState } from '../../components/website/login/redux/AuthenticationState';
import { initialGetDevicesState } from '../../components/devices/getDevices/redux/reducer';
import { mapAppInitialState } from '../../components/website/mapApp/redux/MapAppState';

function buildInitialTestState(partialRootState: Partial<RootState>): RootState {
    return {
        authentication: { ...initialAuthenticationState, ...partialRootState.authentication },
        getDevices: { ...initialGetDevicesState, ...partialRootState.getDevices },
        mapAppState: { ...mapAppInitialState, ...partialRootState.mapAppState },
    };
}

export function buildTestStateObservable(partialRootState: Partial<RootState>): StateObservable<RootState> {
    return new StateObservable(EMPTY, buildInitialTestState(partialRootState));
}
