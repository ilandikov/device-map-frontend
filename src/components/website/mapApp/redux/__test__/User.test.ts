import { user } from '../User';
import { itShouldAnswerBy } from '../../../../../redux/__test__/helpers';
import { loggedInUserError, loggedInUserSet, loggedInUserSetID } from '../LoggedInUserAction';
import { userRejectingClient, userResolvingClient } from './UserTestHelpers';

describe('user epic tests', () => {
    itShouldAnswerBy('setting user points', {
        epic: user,
        remoteClients: { usersClient: userResolvingClient },
        sentAction: loggedInUserSetID('testUserId'),
        expectedActions: [loggedInUserSet({ id: 'testUserId', points: 320 })],
    });

    itShouldAnswerBy('sending an error about a user login going wrong', {
        epic: user,
        remoteClients: { usersClient: userRejectingClient },
        sentAction: loggedInUserSetID('testUserId'),
        expectedActions: [loggedInUserError('could not get logged in user data')],
    });
});
