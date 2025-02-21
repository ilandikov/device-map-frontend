import { Observable } from 'rxjs';
import { deviceCreated2, deviceCreationSubscriptionRequest, deviceRemoteError } from '../DeviceAction';
import { buildEpicTester } from '../../../../../redux/__test__/helpers';
import { deviceSubscriptions } from '../deviceSubscriptions';

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
                project: (id) =>
                    new Observable((subscriber) => {
                        subscriber.next({
                            T22OnDeviceCreation: {
                                id,
                                creatorID: 'created-from-subscription',
                                createdDate: 12345678000,
                                lastUpdate: 12345678000,
                                location: { lat: 9, lon: 5 },
                            },
                        });
                        subscriber.complete();

                        return () => {
                            subscriber.unsubscribe();
                        };
                    }),
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
                project: () =>
                    new Observable((subscriber) => {
                        subscriber.error();
                        subscriber.complete();

                        return () => {
                            subscriber.unsubscribe();
                        };
                    }),
            },
            {},
            sentAction,
            [expectedAction],
        );
    });
});
