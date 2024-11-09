import { MapAppButton, MapAppButtonClick } from './MapAppAction';
import { MapAppState, MapAppUsageStep } from './MapAppState';

export function afterButtonClicked(action: MapAppButtonClick, state: MapAppState) {
    switch (action.button) {
        case MapAppButton.LOGIN:
            return { ...state, usageStep: MapAppUsageStep.USER_AUTHENTICATION };
        case MapAppButton.LOGOUT: {
            return { ...state, usageStep: MapAppUsageStep.HOME_SCREEN };
        }
        default:
            return state;
    }
}
