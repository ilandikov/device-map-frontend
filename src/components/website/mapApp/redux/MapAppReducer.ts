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
            return { ...state, selectedMarkerLocation: action.markerLocation };
        default:
            return state;
    }
}
