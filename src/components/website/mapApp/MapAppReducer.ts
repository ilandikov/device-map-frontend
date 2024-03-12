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

    return state;
}
