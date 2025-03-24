import { T22User } from '@mancho-school-t22/graphql-types';
import { MapAppActionType } from './MapAppAction';

export enum LoggedInUserActionType {
    SET_USER = 'SET_USER',
    SET_ID = 'SET_ID',
    UPDATE_USER = 'UPDATE_USER',
    RESET_USER = 'RESET_USER',
    ERROR = 'ERROR',
    SUBSCRIPTION_REQUEST = 'SUBSCRIPTION_REQUEST',
    SUBSCRIPTION_ERROR = 'SUBSCRIPTION_ERROR',
}

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
    subType: LoggedInUserActionType.RESET_USER;
}

export function loggedInUserReset(): LoggedInUserReset {
    return { type: MapAppActionType.LOGGED_IN_USER_RESET, subType: LoggedInUserActionType.RESET_USER };
}

interface LoggedInUserSetID {
    type: MapAppActionType.LOGGED_IN_USER_SET_ID;
    subType: LoggedInUserActionType.SET_ID;
    id: string;
}

export function loggedInUserSetID(id: string): LoggedInUserSetID {
    return { type: MapAppActionType.LOGGED_IN_USER_SET_ID, subType: LoggedInUserActionType.SET_ID, id };
}

interface LoggedInUserSet {
    type: MapAppActionType.LOGGED_IN_USER_SET;
    subType: LoggedInUserActionType.SET_USER;
    user: T22User;
}

export function loggedInUserSet(user: T22User): LoggedInUserSet {
    return { type: MapAppActionType.LOGGED_IN_USER_SET, subType: LoggedInUserActionType.SET_USER, user };
}

interface LoggedInUserError {
    type: MapAppActionType.LOGGED_IN_USER_ERROR;
    subType: LoggedInUserActionType.ERROR;
    error: string;
}

export function loggedInUserError(error: string): LoggedInUserError {
    return { type: MapAppActionType.LOGGED_IN_USER_ERROR, subType: LoggedInUserActionType.ERROR, error };
}

interface LoggedInUserSubscriptionRequest {
    type: MapAppActionType.LOGGED_IN_USER_SUBSCRIPTION_REQUEST;
    subType: LoggedInUserActionType.SUBSCRIPTION_REQUEST;
}

export function loggedInUserSubscriptionRequest(): LoggedInUserSubscriptionRequest {
    return {
        type: MapAppActionType.LOGGED_IN_USER_SUBSCRIPTION_REQUEST,
        subType: LoggedInUserActionType.SUBSCRIPTION_REQUEST,
    };
}

interface LoggedInUserUpdate {
    type: MapAppActionType.LOGGED_IN_USER_UPDATE;
    subType: LoggedInUserActionType.UPDATE_USER;
    user: T22User;
}

export function loggedInUserUpdate(user: T22User): LoggedInUserUpdate {
    return { type: MapAppActionType.LOGGED_IN_USER_UPDATE, subType: LoggedInUserActionType.UPDATE_USER, user };
}

interface LoggedInUserSubscriptionError {
    type: MapAppActionType.LOGGED_IN_USER_SUBSCRIPTION_ERROR;
    subType: LoggedInUserActionType.SUBSCRIPTION_ERROR;
    error: string;
}

export function loggedInUserSubscriptionError(error: string): LoggedInUserSubscriptionError {
    return {
        type: MapAppActionType.LOGGED_IN_USER_SUBSCRIPTION_ERROR,
        subType: LoggedInUserActionType.SUBSCRIPTION_ERROR,
        error,
    };
}
