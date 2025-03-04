import { mapAppAuthenticationCompleted, mapAppGetLoggedInUserError, mapAppSetLoggedInUser } from '../MapAppAction';
import { user } from '../User';
import { EpicTest, testEpicAnswerToAction } from '../../../../../redux/__test__/helpers';
import { userRejectingClient, userResolvingClient } from './UserTestHelpers';

function itShouldAnswerBy(testName: string, scenario: EpicTest) {
    it(testName, async () => {
        await testEpicAnswerToAction(scenario);
    });
}

describe('user epic tests', () => {
    itShouldAnswerBy('setting user points', {
        epic: user,
        remoteClients: { usersClient: userResolvingClient },
        partialRootState: {},
        sentAction: mapAppAuthenticationCompleted('testUserId'),
        expectedActions: [mapAppSetLoggedInUser({ id: 'testUserId', points: 320 })],
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
