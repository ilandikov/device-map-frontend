export interface MapAppState {
    usageStep: MapAppUsageStep;
}

export enum MapAppUsageStep {
    HOMESCREEN = 'HOMESCREEN',
    USER_AUTHENTICATION = 'USER_AUTHENTICATION',
}

export const mapAppInitialState: MapAppState = {
    usageStep: MapAppUsageStep.HOMESCREEN,
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

                usageStep: MapAppUsageStep.HOMESCREEN,
            };
    }

    return state;
}
