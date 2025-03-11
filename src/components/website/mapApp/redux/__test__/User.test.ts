import { mapAppGetLoggedInUserError, mapAppSetLoggedInUser, mapAppSetLoggedInUserID } from '../MapAppAction';
import { user } from '../User';
import { itShouldAnswerBy } from '../../../../../redux/__test__/helpers';
import { userRejectingClient, userResolvingClient } from './UserTestHelpers';

describe('user epic tests', () => {
    itShouldAnswerBy('setting user points', {
        epic: user,
        remoteClients: { usersClient: userResolvingClient },
        sentAction: mapAppSetLoggedInUserID('testUserId'),
        expectedActions: [mapAppSetLoggedInUser({ id: 'testUserId', points: 320 })],
    });

    itShouldAnswerBy('sending an error about a user login going wrong', {
        epic: user,
        remoteClients: { usersClient: userRejectingClient },
        sentAction: mapAppSetLoggedInUserID('testUserId'),
        expectedActions: [mapAppGetLoggedInUserError('could not get logged in user data')],
    });
});
