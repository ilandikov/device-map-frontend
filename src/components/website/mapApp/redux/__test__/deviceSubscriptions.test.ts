import { deviceCreated2, deviceCreationSubscriptionRequest, deviceRemoteError } from '../DeviceAction';
import { buildEpicTester } from '../../../../../redux/__test__/helpers';
import { deviceSubscriptions } from '../deviceSubscriptions';
import { rejectingDeviceSubscriptionClient, resolvingDeviceSubscriptionClient } from './deviceSubscriptionHelpers';

const testDeviceSubscriptionsEpic = buildEpicTester(deviceSubscriptions);

describe('device subscription - creation', () => {
    it('should receive new device after ', async () => {
        const sentAction = deviceCreationSubscriptionRequest('id-to-be-created');
        const expectedAction = deviceCreated2({
            id: 'id-to-be-created',
            creatorID: 'created-from-subscription',
            createdDate: 12345678000,
            lastUpdate: 12345678000,
            location: { lat: 9, lon: 5 },
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
