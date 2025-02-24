import { deviceCreationSubscriptionRequest, deviceRemoteError, updateDevice } from '../DeviceAction';
import { buildEpicTester } from '../../../../../redux/__test__/helpers';
import { deviceSubscriptions } from '../deviceSubscriptions';
import { rejectingDeviceSubscriptionClient, resolvingDeviceSubscriptionClient } from './deviceSubscriptionHelpers';

const testDeviceSubscriptionsEpic = buildEpicTester(deviceSubscriptions);

describe('device subscription - creation', () => {
    it('should receive new device after ', async () => {
        const sentAction = deviceCreationSubscriptionRequest('id-to-be-created');
        const expectedAction = updateDevice({
            id: 'id-to-be-created',
            creatorID: 'created-from-subscription',
            createdDate: 12345678000,
            lastUpdate: 23456789000,
            location: { lat: 9, lon: 5 },
            approvals: 4,
        });

        await testDeviceSubscriptionsEpic(
            {
                deviceSubscriptionClient: resolvingDeviceSubscriptionClient,
            },
            {},
            sentAction,
            [expectedAction],
        );
    });

    it('should notify about the error', async () => {
        const sentAction = deviceCreationSubscriptionRequest('id-to-be-created');
        const expectedAction = deviceRemoteError('could not subscribe to device update');

        await testDeviceSubscriptionsEpic(
            {
                deviceSubscriptionClient: rejectingDeviceSubscriptionClient,
            },
            {},
            sentAction,
            [expectedAction],
        );
    });
});
