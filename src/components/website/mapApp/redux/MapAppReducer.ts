import { T22Device } from '@mancho-school-t22/graphql-types';
import { MapAppAction, MapAppActionType } from './MapAppAction';
import { MapAppState, MapAppUsageStep, mapAppInitialState } from './MapAppState';
import { afterButtonClicked } from './AfterButtonClicked';
import { MapAppDeviceActionType, MapAppDeviceRemoteAction, MapAppRemoteRequestType } from './MapAppRemoteActions';

export function MapAppReducer(state: MapAppState = mapAppInitialState, action: MapAppAction): MapAppState {
    switch (action.type) {
        case MapAppActionType.BUTTON_CLICK:
            return { ...state, ...afterButtonClicked(action) };
        case MapAppActionType.LOGIN_MODAL_CLOSE:
            return {
                ...state,
                usageStep: MapAppUsageStep.HOME_SCREEN,
            };
        case MapAppActionType.AUTHENTICATION_COMPLETED:
            return {
                ...state,
                usageStep: MapAppUsageStep.DEVICE_MANAGEMENT,
                currentUserID: action.authenticatedUserId,
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
        case MapAppDeviceActionType.MAP_APP_DEVICE_REMOTE_ANSWER:
            return { ...state, devices: deviceReducer(state.devices, action) };
        default:
            return state;
    }
}

function deviceReducer(devices: T22Device[], action: MapAppDeviceRemoteAction): T22Device[] {
    if (action.type !== MapAppDeviceActionType.MAP_APP_DEVICE_REMOTE_ANSWER) {
        return devices;
    }

    switch (action.request) {
        case MapAppRemoteRequestType.LIST_DEVICES:
            return action.devices;
        case MapAppRemoteRequestType.CREATE_DEVICE: {
            return [...devices, action.device];
        }
        case MapAppRemoteRequestType.DELETE_DEVICE:
            return devices.filter((device) => device.id !== action.id);
        case MapAppRemoteRequestType.APPROVE_DEVICE: {
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
            return [];
    }
}
