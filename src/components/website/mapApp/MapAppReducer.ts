export interface MapAppState {
    showProductDescription: boolean;
}

export const mapAppInitialState: MapAppState = {
    showProductDescription: true,
};

export function MapAppReducer(state: MapAppState = mapAppInitialState) {
    return state;
}
