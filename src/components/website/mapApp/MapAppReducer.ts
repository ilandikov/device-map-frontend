export interface MapAppState {
    showProductDescription: boolean;
    showLoginModal: boolean;
    usageStep: MapAppUsageStep;
}

export enum MapAppUsageStep {
    PRODUCT_DESCRIPTION = 'PRODUCT_DESCRIPTION',
}

export const mapAppInitialState: MapAppState = {
    showProductDescription: true,
    showLoginModal: false,
    usageStep: MapAppUsageStep.PRODUCT_DESCRIPTION,
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
            return { ...state, showProductDescription: false, showLoginModal: true };
        case MapAppActionTypes.LOGIN_MODAL_CLOSED:
            return { ...state, showProductDescription: true, showLoginModal: false };
    }

    return state;
}
