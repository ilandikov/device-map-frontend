import { T22Device } from '@mancho-school-t22/graphql-types';

export type DeviceAction = DeviceRemoteRequest | DeviceRemoteAnswer | DeviceRemoteError;

export type DeviceRemoteRequest =
    | DeviceListRequest
    | DeviceCreateRequest
    | DeviceDeleteRequest
    | DeviceApproveRequest
    | DeviceCreationSubscriptionRequest;

export enum DeviceActionType {
    DEVICE_REMOTE_REQUEST = 'DEVICE_REMOTE_REQUEST',
    DEVICE_REMOTE_ANSWER = 'DEVICE_REMOTE_ANSWER',
    DEVICE_REQUEST_ERROR = 'DEVICE_REQUEST_ERROR',
    DEVICE_SUBSCRIPTION_REQUEST = 'DEVICE_SUBSCRIPTION_REQUEST',
    DEVICE_SUBSCRIPTION_ANSWER = 'DEVICE_SUBSCRIPTION_ANSWER',
}

export enum DeviceRemoteRequestType {
    LIST_DEVICES = 'LIST_DEVICES',
    CREATE_DEVICE = 'CREATE_DEVICE',
    DELETE_DEVICE = 'DELETE_DEVICE',
    APPROVE_DEVICE = 'APPROVE_DEVICE',
}

export interface DeviceListRequest {
    type: DeviceActionType.DEVICE_REMOTE_REQUEST;
    request: DeviceRemoteRequestType.LIST_DEVICES;
}

export interface DeviceCreateRequest {
    type: DeviceActionType.DEVICE_REMOTE_REQUEST;
    request: DeviceRemoteRequestType.CREATE_DEVICE;
}

export interface DeviceDeleteRequest {
    type: DeviceActionType.DEVICE_REMOTE_REQUEST;
    request: DeviceRemoteRequestType.DELETE_DEVICE;
    id: string;
}

export interface DeviceApproveRequest {
    type: DeviceActionType.DEVICE_REMOTE_REQUEST;
    request: DeviceRemoteRequestType.APPROVE_DEVICE;
    id: string;
}

export function deviceListRequest(): DeviceListRequest {
    return {
        type: DeviceActionType.DEVICE_REMOTE_REQUEST,
        request: DeviceRemoteRequestType.LIST_DEVICES,
    };
}

export function deviceCreateRequest(): DeviceCreateRequest {
    return {
        type: DeviceActionType.DEVICE_REMOTE_REQUEST,
        request: DeviceRemoteRequestType.CREATE_DEVICE,
    };
}

export function deviceDeleteRequest(id: string): DeviceDeleteRequest {
    return {
        type: DeviceActionType.DEVICE_REMOTE_REQUEST,
        request: DeviceRemoteRequestType.DELETE_DEVICE,
        id,
    };
}

export function deviceApproveRequest(id: string): DeviceApproveRequest {
    return {
        type: DeviceActionType.DEVICE_REMOTE_REQUEST,
        request: DeviceRemoteRequestType.APPROVE_DEVICE,
        id,
    };
}

export type DeviceRemoteAnswer =
    | DevicesListed
    | DeviceCreated
    | DeviceDeleted
    | DeviceApproved
    | DeviceCreationSubscriptionAnswer;

export interface DevicesListed {
    type: DeviceActionType.DEVICE_REMOTE_ANSWER;
    request: DeviceRemoteRequestType.LIST_DEVICES;
    devices: T22Device[];
}

export interface DeviceCreated {
    type: DeviceActionType.DEVICE_REMOTE_ANSWER;
    request: DeviceRemoteRequestType.CREATE_DEVICE;
    device: T22Device;
}

export interface DeviceDeleted {
    type: DeviceActionType.DEVICE_REMOTE_ANSWER;
    request: DeviceRemoteRequestType.DELETE_DEVICE;
    id: string;
}

export interface DeviceApproved {
    type: DeviceActionType.DEVICE_REMOTE_ANSWER;
    request: DeviceRemoteRequestType.APPROVE_DEVICE;
    id: string;
    lastUpdate: number;
}

export interface DeviceRemoteError {
    type: DeviceActionType.DEVICE_REQUEST_ERROR;
    error: string;
}

export function devicesListed(devices: T22Device[]): DevicesListed {
    return {
        type: DeviceActionType.DEVICE_REMOTE_ANSWER,
        request: DeviceRemoteRequestType.LIST_DEVICES,
        devices: devices,
    };
}

export function deviceCreated(device: T22Device): DeviceCreated {
    return {
        type: DeviceActionType.DEVICE_REMOTE_ANSWER,
        request: DeviceRemoteRequestType.CREATE_DEVICE,
        device,
    };
}

export function deviceDeleted(id: string): DeviceDeleted {
    return {
        type: DeviceActionType.DEVICE_REMOTE_ANSWER,
        request: DeviceRemoteRequestType.DELETE_DEVICE,
        id,
    };
}

export function deviceApproved(id: string, lastUpdate: number): DeviceApproved {
    return {
        type: DeviceActionType.DEVICE_REMOTE_ANSWER,
        request: DeviceRemoteRequestType.APPROVE_DEVICE,
        id,
        lastUpdate,
    };
}

export function deviceRemoteError(error: string): DeviceRemoteError {
    return { type: DeviceActionType.DEVICE_REQUEST_ERROR, error };
}

interface DeviceCreationSubscriptionRequest {
    type: DeviceActionType.DEVICE_SUBSCRIPTION_REQUEST;
}

export function deviceCreationSubscriptionRequest(): DeviceCreationSubscriptionRequest {
    return {
        type: DeviceActionType.DEVICE_SUBSCRIPTION_REQUEST,
    };
}

// TODO names here have to be reworked
interface DeviceCreationSubscriptionAnswer {
    type: DeviceActionType.DEVICE_SUBSCRIPTION_ANSWER;
    request: DeviceRemoteRequestType.CREATE_DEVICE;
    device: T22Device;
}

// TODO names here have to be reworked
export function updateDevice(device: T22Device): DeviceCreationSubscriptionAnswer {
    return {
        type: DeviceActionType.DEVICE_SUBSCRIPTION_ANSWER,
        request: DeviceRemoteRequestType.CREATE_DEVICE,
        device,
    };
}
