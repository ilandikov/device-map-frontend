import { MapAppActionTypes, MapAppReducer, MapAppState, MapAppUsageStep } from '../MapAppReducer';

describe('MapApp reducer tests', () => {
    it('should return initial state: user is not logged in', () => {
        const initialState = MapAppReducer();

        const expectedInitialState: MapAppState = {
            usageStep: MapAppUsageStep.HOME_SCREEN,
        };

        expect(initialState).toEqual(expectedInitialState);
    });

    it('should hide product description and show login modal on login click action', () => {
        const action = { type: MapAppActionTypes.LOGIN_BUTTON_CLICK };

        const resultingState = MapAppReducer(undefined, action);

        const expectedState: MapAppState = {
            usageStep: MapAppUsageStep.HOME_SCREEN,
        };
        expect(resultingState).toEqual(expectedState);
    });

    it('should show product description, hide login modal, move to homescreen on navigation cancel action', () => {
        const initialState: MapAppState = {
            usageStep: MapAppUsageStep.USER_AUTHENTICATION,
        };
        const action = { type: MapAppActionTypes.LOGIN_MODAL_CLOSED };

        const resultingState = MapAppReducer(initialState, action);

        const expectedState: MapAppState = {
            usageStep: MapAppUsageStep.HOME_SCREEN,
        };
        expect(resultingState).toEqual(expectedState);
    });
});
