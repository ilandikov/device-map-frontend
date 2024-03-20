import { MapAppActionTypes, MapAppReducer, MapAppState, MapAppUsageStep } from '../MapAppReducer';

describe('MapApp reducer tests', () => {
    it('should return initial state: user is not logged in', () => {
        const initialState = MapAppReducer();

        const expectedInitialState: MapAppState = {
            showProductDescription: true,
            showLoginModal: false,
            usageStep: MapAppUsageStep.PRODUCT_DESCRIPTION,
        };

        expect(initialState).toEqual(expectedInitialState);
    });

    it('should hide product description and show login modal on login click action', () => {
        const action = { type: MapAppActionTypes.LOGIN_BUTTON_CLICK };

        const resultingState = MapAppReducer(undefined, action);

        const expectedState: MapAppState = {
            showProductDescription: false,
            showLoginModal: true,
            usageStep: MapAppUsageStep.PRODUCT_DESCRIPTION,
        };
        expect(resultingState).toEqual(expectedState);
    });

    it('should show product description, hide login modal, move to homescreen on navigation cancel action', () => {
        const initialState: MapAppState = {
            showProductDescription: false,
            showLoginModal: true,
            usageStep: MapAppUsageStep.USER_AUTHENTICATION,
        };
        const action = { type: MapAppActionTypes.LOGIN_MODAL_CLOSED };

        const resultingState = MapAppReducer(initialState, action);

        const expectedState: MapAppState = {
            showProductDescription: true,
            showLoginModal: false,
            usageStep: MapAppUsageStep.PRODUCT_DESCRIPTION,
        };
        expect(resultingState).toEqual(expectedState);
    });
});
