import { MapAppReducer, MapAppState } from '../MapAppReducer';

describe('MapApp reducer tests', () => {
    it('should return initial state: user is not logged in', () => {
        const initialState = MapAppReducer();

        const expectedInitialState = {
            showProductDescription: true,
        };

        expect(initialState).toEqual(expectedInitialState);
    });

    it('should show login modal and hide product description on login click action', () => {
        const action = { type: 'SHOW_LOGIN_MODAL' };

        const resultingState = MapAppReducer(undefined, action);

        const expectedState: MapAppState = { showProductDescription: false };
        expect(resultingState).toEqual(expectedState);
    });
});
