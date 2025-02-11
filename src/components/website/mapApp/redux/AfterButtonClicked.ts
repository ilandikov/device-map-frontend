import { MapAppButton, MapAppButtonClick } from './MapAppAction';
import { MapAppState, MapAppUsageStep } from './MapAppState';

// TODO these actions should reset the user and that's all. Setting usage step to be done with a separate action
export function afterButtonClicked(action: MapAppButtonClick): Partial<MapAppState> {
    const nextStep = stepAfterButtonClick[action.button];
    if (nextStep) {
        if (action.button === MapAppButton.LOGOUT) {
            return { currentUserID: null };
        }
    }

    return {};
}

const stepAfterButtonClick: { [key in MapAppButton]: MapAppUsageStep } = {
    LOGIN: MapAppUsageStep.USER_AUTHENTICATION,
    LOGOUT: MapAppUsageStep.HOME_SCREEN,
};
