import { T22Address, T22Location, T22User } from '@mancho-school-t22/graphql-types';
import { MapAppComponents } from './MapAppState';
import { DeviceAction } from './DeviceAction';

export enum MapAppActionType {
    LOGIN_MODAL_CLOSE = 'LOGIN_MODAL_CLOSE',
    LOGGED_IN_USER_RESET = 'LOGGED_IN_USER_RESET',
    SET_LOGGED_IN_USER_ID = 'SET_LOGGED_IN_USER_ID',
    SET_LOCATION_COORDINATES = 'SET_LOCATION_COORDINATES',
    GET_LOCATION_ADDRESS = 'GET_LOCATION_ADDRESS',
    SET_LOCATION_ADDRESS = 'SET_LOCATION_ADDRESS',
    SET_LOGGED_IN_USER = 'SET_LOGGED_IN_USER',
    GET_LOGGED_IN_USER_ERROR = 'GET_LOGGED_IN_USER_ERROR',
    UPDATE_LOGGED_IN_USER = 'UPDATE_LOGGED_IN_USER',
    SHOW_COMPONENT = 'SHOW_COMPONENT',
    USER_UPDATE_SUBSCRIPTION_REQUEST = 'USER_UPDATE_SUBSCRIPTION_REQUEST',
    SUBSCRIPTION_ERROR = 'SUBSCRIPTION_ERROR',
}

export type MapAppAction =
    | MapAppShowComponent
    | LoggedInUserAction
    | MapAppDeviceMarkerClick
    | MapAppSetLocationAddress
    | MapAppGetLocationAddress
    | DeviceAction;

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

export interface MapAppDeviceMarkerClick {
    type: MapAppActionType.SET_LOCATION_COORDINATES;
    markerLocation: T22Location;
}

export function mapAppSetLocationCoordinates(markerLocation: T22Location): MapAppDeviceMarkerClick {
    return { type: MapAppActionType.SET_LOCATION_COORDINATES, markerLocation };
}

export interface MapAppGetLocationAddress {
    type: MapAppActionType.GET_LOCATION_ADDRESS;
    location: T22Location;
}

export function mapAppGetLocationAddress(location: T22Location): MapAppAction {
    return { type: MapAppActionType.GET_LOCATION_ADDRESS, location };
}

export interface MapAppSetLocationAddress {
    type: MapAppActionType.SET_LOCATION_ADDRESS;
    address: T22Address;
}

export function mapAppSetLocationAddress(address: T22Address): MapAppSetLocationAddress {
    return { type: MapAppActionType.SET_LOCATION_ADDRESS, address };
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

interface MapAppShowComponent {
    type: MapAppActionType.SHOW_COMPONENT;
    component: MapAppComponents;
}

export function mapAppShowComponent(step: MapAppComponents): MapAppShowComponent {
    return { type: MapAppActionType.SHOW_COMPONENT, component: step };
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
