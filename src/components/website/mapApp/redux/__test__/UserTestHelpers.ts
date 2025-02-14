import { lastValueFrom, of, toArray } from 'rxjs';
import { UsersClient } from '../../../../../redux/store';
import { MapAppAction } from '../MapAppAction';
import { user } from '../User';
import { buildTestStateObservable } from '../../../../../redux/stateBuilders';

export const userResolvingClient = () => Promise.resolve({ id: 'testUserId', points: 320 });
export const userRejectingClient = () => Promise.reject('could not get logged in user data');

export async function testUserEpic(userClient: UsersClient, action: MapAppAction, expectedAction: MapAppAction) {
    const output$ = user(of(action), buildTestStateObservable({}), {
        usersClient: userClient,
    });

    const receivedAction = await lastValueFrom(output$.pipe(toArray()));
    expect(receivedAction).toEqual([expectedAction]);
}
