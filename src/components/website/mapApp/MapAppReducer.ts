import { MapAppAction, MapAppActionTypes } from './redux/actions';

export interface MapAppState {
    usageStep: MapAppUsageStep;
}

export enum MapAppUsageStep {
    HOME_SCREEN = 'HOME_SCREEN',
    USER_AUTHENTICATION = 'USER_AUTHENTICATION',
    AUTHENTICATED_USER = 'AUTHENTICATED_USER',
}

export const mapAppInitialState: MapAppState = {
    usageStep: MapAppUsageStep.HOME_SCREEN,
};

export function MapAppReducer(state: MapAppState = mapAppInitialState, action: MapAppAction) {
    switch (action.type) {
        case MapAppActionTypes.LOGIN_MODAL_OPEN:
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
