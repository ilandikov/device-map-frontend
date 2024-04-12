import { MapAppAction, MapAppActionType } from './MapAppAction';
import { MapAppState, MapAppUsageStep, mapAppInitialState } from './MapAppState';

export function MapAppReducer(state: MapAppState = mapAppInitialState, action: MapAppAction) {
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
        default:
            return state;
    }
}
