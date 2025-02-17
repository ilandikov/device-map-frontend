import { UsersClient } from '../../../../../redux/store';
import { MapAppAction } from '../MapAppAction';
import { user } from '../User';
import { buildEpicTester } from './devicesTestHelpers';

export const userResolvingClient: UsersClient = { getUser: () => Promise.resolve({ id: 'testUserId', points: 320 }) };
export const userRejectingClient: UsersClient = { getUser: () => Promise.reject('could not get logged in user data') };

export async function testUserEpic(userClient: UsersClient, action: MapAppAction, expectedAction: MapAppAction) {
    const testUserEpic = buildEpicTester(user);
    await testUserEpic({ usersClient: userClient }, {}, action, [expectedAction]);
}
