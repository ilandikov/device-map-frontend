import { T22Device, T22Location } from '@mancho-school-t22/graphql-types';
import { MapAppAddress } from './MapAppState';

export enum MapAppActionType {
    BUTTON_CLICK = 'BUTTON_CLICK',
    LOGIN_MODAL_CLOSE = 'LOGIN_MODAL_CLOSE',
    AUTHENTICATION_COMPLETED = 'AUTHENTICATION_COMPLETED',
    SET_LOCATION_COORDINATES = 'SET_LOCATION_COORDINATES',
    GET_LOCATION_ADDRESS = 'GET_LOCATION_ADDRESS',
    SET_LOCATION_ADDRESS = 'SET_LOCATION_ADDRESS',
    // TODO do something about all these actions. Probably split this state into several states, map app state to manage only windows
    MAP_APP_REMOTE_REQUEST = 'MAP_APP_REMOTE_REQUEST',
    REMOTE_ANSWER = 'REMOTE_ANSWER',
    REMOTE_ERROR_ANSWER = 'REMOTE_ERROR_ANSWER',
    DELETE_DEVICE = 'DELETE_DEVICE',
    MAP_APP_APPROVE_DEVICE = 'MAP_APP_APPROVE_DEVICE',
}

export enum MapAppButton {
    LOGIN = 'LOGIN',
    LOGOUT = 'LOGOUT',
}

export enum MapAppRemoteRequestType {
    LIST_DEVICES = 'LIST_DEVICES',
    CREATE_DEVICE = 'CREATE_DEVICE',
    DELETE_DEVICE = 'DELETE_DEVICE',
    APPROVE_DEVICE = 'APPROVE_DEVICE',
}

export enum MapAppRemoteAnswerType {
    DEVICES_LISTED = 'DEVICES_LISTED',
    DEVICE_CREATED = 'DEVICE_CREATED',
}

export type MapAppAction =
    | MapAppLoginModalCloseAction
    | MapAppButtonClick
    | MapAppDeviceMarkerClick
    | MapAppGetLocationAddress
    | MapAppSetLocationAddress
    | MapAppRemoteRequest
    | MapAppCreateDeviceRequest
    | MapAppSetDevices
    | MapAppAddDevice
    | MapAppDeleteDevice
    | MapAppRemoteErrorAnswer
    | MapAppAuthCompleted
    | MapAppApproveDeviceRequest
    | MapAppApproveDevice;

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

export interface MapAppRemoteRequest {
    type: MapAppActionType.MAP_APP_REMOTE_REQUEST;
    request: MapAppRemoteRequestType;
}

export interface MapAppSetDevices {
    type: MapAppActionType.REMOTE_ANSWER;
    answer: MapAppRemoteAnswerType.DEVICES_LISTED;
    devices: T22Device[];
}

export function mapAppSetDevices(devices: T22Device[]): MapAppSetDevices {
    return {
        type: MapAppActionType.REMOTE_ANSWER,
        answer: MapAppRemoteAnswerType.DEVICES_LISTED,
        devices: devices,
    };
}

interface MapAppAddDevice {
    type: MapAppActionType.REMOTE_ANSWER;
    answer: MapAppRemoteAnswerType.DEVICE_CREATED;
    device: T22Device;
}

export function mapAppAddDevice(device: T22Device): MapAppAddDevice {
    return {
        type: MapAppActionType.REMOTE_ANSWER,
        answer: MapAppRemoteAnswerType.DEVICE_CREATED,
        device,
    };
}

export function mapAppRemoteRequest(request: MapAppRemoteRequestType): MapAppRemoteRequest {
    return { type: MapAppActionType.MAP_APP_REMOTE_REQUEST, request };
}

interface MapAppCreateDeviceRequest extends MapAppRemoteRequest {}

export function mapAppCreateDeviceRequest(): MapAppCreateDeviceRequest {
    return {
        type: MapAppActionType.MAP_APP_REMOTE_REQUEST,
        request: MapAppRemoteRequestType.CREATE_DEVICE,
    };
}

interface MapAppRemoteErrorAnswer {
    type: MapAppActionType.REMOTE_ERROR_ANSWER;
    error: string;
}

export function mapAppRemoteErrorAnswer(error: string): MapAppRemoteErrorAnswer {
    return { type: MapAppActionType.REMOTE_ERROR_ANSWER, error };
}

interface MapAppDeleteDevice {
    type: MapAppActionType.DELETE_DEVICE;
    id: string;
}

export function mapAppDeleteDevice(id: string): MapAppDeleteDevice {
    return { type: MapAppActionType.DELETE_DEVICE, id };
}

export interface MapAppDeleteDeviceRequest extends MapAppRemoteRequest {
    id: string;
}

export function mapAppDeleteDeviceRequest(id: string): MapAppDeleteDeviceRequest {
    return {
        type: MapAppActionType.MAP_APP_REMOTE_REQUEST,
        request: MapAppRemoteRequestType.DELETE_DEVICE,
        id,
    };
}

export interface MapAppApproveDeviceRequest {
    type: MapAppActionType.MAP_APP_REMOTE_REQUEST;
    request: MapAppRemoteRequestType.APPROVE_DEVICE;
    id: string;
}

export function mapAppApproveDeviceRequest(id: string): MapAppApproveDeviceRequest {
    return {
        type: MapAppActionType.MAP_APP_REMOTE_REQUEST,
        request: MapAppRemoteRequestType.APPROVE_DEVICE,
        id,
    };
}

interface MapAppApproveDevice {
    type: MapAppActionType.MAP_APP_APPROVE_DEVICE;
    id: string;
    lastUpdate: number;
}

export function mapAppApproveDevice(id: string, lastUpdate: number): MapAppApproveDevice {
    return { type: MapAppActionType.MAP_APP_APPROVE_DEVICE, id, lastUpdate };
}
