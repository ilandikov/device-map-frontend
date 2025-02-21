import { Observable } from 'rxjs';
import { DeviceSubscriptionClient } from '../../../../../redux/store';

export const resolvingDeviceSubscriptionClient: DeviceSubscriptionClient = (id) =>
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
    });

export const rejectingDeviceSubscriptionClient: DeviceSubscriptionClient = () =>
    new Observable((subscriber) => {
        subscriber.error();
        subscriber.complete();

        return () => {
            subscriber.unsubscribe();
        };
    });
