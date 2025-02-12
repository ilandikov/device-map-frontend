import { T22Location } from '@mancho-school-t22/graphql-types';
import { MapAppAddress, MapAppComponents } from './MapAppState';
import { DeviceAction } from './DeviceAction';

export enum MapAppActionType {
    RESET_CURRENT_USER = 'RESET_CURRENT_USER',
    LOGIN_MODAL_CLOSE = 'LOGIN_MODAL_CLOSE',
    AUTHENTICATION_COMPLETED = 'AUTHENTICATION_COMPLETED',
    SET_LOCATION_COORDINATES = 'SET_LOCATION_COORDINATES',
    GET_LOCATION_ADDRESS = 'GET_LOCATION_ADDRESS',
    SET_LOCATION_ADDRESS = 'SET_LOCATION_ADDRESS',
    SET_LOGGED_IN_USER = 'SET_LOGGED_IN_USER',
    GET_LOGGED_IN_USER = 'GET_LOGGED_IN_USER',
    GET_LOGGED_IN_USER_ERROR = 'GET_LOGGED_IN_USER_ERROR',
    SHOW_COMPONENT = 'SHOW_COMPONENT',
}

export enum MapAppButton {
    LOGIN = 'LOGIN',
    LOGOUT = 'LOGOUT',
}

export type MapAppAction =
    | MapAppLoginModalCloseAction
    | MapAppResetCurrentUser
    | MapAppDeviceMarkerClick
    | MapAppGetLocationAddress
    | MapAppSetLocationAddress
    | MapAppAuthCompleted
    | MapAppGetLoggedInUser
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
    address: MapAppAddress;
}

export function mapAppSetLocationAddress(address: MapAppAddress): MapAppSetLocationAddress {
    return { type: MapAppActionType.SET_LOCATION_ADDRESS, address };
}

interface MapAppSetLoggedInUser {
    type: MapAppActionType.SET_LOGGED_IN_USER;
    id: string;
    points: number;
}

export function mapAppSetLoggedInUser({ id, points }: { id: string; points: number }): MapAppSetLoggedInUser {
    return { type: MapAppActionType.SET_LOGGED_IN_USER, points, id };
}

interface MapAppGetLoggedInUser {
    type: MapAppActionType.GET_LOGGED_IN_USER;
}

export function mapAppGetLoggedInUser(): MapAppGetLoggedInUser {
    return { type: MapAppActionType.GET_LOGGED_IN_USER };
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
