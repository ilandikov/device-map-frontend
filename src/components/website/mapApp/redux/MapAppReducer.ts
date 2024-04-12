import { MapAppAction, MapAppActionTypes } from './MapAppAction';
import { MapAppState, MapAppUsageStep, mapAppInitialState } from './MapAppState';

export function MapAppReducer(state: MapAppState = mapAppInitialState, action: MapAppAction) {
    switch (action.type) {
        case MapAppActionTypes.LOGIN_BUTTON_CLICK:
            return { ...state, usageStep: MapAppUsageStep.USER_AUTHENTICATION };
        case MapAppActionTypes.LOGOUT_BUTTON_CLICK:
            return { ...state, usageStep: MapAppUsageStep.HOME_SCREEN };
        case MapAppActionTypes.LOGIN_MODAL_CLOSE:
            return {
                ...state,
                usageStep: MapAppUsageStep.HOME_SCREEN,
            };
        case MapAppActionTypes.AUTHENTICATION_COMPLETED:
            return { ...state, usageStep: MapAppUsageStep.DEVICE_MANAGEMENT };
        default:
            return state;
    }
}
