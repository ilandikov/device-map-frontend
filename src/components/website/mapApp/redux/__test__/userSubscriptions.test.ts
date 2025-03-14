import { itShouldAnswerBy } from '../../../../../redux/__test__/helpers';
import { userSubscriptions } from '../userSubscriptions';
import {
    mapAppSubscriptionError,
    mapAppUpdateLoggedInUser,
    mapAppUserUpdateSubscriptionRequest,
} from '../MapAppAction';
import { userRejectingClient, userResolvingClient } from './UserTestHelpers';

describe('user subscription', () => {
    itShouldAnswerBy('providing user data', {
        epic: userSubscriptions,
        partialRootState: { mapAppState: { loggedInUser: { id: 'i am waiting to receive points', points: 0 } } },
        remoteClients: { usersClient: userResolvingClient },
        sentAction: mapAppUserUpdateSubscriptionRequest(),
        expectedActions: [mapAppUpdateLoggedInUser({ id: 'i am waiting to receive points', points: 100 })],
    });

    itShouldAnswerBy('sending error', {
        epic: userSubscriptions,
        partialRootState: { mapAppState: { loggedInUser: { id: 'i will create subscription', points: 0 } } },
        remoteClients: { usersClient: userRejectingClient },
        sentAction: mapAppUserUpdateSubscriptionRequest(),
        expectedActions: [mapAppSubscriptionError('could not subscribe to user update')],
    });
});
