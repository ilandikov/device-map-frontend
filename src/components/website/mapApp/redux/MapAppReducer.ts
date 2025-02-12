import { T22Device } from '@mancho-school-t22/graphql-types';
import { MapAppAction, MapAppActionType } from './MapAppAction';
import { MapAppComponents, MapAppState, mapAppInitialState } from './MapAppState';
import { DeviceAction, DeviceActionType, DeviceRemoteRequestType } from './DeviceAction';

export function MapAppReducer(state: MapAppState = mapAppInitialState, action: MapAppAction): MapAppState {
    switch (action.type) {
        case MapAppActionType.RESET_CURRENT_USER:
            return { ...state, loggedInUser: null };
        case MapAppActionType.LOGIN_MODAL_CLOSE:
            return {
                ...state,
                component: MapAppComponents.PRODUCT_DESCRIPTION,
            };
        // TODO this action shall be removed towards SHOW_COMPONENT and the user data shall be taken with GET_USER_POINTS or similar
        case MapAppActionType.AUTHENTICATION_COMPLETED:
            return {
                ...state,
                component: MapAppComponents.DEVICE_LOCATION,
                loggedInUser: { id: action.authenticatedUserId, points: 0 },
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
        case MapAppActionType.GET_LOGGED_IN_USER:
            return { ...state, currentUserPoints: null };
        case MapAppActionType.SET_LOGGED_IN_USER:
            return { ...state, currentUserPoints: action.points };
        case MapAppActionType.SHOW_COMPONENT:
            return { ...state, component: action.component };
        case DeviceActionType.DEVICE_REMOTE_ANSWER:
            return { ...state, devices: deviceReducer(state.devices, action) };
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
