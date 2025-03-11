import { T22Device } from '@mancho-school-t22/graphql-types';
import { MapAppAction, MapAppActionType } from './MapAppAction';
import { MapAppComponents, MapAppState, buildMapAppState } from './MapAppState';
import { DeviceAction, DeviceActionType, DeviceRemoteRequestType } from './DeviceAction';

export function MapAppReducer(state: MapAppState = buildMapAppState({}), action: MapAppAction): MapAppState {
    switch (action.type) {
        case MapAppActionType.RESET_CURRENT_USER:
            return { ...state, loggedInUser: null };
        case MapAppActionType.LOGIN_MODAL_CLOSE:
            return {
                ...state,
                component: MapAppComponents.PRODUCT_DESCRIPTION,
            };
        case MapAppActionType.SET_LOGGED_IN_USER_ID:
            return {
                ...state,
                loggedInUser: { id: action.id, points: null },
            };
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
        case DeviceActionType.DEVICE_SUBSCRIPTION_ANSWER: {
            const devicesWithoutTheDeviceToUpdate = state.devices.filter((device) => device.id !== action.device.id);
            return { ...state, devices: [...devicesWithoutTheDeviceToUpdate, action.device] };
        }
        default:
            return state;
    }
}

function deviceReducer(devices: T22Device[], action: DeviceAction): T22Device[] {
    if (action.type !== DeviceActionType.DEVICE_REMOTE_ANSWER) {
        return devices;
    }

    switch (action.request) {
        case DeviceRemoteRequestType.LIST_DEVICES:
            return action.devices;
        case DeviceRemoteRequestType.CREATE_DEVICE: {
            return [...devices, action.device];
        }
        case DeviceRemoteRequestType.DELETE_DEVICE:
            return devices.filter((device) => device.id !== action.id);
        case DeviceRemoteRequestType.APPROVE_DEVICE: {
            const deviceToApprove = devices.find((device) => device.id === action.id);
            const approvedDevice: T22Device = {
                ...deviceToApprove,
                lastUpdate: action.lastUpdate,
                approvals: deviceToApprove.approvals ? deviceToApprove.approvals + 1 : 1,
            };
            const withoutApprovedDevice = devices.filter((device) => device.id !== action.id);
            return [...withoutApprovedDevice, approvedDevice];
        }
        default:
            return devices;
    }
}
