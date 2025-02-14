import { StateObservable } from 'redux-observable';
import { EMPTY } from 'rxjs';
import { buildAuthenticationState } from '../components/website/login/redux/AuthenticationState';
import { buildMapAppState } from '../components/website/mapApp/redux/MapAppState';
import { RootState } from './store';

export type ShallowPartial<T> = { [K in keyof T]?: Partial<T[K]> };

export function buildInitialTestState(partialRootState: ShallowPartial<RootState>): RootState {
    return {
        authentication: buildAuthenticationState(partialRootState.authentication),
        mapAppState: buildMapAppState(partialRootState.mapAppState),
    };
}

export function buildTestStateObservable(partialRootState: ShallowPartial<RootState>): StateObservable<RootState> {
    return new StateObservable(EMPTY, buildInitialTestState(partialRootState));
}
