import { UsersClient } from '../../../../../redux/store';

export const userResolvingClient: UsersClient = {
    getUser: () => Promise.resolve({ user: { id: 'testUserId', points: 320 } }),
};
export const userRejectingClient: UsersClient = { getUser: () => Promise.reject('could not get logged in user data') };
