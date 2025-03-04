import { lastValueFrom, of, toArray } from 'rxjs';
import { mapAppAuthenticationCompleted, mapAppGetLoggedInUserError, mapAppSetLoggedInUser } from '../MapAppAction';
import { user } from '../User';
import { AllActions, RemoteClients, RootEpic, RootState } from '../../../../../redux/store';
import { ShallowPartial, buildTestStateObservable } from '../../../../../redux/__mocks__/state';
import { userRejectingClient, userResolvingClient } from './UserTestHelpers';

async function testEpicAnswerToAction({
    epic,
    remoteClients,
    partialRootState,
    sentAction,
    expectedActions,
}: {
    epic: RootEpic;
    remoteClients: RemoteClients;
    partialRootState: ShallowPartial<RootState>;
    sentAction: AllActions;
    expectedActions: AllActions[];
}) {
    const output$ = epic(of(sentAction), buildTestStateObservable(partialRootState), remoteClients);

    const receivedAction = await lastValueFrom(output$.pipe(toArray()));

    expect(receivedAction).toEqual(expectedActions);
}

describe('user epic tests', () => {
    it('should get user points', async () => {
        await testEpicAnswerToAction({
            epic: user,
            remoteClients: { usersClient: userResolvingClient },
            partialRootState: {},
            sentAction: mapAppAuthenticationCompleted('testUserId'),
            expectedActions: [mapAppSetLoggedInUser({ id: 'testUserId', points: 320 })],
        });
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
