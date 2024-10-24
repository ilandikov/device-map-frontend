import { EMPTY, lastValueFrom, of, toArray } from 'rxjs';
import { StateObservable } from 'redux-observable';
import { MapAppAction } from '../../../mapApp/redux/MapAppAction';
import { devices } from '../devices';
import { initialGetDevicesState } from '../../../../devices/getDevices/redux/reducer';
import { mapAppInitialState } from '../../../mapApp/redux/MapAppState';
import { authenticationInitialState } from '../LoginModalAuthenticationState';
import { RootState } from '../../../../../redux/store';

export function buildInitialTestState(): RootState {
    return {
        loginModalAuthentication: authenticationInitialState,
        getDevices: initialGetDevicesState,
        mapAppState: mapAppInitialState,
    };
}

export async function testDevicesEpic(sentAction: MapAppAction, expectedActions: MapAppAction[]) {
    const initialRootState = buildInitialTestState();
    const output$ = devices(of(sentAction), new StateObservable(EMPTY, initialRootState), { cognitoClient: {} });
    const receivedAction = await lastValueFrom(output$.pipe(toArray()));
    expect(receivedAction).toEqual(expectedActions);
}
