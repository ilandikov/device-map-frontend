import { MapAppActionTypes, MapAppReducer, MapAppState } from '../MapAppReducer';

describe('MapApp reducer tests', () => {
    it('should return initial state: user is not logged in', () => {
        const initialState = MapAppReducer();

        const expectedInitialState = {
            showProductDescription: true,
            showLoginModal: false,
        };

        expect(initialState).toEqual(expectedInitialState);
    });

    it('should hide product description and show login modal on login click action', () => {
        const action = { type: MapAppActionTypes.LOGIN_BUTTON_CLICK };

        const resultingState = MapAppReducer(undefined, action);

        const expectedState: MapAppState = { showProductDescription: false, showLoginModal: true };
        expect(resultingState).toEqual(expectedState);
    });

    it('should show product description and hide login modal on navigation cancel action', () => {
        const initialState: MapAppState = { showProductDescription: false, showLoginModal: true };
        const action = { type: MapAppActionTypes.LOGIN_MODAL_CLOSED };

        const resultingState = MapAppReducer(initialState, action);

        const expectedState: MapAppState = { showProductDescription: true, showLoginModal: false };
        expect(resultingState).toEqual(expectedState);
    });
});
