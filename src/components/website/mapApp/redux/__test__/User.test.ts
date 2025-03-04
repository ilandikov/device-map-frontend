import { mapAppAuthenticationCompleted, mapAppGetLoggedInUserError, mapAppSetLoggedInUser } from '../MapAppAction';
import { user } from '../User';
import { testEpicAnswerToAction } from '../../../../../redux/__test__/helpers';
import { userRejectingClient, userResolvingClient } from './UserTestHelpers';

describe('user epic tests', () => {
    it('should get user points', async () => {
        const scenario = {
            epic: user,
            remoteClients: { usersClient: userResolvingClient },
            partialRootState: {},
            sentAction: mapAppAuthenticationCompleted('testUserId'),
            expectedActions: [mapAppSetLoggedInUser({ id: 'testUserId', points: 320 })],
        };
        await testEpicAnswerToAction(scenario);
    });

    it('should report remote error', async () => {
        await testEpicAnswerToAction({
            epic: user,
            remoteClients: { usersClient: userRejectingClient },
            partialRootState: {},
            sentAction: mapAppAuthenticationCompleted('testUserId'),
            expectedActions: [mapAppGetLoggedInUserError('could not get logged in user data')],
        });
    });
});
