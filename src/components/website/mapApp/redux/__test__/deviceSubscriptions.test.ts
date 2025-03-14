import { deviceCreated, deviceCreation, deviceCreationSubscriptionRequest, deviceRemoteError } from '../DeviceAction';
import { itShouldAnswerBy } from '../../../../../redux/__test__/helpers';
import { deviceSubscriptions } from '../deviceSubscriptions';
import { rejectingDeviceSubscriptionClient, resolvingDeviceSubscriptionClient } from './deviceSubscriptionHelpers';
import { rejectingDevicesClient, resolvingDevicesClient } from './devicesTestHelpers';

describe('device subscription - creation', () => {
    itShouldAnswerBy('updating device', {
        epic: deviceSubscriptions,
        partialRootState: { mapAppState: { loggedInUser: { id: 'i will create subscription', points: 0 } } },
        remoteClients: {
            deviceSubscriptionClient: resolvingDeviceSubscriptionClient,
            devicesClient: resolvingDevicesClient,
        },
        sentAction: deviceCreationSubscriptionRequest(),
        expectedActions: [
            deviceCreated({
                id: 'device-created-by-subscription',
                creatorID: 'i will create subscription',
                createdDate: 12345678000,
                lastUpdate: 23456789000,
                location: { lat: 9, lon: 5 },
                approvals: 4,
            }),
            deviceCreation(false),
        ],
    });

    itShouldAnswerBy('updating device', {
        epic: deviceSubscriptions,
        partialRootState: { mapAppState: { loggedInUser: { id: 'i will create subscription', points: 0 } } },
        remoteClients: {
            deviceSubscriptionClient: rejectingDeviceSubscriptionClient,
            devicesClient: rejectingDevicesClient,
        },
        sentAction: deviceCreationSubscriptionRequest(),
        expectedActions: [deviceRemoteError('could not subscribe to device update'), deviceCreation(false)],
    });
});
