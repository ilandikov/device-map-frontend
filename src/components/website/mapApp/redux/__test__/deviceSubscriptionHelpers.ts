import { DeviceSubscriptionClient } from '../../../../../redux/store';

export const resolvingDeviceSubscriptionClient: DeviceSubscriptionClient = (id) => (subscriber) => {
    subscriber.next({
        T22OnDeviceCreation2: {
            id: 'device-created-by-subscription',
            creatorID: id,
            createdDate: 12345678000,
            lastUpdate: 23456789000,
            location: { lat: 9, lon: 5 },
            approvals: 4,
        },
    });
    subscriber.complete();

    return () => subscriber.unsubscribe();
};

export const rejectingDeviceSubscriptionClient: DeviceSubscriptionClient = () => (subscriber) => {
    subscriber.error();
    subscriber.complete();

    return () => subscriber.unsubscribe();
};
