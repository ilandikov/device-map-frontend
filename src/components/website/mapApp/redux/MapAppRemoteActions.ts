import { T22Device } from '@mancho-school-t22/graphql-types';
import { MapAppActionType } from './MapAppAction';

export type MapAppDeviceRemoteAction = MapAppRemoteRequests | MapAppRemoteAnswers;

type MapAppRemoteRequests =
    | MapAppListDevicesRequest
    | MapAppCreateDeviceRequest
    | MapAppDeleteDeviceRequest
    | MapAppApproveDeviceRequest;

export enum MapAppRemoteRequestType {
    LIST_DEVICES = 'LIST_DEVICES',
    CREATE_DEVICE = 'CREATE_DEVICE',
    DELETE_DEVICE = 'DELETE_DEVICE',
    APPROVE_DEVICE = 'APPROVE_DEVICE',
}

export interface MapAppListDevicesRequest {
    type: MapAppActionType.MAP_APP_DEVICE_REMOTE_REQUEST;
    request: MapAppRemoteRequestType.LIST_DEVICES;
}

export interface MapAppCreateDeviceRequest {
    type: MapAppActionType.MAP_APP_DEVICE_REMOTE_REQUEST;
    request: MapAppRemoteRequestType.CREATE_DEVICE;
}

export interface MapAppDeleteDeviceRequest {
    type: MapAppActionType.MAP_APP_DEVICE_REMOTE_REQUEST;
    request: MapAppRemoteRequestType.DELETE_DEVICE;
    id: string;
}

export interface MapAppApproveDeviceRequest {
    type: MapAppActionType.MAP_APP_DEVICE_REMOTE_REQUEST;
    request: MapAppRemoteRequestType.APPROVE_DEVICE;
    id: string;
}

export function mapAppListDevicesRequest(): MapAppListDevicesRequest {
    return {
        type: MapAppActionType.MAP_APP_DEVICE_REMOTE_REQUEST,
        request: MapAppRemoteRequestType.LIST_DEVICES,
    };
}

export function mapAppCreateDeviceRequest(): MapAppCreateDeviceRequest {
    return {
        type: MapAppActionType.MAP_APP_DEVICE_REMOTE_REQUEST,
        request: MapAppRemoteRequestType.CREATE_DEVICE,
    };
}

export function mapAppDeleteDeviceRequest(id: string): MapAppDeleteDeviceRequest {
    return {
        type: MapAppActionType.MAP_APP_DEVICE_REMOTE_REQUEST,
        request: MapAppRemoteRequestType.DELETE_DEVICE,
        id,
    };
}

export function mapAppApproveDeviceRequest(id: string): MapAppApproveDeviceRequest {
    return {
        type: MapAppActionType.MAP_APP_DEVICE_REMOTE_REQUEST,
        request: MapAppRemoteRequestType.APPROVE_DEVICE,
        id,
    };
}

type MapAppRemoteAnswers =
    | MapAppSetDevices
    | MapAppAddDevice
    | MapAppDeleteDevice
    | MapAppApproveDevice
    | MapAppDeviceRequestError;

export interface MapAppSetDevices {
    type: MapAppActionType.MAP_APP_REMOTE_ANSWER;
    answer: MapAppRemoteRequestType.LIST_DEVICES;
    devices: T22Device[];
}

export interface MapAppAddDevice {
    type: MapAppActionType.MAP_APP_REMOTE_ANSWER;
    answer: MapAppRemoteRequestType.CREATE_DEVICE;
    device: T22Device;
}

export interface MapAppDeleteDevice {
    type: MapAppActionType.MAP_APP_REMOTE_ANSWER;
    answer: MapAppRemoteRequestType.DELETE_DEVICE;
    id: string;
}

export interface MapAppApproveDevice {
    type: MapAppActionType.MAP_APP_REMOTE_ANSWER;
    answer: MapAppRemoteRequestType.APPROVE_DEVICE;
    id: string;
    lastUpdate: number;
}

export interface MapAppDeviceRequestError {
    type: MapAppActionType.MAP_APP_DEVICE_REQUEST_ERROR;
    error: string;
}

export function mapAppSetDevices(devices: T22Device[]): MapAppSetDevices {
    return {
        type: MapAppActionType.MAP_APP_REMOTE_ANSWER,
        answer: MapAppRemoteRequestType.LIST_DEVICES,
        devices: devices,
    };
}

export function mapAppAddDevice(device: T22Device): MapAppAddDevice {
    return {
        type: MapAppActionType.MAP_APP_REMOTE_ANSWER,
        answer: MapAppRemoteRequestType.CREATE_DEVICE,
        device,
    };
}

export function mapAppDeleteDevice(id: string): MapAppDeleteDevice {
    return {
        type: MapAppActionType.MAP_APP_REMOTE_ANSWER,
        answer: MapAppRemoteRequestType.DELETE_DEVICE,
        id,
    };
}

export function mapAppApproveDevice(id: string, lastUpdate: number): MapAppApproveDevice {
    return {
        type: MapAppActionType.MAP_APP_REMOTE_ANSWER,
        answer: MapAppRemoteRequestType.APPROVE_DEVICE,
        id,
        lastUpdate,
    };
}

export function mapAppRemoteErrorAnswer(error: string): MapAppDeviceRequestError {
    return { type: MapAppActionType.MAP_APP_DEVICE_REQUEST_ERROR, error };
}
