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

export enum MapAppActionTypes {
    LOGIN_MODAL_OPEN = 'LOGIN_MODAL_OPEN',
    LOGIN_MODAL_CLOSE = 'LOGIN_MODAL_CLOSE',
}

export function MapAppReducer(state: MapAppState = mapAppInitialState, action = undefined) {
    if (!action) {
        return state;
    }

    switch (action.type) {
        case MapAppActionTypes.LOGIN_MODAL_OPEN:
            return { ...state, usageStep: MapAppUsageStep.USER_AUTHENTICATION };
        case MapAppActionTypes.LOGIN_MODAL_CLOSE:
            return {
                ...state,
                usageStep: MapAppUsageStep.HOME_SCREEN,
            };
    }

    return state;
}
