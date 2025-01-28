import { MapAppActionType } from './MapAppAction';

export enum MapAppRemoteRequestType {
    LIST_DEVICES = 'LIST_DEVICES',
    CREATE_DEVICE = 'CREATE_DEVICE',
    DELETE_DEVICE = 'DELETE_DEVICE',
    APPROVE_DEVICE = 'APPROVE_DEVICE',
}

export type MapAppDeviceRemoteAction =
    | MapAppListDevicesRequest
    | MapAppCreateDeviceRequest
    | MapAppDeleteDeviceRequest
    | MapAppApproveDeviceRequest
    | MapAppDeviceRequestError;

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

export interface MapAppDeviceRequestError {
    type: MapAppActionType.MAP_APP_DEVICE_REQUEST_ERROR;
    error: string;
}

export function mapAppRemoteErrorAnswer(error: string): MapAppDeviceRequestError {
    return { type: MapAppActionType.MAP_APP_DEVICE_REQUEST_ERROR, error };
}
