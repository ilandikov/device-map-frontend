import {
    mapAppGetLoggedInUser,
    mapAppGetLoggedInUserError,
    mapAppSetLoggedInUser,
} from '../../../mapApp/redux/MapAppAction';
import { testUserEpic, userRejectingClient, userResolvingClient } from './UserTestHelpers';

describe('user epic tests', () => {
    it('should get user points', async () => {
        const action = mapAppGetLoggedInUser();
        const expectedAction = mapAppSetLoggedInUser({ id: 'testUserId', points: 320 });

        await testUserEpic(userResolvingClient, action, expectedAction);
    });

    it('should report remote error', async () => {
        const action = mapAppGetLoggedInUser();
        const expectedAction = mapAppGetLoggedInUserError('could not get logged in user data');

        await testUserEpic(userRejectingClient, action, expectedAction);
    });
});
