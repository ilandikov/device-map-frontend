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
    | MapAppDevicesListed
    | MapAppDeviceCreated
    | MapAppDeviceDeleted
    | MapAppDeviceApproved
    | MapAppDeviceRequestError;

export interface MapAppDevicesListed {
    type: MapAppActionType.MAP_APP_DEVICE_REMOTE_ANSWER;
    request: MapAppRemoteRequestType.LIST_DEVICES;
    devices: T22Device[];
}

export interface MapAppDeviceCreated {
    type: MapAppActionType.MAP_APP_DEVICE_REMOTE_ANSWER;
    request: MapAppRemoteRequestType.CREATE_DEVICE;
    device: T22Device;
}

export interface MapAppDeviceDeleted {
    type: MapAppActionType.MAP_APP_DEVICE_REMOTE_ANSWER;
    request: MapAppRemoteRequestType.DELETE_DEVICE;
    id: string;
}

export interface MapAppDeviceApproved {
    type: MapAppActionType.MAP_APP_DEVICE_REMOTE_ANSWER;
    request: MapAppRemoteRequestType.APPROVE_DEVICE;
    id: string;
    lastUpdate: number;
}

export interface MapAppDeviceRequestError {
    type: MapAppActionType.MAP_APP_DEVICE_REQUEST_ERROR;
    error: string;
}

export function mapAppDevicesListed(devices: T22Device[]): MapAppDevicesListed {
    return {
        type: MapAppActionType.MAP_APP_DEVICE_REMOTE_ANSWER,
        request: MapAppRemoteRequestType.LIST_DEVICES,
        devices: devices,
    };
}

export function mapAppDeviceCreated(device: T22Device): MapAppDeviceCreated {
    return {
        type: MapAppActionType.MAP_APP_DEVICE_REMOTE_ANSWER,
        request: MapAppRemoteRequestType.CREATE_DEVICE,
        device,
    };
}

export function mapAppDeviceDeleted(id: string): MapAppDeviceDeleted {
    return {
        type: MapAppActionType.MAP_APP_DEVICE_REMOTE_ANSWER,
        request: MapAppRemoteRequestType.DELETE_DEVICE,
        id,
    };
}

export function mapAppDeviceApproved(id: string, lastUpdate: number): MapAppDeviceApproved {
    return {
        type: MapAppActionType.MAP_APP_DEVICE_REMOTE_ANSWER,
        request: MapAppRemoteRequestType.APPROVE_DEVICE,
        id,
        lastUpdate,
    };
}

export function mapAppDeviceRequestError(error: string): MapAppDeviceRequestError {
    return { type: MapAppActionType.MAP_APP_DEVICE_REQUEST_ERROR, error };
}
