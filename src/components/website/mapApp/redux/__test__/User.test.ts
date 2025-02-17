import { mapAppAuthenticationCompleted, mapAppGetLoggedInUserError, mapAppSetLoggedInUser } from '../MapAppAction';
import { user } from '../User';
import { buildEpicTester } from '../../../../../redux/__test__/helpers';
import { userRejectingClient, userResolvingClient } from './UserTestHelpers';

const testUserEpic = buildEpicTester(user);

describe('user epic tests', () => {
    it('should get user points', async () => {
        const action = mapAppAuthenticationCompleted('testUserId');
        const expectedAction = mapAppSetLoggedInUser({ id: 'testUserId', points: 320 });

        await testUserEpic({ usersClient: userResolvingClient }, {}, action, [expectedAction]);
    });

    it('should report remote error', async () => {
        const action = mapAppAuthenticationCompleted('testUserId');
        const expectedAction = mapAppGetLoggedInUserError('could not get logged in user data');

        await testUserEpic({ usersClient: userRejectingClient }, {}, action, [expectedAction]);
    });
});
