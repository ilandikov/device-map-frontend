interface MapAppState {
    isUserLoggedIn: boolean;
}

const mapAppInitialState: MapAppState = {
    isUserLoggedIn: false,
};

export function MapAppReducer(state: MapAppState = mapAppInitialState) {
    return state;
}

describe('MapApp reducer tests', () => {
    it('should return initial state: user is not logged in', () => {
        const initialState = MapAppReducer();

        const expectedInitialState = {
            isUserLoggedIn: false,
        };

        expect(initialState).toEqual(expectedInitialState);
    });
});
