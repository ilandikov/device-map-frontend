import { T22User } from '@mancho-school-t22/graphql-types';
import { MapAppActionType } from './MapAppAction';

export type LoggedInUserAction =
    | MapAppSetLoggedInUserID
    | MapAppSetLoggedInUser
    | MapAppUpdateLoggedInUser
    | MapAppLoggedInUserReset
    | MapAppGetLoggedInUserError
    | MapAppUserUpdateSubscriptionRequest
    | MapAppSubscriptionError;

export interface MapAppLoggedInUserReset {
    type: MapAppActionType.LOGGED_IN_USER_RESET;
}

export function mapAppLoggedInUserReset(): MapAppLoggedInUserReset {
    return { type: MapAppActionType.LOGGED_IN_USER_RESET };
}

interface MapAppSetLoggedInUserID {
    type: MapAppActionType.SET_LOGGED_IN_USER_ID;
    id: string;
}

export function mapAppSetLoggedInUserID(id: string): MapAppSetLoggedInUserID {
    return { type: MapAppActionType.SET_LOGGED_IN_USER_ID, id };
}

interface MapAppSetLoggedInUser {
    type: MapAppActionType.SET_LOGGED_IN_USER;
    user: T22User;
}

export function mapAppSetLoggedInUser(user: T22User): MapAppSetLoggedInUser {
    return { type: MapAppActionType.SET_LOGGED_IN_USER, user };
}

interface MapAppGetLoggedInUserError {
    type: MapAppActionType.GET_LOGGED_IN_USER_ERROR;
    error: string;
}

export function mapAppGetLoggedInUserError(error: string): MapAppGetLoggedInUserError {
    return { type: MapAppActionType.GET_LOGGED_IN_USER_ERROR, error };
}

interface MapAppUserUpdateSubscriptionRequest {
    type: MapAppActionType.USER_UPDATE_SUBSCRIPTION_REQUEST;
}

export function mapAppUserUpdateSubscriptionRequest(): MapAppUserUpdateSubscriptionRequest {
    return { type: MapAppActionType.USER_UPDATE_SUBSCRIPTION_REQUEST };
}

interface MapAppUpdateLoggedInUser {
    type: MapAppActionType.UPDATE_LOGGED_IN_USER;
    user: T22User;
}

export function mapAppUpdateLoggedInUser(user: T22User): MapAppUpdateLoggedInUser {
    return { type: MapAppActionType.UPDATE_LOGGED_IN_USER, user };
}

interface MapAppSubscriptionError {
    type: MapAppActionType.SUBSCRIPTION_ERROR;
    error: string;
}

export function mapAppSubscriptionError(error: string): MapAppSubscriptionError {
    return { type: MapAppActionType.SUBSCRIPTION_ERROR, error };
}
