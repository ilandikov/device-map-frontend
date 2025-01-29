import { T22Location } from '@mancho-school-t22/graphql-types';
import { MapAppAddress } from './MapAppState';
import { DeviceAction } from './DeviceAction';

export enum MapAppActionType {
    BUTTON_CLICK = 'BUTTON_CLICK',
    LOGIN_MODAL_CLOSE = 'LOGIN_MODAL_CLOSE',
    AUTHENTICATION_COMPLETED = 'AUTHENTICATION_COMPLETED',
    SET_LOCATION_COORDINATES = 'SET_LOCATION_COORDINATES',
    GET_LOCATION_ADDRESS = 'GET_LOCATION_ADDRESS',
    SET_LOCATION_ADDRESS = 'SET_LOCATION_ADDRESS',
    SET_USER_POINTS = 'SET_USER_POINTS',
    GET_USER_POINTS = 'GET_USER_POINTS',
    GET_USER_POINTS_ERROR = 'GET_USER_POINTS_ERROR',
}

export enum MapAppButton {
    LOGIN = 'LOGIN',
    LOGOUT = 'LOGOUT',
}

export type MapAppAction =
    | MapAppLoginModalCloseAction
    | MapAppButtonClick
    | MapAppDeviceMarkerClick
    | MapAppGetLocationAddress
    | MapAppSetLocationAddress
    | MapAppAuthCompleted
    | MapAppGetUserPoints
    | MapAppSetUserPoints
    | MapAppGetUserPointsError
    | DeviceAction;

export interface MapAppLoginModalCloseAction {
    type: MapAppActionType.LOGIN_MODAL_CLOSE;
}

export interface MapAppButtonClick {
    type: MapAppActionType.BUTTON_CLICK;
    button: MapAppButton;
}

export function mapAppButtonClick(button: MapAppButton): MapAppButtonClick {
    return { type: MapAppActionType.BUTTON_CLICK, button };
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

interface MapAppSetUserPoints {
    type: MapAppActionType.SET_USER_POINTS;
    points: number;
}

export function mapAppSetUserPoints(points: number): MapAppSetUserPoints {
    return { type: MapAppActionType.SET_USER_POINTS, points };
}

interface MapAppGetUserPoints {
    type: MapAppActionType.GET_USER_POINTS;
}

export function mapAppGetUserPoints(): MapAppGetUserPoints {
    return { type: MapAppActionType.GET_USER_POINTS };
}

interface MapAppGetUserPointsError {
    type: MapAppActionType.GET_USER_POINTS_ERROR;
    error: string;
}

export function mapAppGetUserPointsError(error: string): MapAppGetUserPointsError {
    return { type: MapAppActionType.GET_USER_POINTS_ERROR, error };
}
