import { MapAppButton, MapAppButtonClick } from './MapAppAction';
import { MapAppState, MapAppUsageStep } from './MapAppState';

export function afterButtonClicked(action: MapAppButtonClick): Partial<MapAppState> {
    switch (action.button) {
        case MapAppButton.LOGIN:
            return { usageStep: MapAppUsageStep.USER_AUTHENTICATION };
        case MapAppButton.LOGOUT: {
            return { usageStep: MapAppUsageStep.HOME_SCREEN };
        }
        default:
            return {};
    }
}
