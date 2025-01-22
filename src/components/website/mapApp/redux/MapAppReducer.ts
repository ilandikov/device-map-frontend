import { T22Device } from '@mancho-school-t22/graphql-types';
import { MapAppAction, MapAppActionType, MapAppRemoteAnswerType } from './MapAppAction';
import { MapAppState, MapAppUsageStep, mapAppInitialState } from './MapAppState';
import { afterButtonClicked } from './AfterButtonClicked';

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
        case MapAppActionType.REMOTE_ANSWER:
            switch (action.answer) {
                case MapAppRemoteAnswerType.DEVICES_LISTED:
                    return { ...state, devices: action.devices };
                case MapAppRemoteAnswerType.DEVICE_CREATED: {
                    return { ...state, devices: [...state.devices, action.device] };
                }
                default:
                    return state;
            }
        case MapAppActionType.DELETE_DEVICE:
            return {
                ...state,
                devices: state.devices.filter((device) => device.id !== action.id),
            };
        case MapAppActionType.MAP_APP_APPROVE_DEVICE: {
            const deviceToApprove = state.devices.find((device) => device.id === action.id);
            const approvedDevice: T22Device = {
                ...deviceToApprove,
                lastUpdate: action.lastUpdate,
                approvals: deviceToApprove.approvals ? deviceToApprove.approvals + 1 : 1,
            };
            const withoutApprovedDevice = state.devices.filter((device) => device.id !== action.id);
            return { ...state, devices: [...withoutApprovedDevice, approvedDevice] };
        }
        default:
            return state;
    }
}
