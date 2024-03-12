export interface MapAppState {
    showProductDescription: boolean;
}

export const mapAppInitialState: MapAppState = {
    showProductDescription: true,
};

export enum MapAppActionTypes {
    LOGIN_BUTTON_CLICK = 'SHOW_LOGIN_MODAL',
}

export function MapAppReducer(state: MapAppState = mapAppInitialState, action = undefined) {
    if (!action) {
        return state;
    }

    switch (action.type) {
        case MapAppActionTypes.LOGIN_BUTTON_CLICK:
            return { ...state, showProductDescription: false };
    }

    return state;
}
