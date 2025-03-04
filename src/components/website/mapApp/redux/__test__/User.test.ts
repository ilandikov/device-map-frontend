import { mapAppAuthenticationCompleted, mapAppGetLoggedInUserError, mapAppSetLoggedInUser } from '../MapAppAction';
import { user } from '../User';
import { buildEpicTester } from '../../../../../redux/__test__/helpers';
import { AllActions, RemoteClients, RootEpic } from '../../../../../redux/store';
import { userRejectingClient, userResolvingClient } from './UserTestHelpers';

async function testEpicAnswerToAction({
    epic,
    clients,
    partialRootState,
    sentAction,
    expectedActions,
}: {
    epic: RootEpic;
    clients: RemoteClients;
    partialRootState: {};
    sentAction: AllActions;
    expectedActions: AllActions[];
}) {
    await buildEpicTester(epic)(clients, partialRootState, sentAction, expectedActions);
}

describe('user epic tests', () => {
    it('should get user points', async () => {
        const action = mapAppAuthenticationCompleted('testUserId');
        const expectedAction = mapAppSetLoggedInUser({ id: 'testUserId', points: 320 });

        await testEpicAnswerToAction({
            epic: user,
            clients: { usersClient: userResolvingClient },
            partialRootState: {},
            sentAction: action,
            expectedActions: [expectedAction],
        });
    });

    it('should report remote error', async () => {
        const action = mapAppAuthenticationCompleted('testUserId');
        const expectedAction = mapAppGetLoggedInUserError('could not get logged in user data');

        await buildEpicTester(user)({ usersClient: userRejectingClient }, {}, action, [expectedAction]);
    });
});
