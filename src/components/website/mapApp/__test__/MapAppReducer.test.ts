export function MapAppReducer() {
    return {
        isUserLoggedIn: false,
    };
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
