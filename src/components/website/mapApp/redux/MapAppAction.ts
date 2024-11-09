import { Device, MapAppAddress, MapAppLocation } from './MapAppState';

export enum MapAppActionType {
    BUTTON_CLICK = 'BUTTON_CLICK',
    LOGIN_MODAL_CLOSE = 'LOGIN_MODAL_CLOSE',
    LOGOUT_BUTTON_CLICK = 'LOGOUT_BUTTON_CLICK',
    AUTHENTICATION_COMPLETED = 'AUTHENTICATION_COMPLETED',
    SET_LOCATION_COORDINATES = 'SET_LOCATION_COORDINATES',
    GET_LOCATION_ADDRESS = 'GET_LOCATION_ADDRESS',
    SET_LOCATION_ADDRESS = 'SET_LOCATION_ADDRESS',
    REMOTE_REQUEST = 'REMOTE_REQUEST',
    REMOTE_ANSWER = 'REMOTE_ANSWER',
}

export enum MapAppButton {
    LOGIN = 'LOGIN',
    LOGOUT = 'LOGOUT',
}

export enum MapAppRemoteRequestType {
    LIST_DEVICES = 'LIST_DEVICES',
    CREATE_DEVICE = 'CREATE_DEVICE',
}

export enum MapAppRemoteAnswerType {
    DEVICES_LISTED = 'DEVICES_LISTED',
}

export type MapAppAction =
    | MapAppGenericAction
    | MapAppButtonClick
    | MapAppDeviceMarkerClick
    | MapAppGetLocationAddress
    | MapAppSetLocationAddress
    | MapAppRemoteRequest
    | MapAppRemoteAnswer;

export interface MapAppGenericAction {
    type:
        | MapAppActionType.LOGOUT_BUTTON_CLICK
        | MapAppActionType.LOGIN_MODAL_CLOSE
        | MapAppActionType.AUTHENTICATION_COMPLETED;
}

interface MapAppButtonClick {
    type: MapAppActionType.BUTTON_CLICK;
    button: MapAppButton;
}

export function mapAppButtonClick(button: MapAppButton): MapAppButtonClick {
    return { type: MapAppActionType.BUTTON_CLICK, button };
}

export function mapAppLogoutButtonClick(): MapAppButtonClick {
    return mapAppButtonClick(MapAppButton.LOGOUT);
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
    request: MapAppRemoteRequestType;
}

export interface MapAppRemoteAnswer {
    type: MapAppActionType.REMOTE_ANSWER;
    answer: MapAppRemoteAnswerType;
    devices: Device[];
}

export function mapAppRemoteAnswer(devices: Device[]): MapAppRemoteAnswer {
    return {
        type: MapAppActionType.REMOTE_ANSWER,
        answer: MapAppRemoteAnswerType.DEVICES_LISTED,
        devices: devices,
    };
}

export function mapAppRemoteRequest(request: MapAppRemoteRequestType): MapAppRemoteRequest {
    return { type: MapAppActionType.REMOTE_REQUEST, request };
}
