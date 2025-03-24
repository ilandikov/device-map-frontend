import { T22Device } from '@mancho-school-t22/graphql-types';
import { MapAppAction, MapAppActionType } from './MapAppAction';
import { MapAppState, MapAppUser, buildMapAppState } from './MapAppState';
import { DeviceActionType, DeviceRemoteAnswer, DeviceRemoteRequestType } from './DeviceAction';

export function MapAppReducer(state: MapAppState = buildMapAppState({}), action: MapAppAction): MapAppState {
    switch (action.type) {
        case MapAppActionType.SHOW_COMPONENT:
            return { ...state, component: action.component };
        case MapAppActionType.SET_LOGGED_IN_USER_ID:
        case MapAppActionType.SET_LOGGED_IN_USER:
        case MapAppActionType.UPDATE_LOGGED_IN_USER:
        case MapAppActionType.LOGGED_IN_USER_RESET:
            return { ...state, loggedInUser: loggedInUserReducer(state.loggedInUser, action) };
        case MapAppActionType.SET_LOCATION_COORDINATES:
            return { ...state, selectedMarker: { location: action.markerLocation, address: null } };
        case MapAppActionType.SET_LOCATION_ADDRESS: {
            const selectedMarkerWithAddress = {
                ...state.selectedMarker,
                address: action.address,
            };
            return { ...state, selectedMarker: selectedMarkerWithAddress };
        }
        case DeviceActionType.DEVICE_REMOTE_ANSWER:
            return { ...state, devices: deviceReducer(state.devices, action) };
        case DeviceActionType.DEVICE_CREATION:
            return { ...state, isDeviceCreationOngoing: action.isDeviceCreationOngoing };
        default:
            return state;
    }
}

function loggedInUserReducer(loggedInUser: MapAppUser | null, action: MapAppAction): MapAppUser | null {
    switch (action.type) {
        case MapAppActionType.SET_LOGGED_IN_USER_ID:
            return { id: action.id, points: null };
        case MapAppActionType.SET_LOGGED_IN_USER:
            return action.user;
        case MapAppActionType.UPDATE_LOGGED_IN_USER:
            if (loggedInUser.id === action.user.id) {
                return action.user;
            }
            return loggedInUser;
        case MapAppActionType.LOGGED_IN_USER_RESET:
            return null;
    }
}

function deviceReducer(devices: T22Device[], action: DeviceRemoteAnswer): T22Device[] {
    switch (action.request) {
        case DeviceRemoteRequestType.LIST_DEVICES:
            return action.devices;
        case DeviceRemoteRequestType.CREATE_DEVICE_REQUEST: {
            return [...devices, action.device];
        }
        case DeviceRemoteRequestType.DELETE_DEVICE:
            return devices.filter((device) => device.id !== action.id);
        case DeviceRemoteRequestType.APPROVE_DEVICE: {
            return devices.map((device) => (device.id !== action.id ? device : approveDevice(device)));
        }
        default:
            return devices;
    }
}

function approveDevice(deviceToApprove: T22Device): T22Device {
    return {
        ...deviceToApprove,
        lastUpdate: Date.now(),
        approvals: deviceToApprove.approvals ? deviceToApprove.approvals + 1 : 1,
    };
}
