export interface MapAppState {
    showProductDescription: boolean;
}

export const mapAppInitialState: MapAppState = {
    showProductDescription: true,
};

export function MapAppReducer(state: MapAppState = mapAppInitialState, action = undefined) {
    if (!action) {
        return state;
    }

    switch (action.type) {
        case 'SHOW_LOGIN_MODAL':
            return { ...state, showProductDescription: false };
    }

    return state;
}
