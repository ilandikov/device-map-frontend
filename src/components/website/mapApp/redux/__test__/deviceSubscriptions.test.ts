import { deviceCreationSubscriptionRequest, deviceRemoteError, updateDevice } from '../DeviceAction';
import { itShouldAnswerBy } from '../../../../../redux/__test__/helpers';
import { deviceSubscriptions } from '../deviceSubscriptions';
import { rejectingDeviceSubscriptionClient, resolvingDeviceSubscriptionClient } from './deviceSubscriptionHelpers';

describe('device subscription - creation', () => {
    itShouldAnswerBy('updating device', {
        epic: deviceSubscriptions,
        partialRootState: { mapAppState: { loggedInUser: { id: 'i will create subscription', points: 0 } } },
        remoteClients: { deviceSubscriptionClient: resolvingDeviceSubscriptionClient },
        sentAction: deviceCreationSubscriptionRequest('i will create subscription'),
        expectedActions: [
            updateDevice({
                id: 'device-created-by-subscription',
                creatorID: 'i will create subscription',
                createdDate: 12345678000,
                lastUpdate: 23456789000,
                location: { lat: 9, lon: 5 },
                approvals: 4,
            }),
        ],
    });

    itShouldAnswerBy('updating device', {
        epic: deviceSubscriptions,
        partialRootState: { mapAppState: { loggedInUser: { id: 'i will create subscription', points: 0 } } },
        remoteClients: { deviceSubscriptionClient: rejectingDeviceSubscriptionClient },
        sentAction: deviceCreationSubscriptionRequest('id-to-be-created'),
        expectedActions: [deviceRemoteError('could not subscribe to device update')],
    });
});
