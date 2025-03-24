import { itShouldAnswerBy } from '../../../../../redux/__test__/helpers';
import { userSubscriptions } from '../userSubscriptions';
import {
    loggedInUserSubscriptionError,
    loggedInUserSubscriptionRequest,
    loggedInUserUpdate,
} from '../LoggedInUserAction';
import { userRejectingClient, userResolvingClient } from './UserTestHelpers';

describe('user subscription', () => {
    itShouldAnswerBy('providing user data', {
        epic: userSubscriptions,
        partialRootState: { mapAppState: { loggedInUser: { id: 'i am waiting to receive points', points: 0 } } },
        remoteClients: { usersClient: userResolvingClient },
        sentAction: loggedInUserSubscriptionRequest(),
        expectedActions: [loggedInUserUpdate({ id: 'i am waiting to receive points', points: 100 })],
    });

    itShouldAnswerBy('sending error', {
        epic: userSubscriptions,
        partialRootState: { mapAppState: { loggedInUser: { id: 'i will create subscription', points: 0 } } },
        remoteClients: { usersClient: userRejectingClient },
        sentAction: loggedInUserSubscriptionRequest(),
        expectedActions: [loggedInUserSubscriptionError('could not subscribe to user update')],
    });
});
