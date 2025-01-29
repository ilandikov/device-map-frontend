import { mapAppGetUserPoints, mapAppGetUserPointsError, mapAppSetUserPoints } from '../../../mapApp/redux/MapAppAction';
import { testUserEpic, userRejectingClient, userResolvingClient } from './UserTestHelpers';

describe('user epic tests', () => {
    it('should get user points', async () => {
        const action = mapAppGetUserPoints();
        const expectedAction = mapAppSetUserPoints(320);

        await testUserEpic(userResolvingClient, action, expectedAction);
    });

    it('should report remote error', async () => {
        const action = mapAppGetUserPoints();
        const expectedAction = mapAppGetUserPointsError('could not get user points');

        await testUserEpic(userRejectingClient, action, expectedAction);
    });
});
