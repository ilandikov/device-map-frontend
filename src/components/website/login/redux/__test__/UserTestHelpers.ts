import { Observable, lastValueFrom, toArray } from 'rxjs';
import { UserClient } from '../../../../../redux/store';
import { MapAppAction } from '../../../mapApp/redux/MapAppAction';
import { buildMapAppState } from '../../../mapApp/redux/MapAppState';
import { user } from '../User';
import { buildStateForDevicesTest } from '../../../../../redux/__mocks__/stateBuilders';

export const userResolvingClient = () => Promise.resolve({ points: 320 });
export const userRejectingClient = () => Promise.reject('could not get user points');

export async function testUserEpic(
    userClient: UserClient,
    action: Observable<MapAppAction>,
    expectedAction: MapAppAction,
) {
    const initialState = buildMapAppState({});
    const output$ = user(action, buildStateForDevicesTest(initialState), {
        userClient,
    });

    const receivedAction = await lastValueFrom(output$.pipe(toArray()));
    expect(receivedAction).toEqual([expectedAction]);
}
