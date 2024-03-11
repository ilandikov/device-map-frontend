export interface MapAppState {
    isUserLoggedIn: boolean;
}

export const mapAppInitialState: MapAppState = {
    isUserLoggedIn: false,
};

export function MapAppReducer(state: MapAppState = mapAppInitialState) {
    return state;
}
