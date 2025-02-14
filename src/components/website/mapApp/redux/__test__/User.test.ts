import { mapAppAuthenticationCompleted, mapAppGetLoggedInUserError, mapAppSetLoggedInUser } from '../MapAppAction';
import { testUserEpic, userRejectingClient, userResolvingClient } from './UserTestHelpers';

describe('user epic tests', () => {
    it('should get user points', async () => {
        const action = mapAppAuthenticationCompleted('testUserId');
        const expectedAction = mapAppSetLoggedInUser({ id: 'testUserId', points: 320 });

        await testUserEpic(userResolvingClient, action, expectedAction);
    });

    it('should report remote error', async () => {
        const action = mapAppAuthenticationCompleted('testUserId');
        const expectedAction = mapAppGetLoggedInUserError('could not get logged in user data');

        await testUserEpic(userRejectingClient, action, expectedAction);
    });
});
