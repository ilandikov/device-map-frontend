import { MapAppActionTypes, MapAppReducer, MapAppState, MapAppUsageStep } from '../MapAppReducer';

describe('MapApp reducer tests', () => {
    it('should return initial state: user is not logged in', () => {
        const initialState = MapAppReducer();

        const expectedInitialState: MapAppState = {
            usageStep: MapAppUsageStep.HOME_SCREEN,
        };

        expect(initialState).toEqual(expectedInitialState);
    });

    it('should move to user authentication step on login click action', () => {
        const action = { type: MapAppActionTypes.LOGIN_MODAL_OPEN };

        const resultingState = MapAppReducer(undefined, action);

        const expectedState: MapAppState = {
            usageStep: MapAppUsageStep.USER_AUTHENTICATION,
        };
        expect(resultingState).toEqual(expectedState);
    });

    it('should move to homescreen on navigation cancel action', () => {
        const initialState: MapAppState = {
            usageStep: MapAppUsageStep.USER_AUTHENTICATION,
        };
        const action = { type: MapAppActionTypes.LOGIN_MODAL_CLOSE };

        const resultingState = MapAppReducer(initialState, action);

        const expectedState: MapAppState = {
            usageStep: MapAppUsageStep.HOME_SCREEN,
        };
        expect(resultingState).toEqual(expectedState);
    });
});
