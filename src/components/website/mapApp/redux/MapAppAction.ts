import { T22Address, T22Location } from '@mancho-school-t22/graphql-types';
import { MapAppComponents } from './MapAppState';
import { DeviceAction } from './DeviceAction';
import { LoggedInUserAction } from './LoggedInUserAction';

export enum MapAppActionType {
    LOGIN_MODAL_CLOSE = 'LOGIN_MODAL_CLOSE',
    LOGGED_IN_USER_RESET = 'LOGGED_IN_USER_RESET',
    LOGGED_IN_USER_SET_ID = 'LOGGED_IN_USER_SET_ID',
    SELECTED_MARKER_SET_COORDINATES = 'SELECTED_MARKER_SET_COORDINATES',
    SELECTED_MARKER_GET_ADDRESS = 'SELECTED_MARKER_GET_ADDRESS',
    SELECTED_MARKER_SET_ADDRESS = 'SELECTED_MARKER_SET_ADDRESS',
    LOGGED_IN_USER_SET = 'LOGGED_IN_USER_SET',
    LOGGED_IN_USER_ERROR = 'LOGGED_IN_USER_ERROR',
    LOGGED_IN_USER_UPDATE = 'LOGGED_IN_USER_UPDATE',
    SHOW_COMPONENT = 'SHOW_COMPONENT',
    LOGGED_IN_USER_SUBSCRIPTION_REQUEST = 'LOGGED_IN_USER_SUBSCRIPTION_REQUEST',
    LOGGED_IN_USER_SUBSCRIPTION_ERROR = 'LOGGED_IN_USER_SUBSCRIPTION_ERROR',
}

export type MapAppAction = MapAppShowComponent | LoggedInUserAction | SelectedMarkerAction | DeviceAction;

export type SelectedMarkerAction = SelectedMarkerSetCoordinates | SelectedMarkerSetAddress | SelectedMarkerGetAddress;

export interface SelectedMarkerSetCoordinates {
    type: MapAppActionType.SELECTED_MARKER_SET_COORDINATES;
    markerLocation: T22Location;
}

export function selectedMarkerSetCoordinates(markerLocation: T22Location): SelectedMarkerSetCoordinates {
    return { type: MapAppActionType.SELECTED_MARKER_SET_COORDINATES, markerLocation };
}

export interface SelectedMarkerGetAddress {
    type: MapAppActionType.SELECTED_MARKER_GET_ADDRESS;
    location: T22Location;
}

export function selectedMarkerGetAddress(location: T22Location): MapAppAction {
    return { type: MapAppActionType.SELECTED_MARKER_GET_ADDRESS, location };
}

export interface SelectedMarkerSetAddress {
    type: MapAppActionType.SELECTED_MARKER_SET_ADDRESS;
    address: T22Address;
}

export function selectedMarkerSetAddress(address: T22Address): SelectedMarkerSetAddress {
    return { type: MapAppActionType.SELECTED_MARKER_SET_ADDRESS, address };
}

interface MapAppShowComponent {
    type: MapAppActionType.SHOW_COMPONENT;
    component: MapAppComponents;
}

export function mapAppShowComponent(step: MapAppComponents): MapAppShowComponent {
    return { type: MapAppActionType.SHOW_COMPONENT, component: step };
}
