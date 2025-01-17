import { MapAppButton, MapAppButtonClick } from './MapAppAction';
import { MapAppState, MapAppUsageStep } from './MapAppState';

export function afterButtonClicked(action: MapAppButtonClick): Partial<MapAppState> {
    const nextStep = stepAfterButtonClick[action.button];
    if (nextStep) {
        if (action.button === MapAppButton.LOGOUT) {
            return { usageStep: nextStep, currentUserID: '' };
        }

        return { usageStep: nextStep };
    }

    return {};
}

const stepAfterButtonClick: { [key in MapAppButton]: MapAppUsageStep } = {
    LOGIN: MapAppUsageStep.USER_AUTHENTICATION,
    LOGOUT: MapAppUsageStep.HOME_SCREEN,
};
