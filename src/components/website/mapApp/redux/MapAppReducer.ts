import { MapAppAction, MapAppActionTypes } from './actions';
import { MapAppState, MapAppUsageStep, mapAppInitialState } from './MapAppState';

export function MapAppReducer(state: MapAppState = mapAppInitialState, action: MapAppAction) {
    switch (action.type) {
        case MapAppActionTypes.LOGIN_BUTTON_CLICK:
            return { ...state, usageStep: MapAppUsageStep.USER_AUTHENTICATION };
        case MapAppActionTypes.LOGIN_MODAL_CLOSE:
            return {
                ...state,
                usageStep: MapAppUsageStep.HOME_SCREEN,
            };
        default:
            return state;
    }
}
