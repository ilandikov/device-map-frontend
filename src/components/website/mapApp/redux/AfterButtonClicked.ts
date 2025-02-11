import { MapAppButton, MapAppButtonClick } from './MapAppAction';
import { MapAppState } from './MapAppState';

// TODO these actions should reset the user and that's all. Setting usage step to be done with a separate action
export function afterButtonClicked(action: MapAppButtonClick): Partial<MapAppState> {
    if (action.button === MapAppButton.LOGOUT) {
        return { currentUserID: null };
    }

    return {};
}
