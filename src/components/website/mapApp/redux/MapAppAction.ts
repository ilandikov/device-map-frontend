import { Device, MapAppAddress, MapAppLocation } from './MapAppState';

export enum MapAppActionType {
    LOGIN_BUTTON_CLICK = 'LOGIN_BUTTON_CLICK',
    LOGIN_MODAL_CLOSE = 'LOGIN_MODAL_CLOSE',
    LOGOUT_BUTTON_CLICK = 'LOGOUT_BUTTON_CLICK',
    AUTHENTICATION_COMPLETED = 'AUTHENTICATION_COMPLETED',
    SET_LOCATION_COORDINATES = 'SET_LOCATION_COORDINATES',
    GET_LOCATION_ADDRESS = 'GET_LOCATION_ADDRESS',
    SET_LOCATION_ADDRESS = 'SET_LOCATION_ADDRESS',
    REMOTE_REQUEST = 'REMOTE_REQUEST',
    REMOTE_ANSWER = 'REMOTE_ANSWER',
}

export enum MapAppRemoteRequestType {
    LIST_DEVICES = 'LIST_DEVICES',
}

export type MapAppAction =
    | MapAppGenericAction
    | MapAppDeviceMarkerClick
    | MapAppGetLocationAddress
    | MapAppSetLocationAddress
    | MapAppRemoteRequest
    | MapAppRemoteAnswer;

export interface MapAppGenericAction {
    type:
        | MapAppActionType.LOGIN_BUTTON_CLICK
        | MapAppActionType.LOGOUT_BUTTON_CLICK
        | MapAppActionType.LOGIN_MODAL_CLOSE
        | MapAppActionType.AUTHENTICATION_COMPLETED;
}

export function mapAppLoginButtonClick(): MapAppGenericAction {
    return { type: MapAppActionType.LOGIN_BUTTON_CLICK };
}

export function mapAppLogoutButtonClick(): MapAppGenericAction {
    return { type: MapAppActionType.LOGOUT_BUTTON_CLICK };
}

export function mapAppLoginModalClose(): MapAppGenericAction {
    return { type: MapAppActionType.LOGIN_MODAL_CLOSE };
}

export function mapAppAuthenticationCompleted(): MapAppGenericAction {
    return { type: MapAppActionType.AUTHENTICATION_COMPLETED };
}

export interface MapAppDeviceMarkerClick {
    type: MapAppActionType.SET_LOCATION_COORDINATES;
    markerLocation: MapAppLocation;
}

export function mapAppSetLocationCoordinates(markerLocation: MapAppLocation): MapAppDeviceMarkerClick {
    return { type: MapAppActionType.SET_LOCATION_COORDINATES, markerLocation };
}

export interface MapAppGetLocationAddress {
    type: MapAppActionType.GET_LOCATION_ADDRESS;
    location: MapAppLocation;
}

export function mapAppGetLocationAddress(location: MapAppLocation): MapAppAction {
    return { type: MapAppActionType.GET_LOCATION_ADDRESS, location };
}

export interface MapAppSetLocationAddress {
    type: MapAppActionType.SET_LOCATION_ADDRESS;
    address: MapAppAddress;
}

export function mapAppSetLocationAddress(address: MapAppAddress): MapAppSetLocationAddress {
    return { type: MapAppActionType.SET_LOCATION_ADDRESS, address };
}

export interface MapAppRemoteRequest {
    type: MapAppActionType.REMOTE_REQUEST;
    request: MapAppRemoteRequestType.LIST_DEVICES;
}

export interface MapAppRemoteAnswer {
    type: MapAppActionType.REMOTE_ANSWER;
    devices: Device[];
}

export function mapAppRemoteAnswer(devices: Device[]): MapAppRemoteAnswer {
    return {
        type: MapAppActionType.REMOTE_ANSWER,
        devices: devices,
    };
}

export function mapAppRemoteRequest(): MapAppRemoteRequest {
    return { type: MapAppActionType.REMOTE_REQUEST, request: MapAppRemoteRequestType.LIST_DEVICES };
}
