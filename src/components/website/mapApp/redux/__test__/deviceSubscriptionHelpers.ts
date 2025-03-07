import { Observable } from 'rxjs';
import { DeviceSubscriptionClient } from '../../../../../redux/store';

export const resolvingDeviceSubscriptionClient: DeviceSubscriptionClient = (id) =>
    new Observable((subscriber) => {
        subscriber.next({
            T22OnDeviceCreation: {
                id,
                creatorID: 'created-from-subscription',
                createdDate: 12345678000,
                lastUpdate: 23456789000,
                location: { lat: 9, lon: 5 },
                approvals: 4,
            },
        });
        subscriber.complete();

        return () => subscriber.unsubscribe();
    });

export const rejectingDeviceSubscriptionClient: DeviceSubscriptionClient = () =>
    new Observable((subscriber) => {
        subscriber.error();
        subscriber.complete();

        return () => subscriber.unsubscribe();
    });
