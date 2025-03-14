import { UsersClient } from '../../../../../redux/store';

export const userResolvingClient: UsersClient = {
    getUser: () => Promise.resolve({ user: { id: 'testUserId', points: 320 } }),
    subscribeForUpdate: (id) => (subscriber) => {
        subscriber.next({
            id,
            points: 100,
        });
        subscriber.complete();

        return () => subscriber.unsubscribe();
    },
};
export const userRejectingClient: UsersClient = {
    getUser: () => Promise.reject('could not get logged in user data'),
    subscribeForUpdate: () => (subscriber) => {
        subscriber.error();
        subscriber.complete();

        return () => subscriber.unsubscribe();
    },
};
