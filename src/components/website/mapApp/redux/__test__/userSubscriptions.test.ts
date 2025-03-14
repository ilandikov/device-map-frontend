import { itShouldAnswerBy } from '../../../../../redux/__test__/helpers';
import { userSubscriptions } from '../userSubscriptions';
import {
    mapAppSubscriptionError,
    mapAppUpdateLoggedInUser,
    mapAppUserUpdateSubscriptionRequest,
} from '../MapAppAction';
import { rejectingDeviceSubscriptionClient, resolvingDeviceSubscriptionClient } from './deviceSubscriptionHelpers';

describe('user subscription', () => {
    itShouldAnswerBy('providing user data', {
        epic: userSubscriptions,
        partialRootState: { mapAppState: { loggedInUser: { id: 'i am waiting to receive points', points: 0 } } },
        remoteClients: { deviceSubscriptionClient: resolvingDeviceSubscriptionClient },
        sentAction: mapAppUserUpdateSubscriptionRequest(),
        expectedActions: [mapAppUpdateLoggedInUser({ id: 'i am waiting to receive points', points: 100 })],
    });

    itShouldAnswerBy('sending error', {
        epic: userSubscriptions,
        partialRootState: { mapAppState: { loggedInUser: { id: 'i will create subscription', points: 0 } } },
        remoteClients: { deviceSubscriptionClient: rejectingDeviceSubscriptionClient },
        sentAction: mapAppUserUpdateSubscriptionRequest(),
        expectedActions: [mapAppSubscriptionError('could not subscribe to user update')],
    });
});
