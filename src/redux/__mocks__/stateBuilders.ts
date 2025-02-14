import { StateObservable } from 'redux-observable';
import { EMPTY } from 'rxjs';
import { RootState } from '../store';
import { buildAuthenticationState } from '../../components/website/login/redux/AuthenticationState';
import { initialGetDevicesState } from '../../components/devices/getDevices/redux/reducer';
import { buildMapAppState } from '../../components/website/mapApp/redux/MapAppState';

type ShallowPartial<T> = { [K in keyof T]?: Partial<T[K]> };

function buildInitialTestState(partialRootState: ShallowPartial<RootState>): RootState {
    return {
        authentication: buildAuthenticationState(partialRootState.authentication),
        getDevices: { ...initialGetDevicesState, ...partialRootState.getDevices },
        mapAppState: { ...buildMapAppState(partialRootState.mapAppState) },
    };
}

export function buildTestStateObservable(partialRootState: ShallowPartial<RootState>): StateObservable<RootState> {
    return new StateObservable(EMPTY, buildInitialTestState(partialRootState));
}
