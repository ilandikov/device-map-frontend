import { T22User } from '@mancho-school-t22/graphql-types';
import { MapAppActionType } from './MapAppAction';

export type LoggedInUserAction =
    | LoggedInUserSetID
    | LoggedInUserSet
    | LoggedInUserUpdate
    | LoggedInUserReset
    | LoggedInUserError
    | LoggedInUserSubscriptionRequest
    | LoggedInUserSubscriptionError;

export interface LoggedInUserReset {
    type: MapAppActionType.LOGGED_IN_USER_RESET;
}

export function loggedInUserReset(): LoggedInUserReset {
    return { type: MapAppActionType.LOGGED_IN_USER_RESET };
}

interface LoggedInUserSetID {
    type: MapAppActionType.LOGGED_IN_USER_SET_ID;
    id: string;
}

export function loggedInUserSetID(id: string): LoggedInUserSetID {
    return { type: MapAppActionType.LOGGED_IN_USER_SET_ID, id };
}

interface LoggedInUserSet {
    type: MapAppActionType.LOGGED_IN_USER_SET;
    user: T22User;
}

export function loggedInUserSet(user: T22User): LoggedInUserSet {
    return { type: MapAppActionType.LOGGED_IN_USER_SET, user };
}

interface LoggedInUserError {
    type: MapAppActionType.LOGGED_IN_USER_ERROR;
    error: string;
}

export function loggedInUserError(error: string): LoggedInUserError {
    return { type: MapAppActionType.LOGGED_IN_USER_ERROR, error };
}

interface LoggedInUserSubscriptionRequest {
    type: MapAppActionType.LOGGED_IN_USER_SUBSCRIPTION_REQUEST;
}

export function loggedInUserSubscriptionRequest(): LoggedInUserSubscriptionRequest {
    return { type: MapAppActionType.LOGGED_IN_USER_SUBSCRIPTION_REQUEST };
}

interface LoggedInUserUpdate {
    type: MapAppActionType.LOGGED_IN_USER_UPDATE;
    user: T22User;
}

export function loggedInUserUpdate(user: T22User): LoggedInUserUpdate {
    return { type: MapAppActionType.LOGGED_IN_USER_UPDATE, user };
}

interface LoggedInUserSubscriptionError {
    type: MapAppActionType.LOGGED_IN_USER_SUBSCRIPTION_ERROR;
    error: string;
}

export function loggedInUserSubscriptionError(error: string): LoggedInUserSubscriptionError {
    return { type: MapAppActionType.LOGGED_IN_USER_SUBSCRIPTION_ERROR, error };
}
