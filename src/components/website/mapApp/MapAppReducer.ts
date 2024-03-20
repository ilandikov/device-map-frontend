export interface MapAppState {
    usageStep: MapAppUsageStep;
}

export enum MapAppUsageStep {
    HOME_SCREEN = 'HOME_SCREEN',
    USER_AUTHENTICATION = 'USER_AUTHENTICATION',
}

export const mapAppInitialState: MapAppState = {
    usageStep: MapAppUsageStep.HOME_SCREEN,
};

export enum MapAppActionTypes {
    LOGIN_BUTTON_CLICK = 'SHOW_LOGIN_MODAL',
    LOGIN_MODAL_CLOSED = 'LOGIN_MODAL_CLOSED',
}

export function MapAppReducer(state: MapAppState = mapAppInitialState, action = undefined) {
    if (!action) {
        return state;
    }

    switch (action.type) {
        case MapAppActionTypes.LOGIN_BUTTON_CLICK:
            return { ...state };
        case MapAppActionTypes.LOGIN_MODAL_CLOSED:
            return {
                ...state,

                usageStep: MapAppUsageStep.HOME_SCREEN,
            };
    }

    return state;
}
