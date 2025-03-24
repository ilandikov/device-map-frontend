import { T22Address, T22Location } from '@mancho-school-t22/graphql-types';
import { MapAppComponents } from './MapAppState';
import { DeviceAction } from './DeviceAction';
import { LoggedInUserAction } from './LoggedInUserAction';

export enum MapAppActionType {
    LOGIN_MODAL_CLOSE = 'LOGIN_MODAL_CLOSE',
    LOGGED_IN_USER_RESET = 'LOGGED_IN_USER_RESET',
    LOGGED_IN_USER_SET_ID = 'LOGGED_IN_USER_SET_ID',
    SET_LOCATION_COORDINATES = 'SET_LOCATION_COORDINATES',
    GET_LOCATION_ADDRESS = 'GET_LOCATION_ADDRESS',
    SET_LOCATION_ADDRESS = 'SET_LOCATION_ADDRESS',
    LOGGED_IN_USER_SET = 'LOGGED_IN_USER_SET',
    LOGGED_IN_USER_ERROR = 'LOGGED_IN_USER_ERROR',
    LOGGED_IN_USER_UPDATE = 'LOGGED_IN_USER_UPDATE',
    SHOW_COMPONENT = 'SHOW_COMPONENT',
    LOGGED_IN_USER_SUBSCRIPTION_REQUEST = 'LOGGED_IN_USER_SUBSCRIPTION_REQUEST',
    LOGGED_IN_USER_SUBSCRIPTION_ERROR = 'LOGGED_IN_USER_SUBSCRIPTION_ERROR',
}

export type MapAppAction =
    | MapAppShowComponent
    | LoggedInUserAction
    | MapAppDeviceMarkerClick
    | MapAppSetLocationAddress
    | MapAppGetLocationAddress
    | DeviceAction;

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

interface MapAppShowComponent {
    type: MapAppActionType.SHOW_COMPONENT;
    component: MapAppComponents;
}

export function mapAppShowComponent(step: MapAppComponents): MapAppShowComponent {
    return { type: MapAppActionType.SHOW_COMPONENT, component: step };
}
