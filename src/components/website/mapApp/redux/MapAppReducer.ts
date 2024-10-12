import { MapAppAction, MapAppActionType } from './MapAppAction';
import { MapAppState, MapAppUsageStep, mapAppInitialState } from './MapAppState';

export function MapAppReducer(state: MapAppState = mapAppInitialState, action: MapAppAction): MapAppState {
    switch (action.type) {
        case MapAppActionType.LOGIN_BUTTON_CLICK:
            return { ...state, usageStep: MapAppUsageStep.USER_AUTHENTICATION };
        case MapAppActionType.LOGOUT_BUTTON_CLICK:
            return { ...state, usageStep: MapAppUsageStep.HOME_SCREEN };
        case MapAppActionType.LOGIN_MODAL_CLOSE:
            return {
                ...state,
                usageStep: MapAppUsageStep.HOME_SCREEN,
            };
        case MapAppActionType.AUTHENTICATION_COMPLETED:
            return { ...state, usageStep: MapAppUsageStep.DEVICE_MANAGEMENT };
        case MapAppActionType.DEVICE_MARKER_CLICK:
            return { ...state, selectedMarker: { location: action.markerLocation, address: null } };
        case MapAppActionType.SET_LOCATION_ADDRESS: {
            const selectedMarkerWithAddress = {
                ...state.selectedMarker,
                address: action.address,
            };
            return { ...state, selectedMarker: selectedMarkerWithAddress };
        }
        default:
            return state;
    }
}
