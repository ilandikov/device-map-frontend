import { mapAppAuthenticationCompleted, mapAppGetLoggedInUserError, mapAppSetLoggedInUser } from '../MapAppAction';
import { user } from '../User';
import { EpicTest, testEpicAnswerToAction } from '../../../../../redux/__test__/helpers';
import { userRejectingClient, userResolvingClient } from './UserTestHelpers';

function itShouldAnswerWithActions(scenario: EpicTest) {
    it('should get user points', async () => {
        await testEpicAnswerToAction(scenario);
    });
}

describe('user epic tests', () => {
    const scenario = {
        epic: user,
        remoteClients: { usersClient: userResolvingClient },
        partialRootState: {},
        sentAction: mapAppAuthenticationCompleted('testUserId'),
        expectedActions: [mapAppSetLoggedInUser({ id: 'testUserId', points: 320 })],
    };
    itShouldAnswerWithActions(scenario);

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
