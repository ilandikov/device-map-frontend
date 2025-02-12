import { lastValueFrom, of, toArray } from 'rxjs';
import { UsersClient } from '../../../../../redux/store';
import { MapAppAction } from '../../../mapApp/redux/MapAppAction';
import { buildMapAppState } from '../../../mapApp/redux/MapAppState';
import { user } from '../User';
import { buildStateForDevicesTest } from '../../../../../redux/__mocks__/stateBuilders';

export const userResolvingClient = () => Promise.resolve({ id: 'testUserId', points: 320 });
export const userRejectingClient = () => Promise.reject('could not get logged in user data');

export async function testUserEpic(userClient: UsersClient, action: MapAppAction, expectedAction: MapAppAction) {
    const initialState = buildMapAppState({});
    const output$ = user(of(action), buildStateForDevicesTest(initialState), {
        usersClient: userClient,
    });

    const receivedAction = await lastValueFrom(output$.pipe(toArray()));
    expect(receivedAction).toEqual([expectedAction]);
}
