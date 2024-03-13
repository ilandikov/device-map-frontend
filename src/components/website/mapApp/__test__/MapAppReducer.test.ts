import { MapAppActionTypes, MapAppReducer, MapAppState } from '../MapAppReducer';
import { UserAuthState } from '../../login/LoginModal';

describe('MapApp reducer tests', () => {
    it('should return initial state: user is not logged in', () => {
        const initialState = MapAppReducer();

        const expectedInitialState = {
            userAuthState: UserAuthState.PRODUCT_DESCRIPTION,
        };

        expect(initialState).toEqual(expectedInitialState);
    });

    it('should hide product description on login click action', () => {
        const action = { type: MapAppActionTypes.LOGIN_BUTTON_CLICK };

        const resultingState = MapAppReducer(undefined, action);

        const expectedState: MapAppState = {
            userAuthState: UserAuthState.WELCOME,
        };
        expect(resultingState).toEqual(expectedState);
    });
});
