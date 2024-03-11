import { MapAppReducer } from '../MapAppReducer';

describe('MapApp reducer tests', () => {
    it('should return initial state: user is not logged in', () => {
        const initialState = MapAppReducer();

        const expectedInitialState = {
            isUserLoggedIn: false,
        };

        expect(initialState).toEqual(expectedInitialState);
    });
});
