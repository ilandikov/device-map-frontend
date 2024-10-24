import { EMPTY, lastValueFrom, of, toArray } from 'rxjs';
import { StateObservable } from 'redux-observable';
import { MapAppAction } from '../../../mapApp/redux/MapAppAction';
import { devices } from '../devices';
import { initialGetDevicesState } from '../../../../devices/getDevices/redux/reducer';
import { mapAppInitialState } from '../../../mapApp/redux/MapAppState';
import { authenticationInitialState } from '../LoginModalAuthenticationState';

export async function testDevicesEpic(sentAction: MapAppAction, expectedActions: MapAppAction[]) {
    const output$ = devices(
        of(sentAction),
        new StateObservable(EMPTY, {
            loginModalAuthentication: authenticationInitialState,
            getDevices: initialGetDevicesState,
            mapAppState: mapAppInitialState,
        }),
        { cognitoClient: {} },
    );
    const receivedAction = await lastValueFrom(output$.pipe(toArray()));
    expect(receivedAction).toEqual(expectedActions);
}
