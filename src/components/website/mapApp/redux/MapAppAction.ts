import { T22Address, T22Location } from '@mancho-school-t22/graphql-types';
import { MapAppComponents, MapAppUser } from './MapAppState';
import { DeviceAction } from './DeviceAction';

export enum MapAppActionType {
    RESET_CURRENT_USER = 'RESET_CURRENT_USER',
    LOGIN_MODAL_CLOSE = 'LOGIN_MODAL_CLOSE',
    AUTHENTICATION_COMPLETED = 'AUTHENTICATION_COMPLETED',
    SET_LOCATION_COORDINATES = 'SET_LOCATION_COORDINATES',
    GET_LOCATION_ADDRESS = 'GET_LOCATION_ADDRESS',
    SET_LOCATION_ADDRESS = 'SET_LOCATION_ADDRESS',
    SET_LOGGED_IN_USER = 'SET_LOGGED_IN_USER',
    GET_LOGGED_IN_USER_ERROR = 'GET_LOGGED_IN_USER_ERROR',
    SHOW_COMPONENT = 'SHOW_COMPONENT',
}

export type MapAppAction =
    | MapAppLoginModalCloseAction
    | MapAppResetCurrentUser
    | MapAppDeviceMarkerClick
    | MapAppGetLocationAddress
    | MapAppSetLocationAddress
    | MapAppAuthCompleted
    | MapAppSetLoggedInUser
    | MapAppGetLoggedInUserError
    | MapAppShowComponent
    | DeviceAction;

export interface MapAppLoginModalCloseAction {
    type: MapAppActionType.LOGIN_MODAL_CLOSE;
}

export interface MapAppResetCurrentUser {
    type: MapAppActionType.RESET_CURRENT_USER;
}

export function mapAppResetCurrentUser(): MapAppResetCurrentUser {
    return { type: MapAppActionType.RESET_CURRENT_USER };
}

export function mapAppLoginModalClose(): MapAppLoginModalCloseAction {
    return { type: MapAppActionType.LOGIN_MODAL_CLOSE };
}

interface MapAppAuthCompleted {
    type: MapAppActionType.AUTHENTICATION_COMPLETED;
    authenticatedUserId: string;
}

export function mapAppAuthenticationCompleted(authenticatedUserId: string): MapAppAuthCompleted {
    return { type: MapAppActionType.AUTHENTICATION_COMPLETED, authenticatedUserId };
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
    user: MapAppUser;
}

export function mapAppSetLoggedInUser(user: MapAppUser): MapAppSetLoggedInUser {
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
