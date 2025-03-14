import { T22Device } from '@mancho-school-t22/graphql-types';
import { MapAppAction, MapAppActionType } from './MapAppAction';
import { MapAppState, buildMapAppState } from './MapAppState';
import { DeviceActionType, DeviceRemoteAnswer, DeviceRemoteRequestType } from './DeviceAction';

export function MapAppReducer(state: MapAppState = buildMapAppState({}), action: MapAppAction): MapAppState {
    switch (action.type) {
        case MapAppActionType.RESET_CURRENT_USER:
            return { ...state, loggedInUser: null };
        case MapAppActionType.SET_LOGGED_IN_USER_ID:
            return {
                ...state,
                loggedInUser: { id: action.id, points: null },
            };
        case MapAppActionType.UPDATE_LOGGED_IN_USER:
            if (state.loggedInUser.id === action.user.id) {
                return { ...state, loggedInUser: action.user };
            }

            return state;
        case MapAppActionType.SET_LOCATION_COORDINATES:
            return { ...state, selectedMarker: { location: action.markerLocation, address: null } };
        case MapAppActionType.SET_LOCATION_ADDRESS: {
            const selectedMarkerWithAddress = {
                ...state.selectedMarker,
                address: action.address,
            };
            return { ...state, selectedMarker: selectedMarkerWithAddress };
        }
        case MapAppActionType.SET_LOGGED_IN_USER:
            return { ...state, loggedInUser: action.user };
        case MapAppActionType.SHOW_COMPONENT:
            return { ...state, component: action.component };
        case DeviceActionType.DEVICE_REMOTE_ANSWER:
            return { ...state, devices: deviceReducer(state.devices, action) };
        case DeviceActionType.DEVICE_CREATION:
            return { ...state, isDeviceCreationOngoing: action.isDeviceCreationOngoing };
        default:
            return state;
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
            const deviceToApprove = devices.find((device) => device.id === action.id);
            const approvedDevice: T22Device = {
                ...deviceToApprove,
                lastUpdate: Date.now(),
                approvals: deviceToApprove.approvals ? deviceToApprove.approvals + 1 : 1,
            };
            const withoutApprovedDevice = devices.filter((device) => device.id !== action.id);
            return [...withoutApprovedDevice, approvedDevice];
        }
        default:
            return devices;
    }
}
