import { StateObservable } from 'redux-observable';
import { EMPTY } from 'rxjs';
import { RootState } from '../store';
import {
    buildAuthenticationState,
    initialAuthenticationState,
} from '../../components/website/login/redux/AuthenticationState';
import { initialGetDevicesState } from '../../components/devices/getDevices/redux/reducer';
import { buildMapAppState, mapAppInitialState } from '../../components/website/mapApp/redux/MapAppState';

type ShallowPartial<T> = { [K in keyof T]?: Partial<T[K]> };

function buildInitialTestState(partialRootState: ShallowPartial<RootState>): RootState {
    return {
        authentication: { ...initialAuthenticationState, ...buildAuthenticationState(partialRootState.authentication) },
        getDevices: { ...initialGetDevicesState, ...partialRootState.getDevices },
        mapAppState: { ...mapAppInitialState, ...buildMapAppState(partialRootState.mapAppState) },
    };
}

export function buildTestStateObservable(partialRootState: ShallowPartial<RootState>): StateObservable<RootState> {
    return new StateObservable(EMPTY, buildInitialTestState(partialRootState));
}
