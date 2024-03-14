import {
    LoginModalActionTypes,
    LoginModalVerifyTypes,
    loginModalButtonClick,
    loginModalVerifyRequest,
} from '../actions';

describe('Login Modal action creator tests', () => {
    it('should create button click action', () => {
        const action = loginModalButtonClick('fancyButton');

        expect(action).toEqual({ type: LoginModalActionTypes.BUTTON_CLICKED, button: 'fancyButton' });
    });

    it('should create verify request action', () => {
        const action = loginModalVerifyRequest(LoginModalVerifyTypes.USER_EMAIL);

        expect(action).toEqual({
            type: LoginModalActionTypes.VERIFY_REQUEST,
            verify: LoginModalVerifyTypes.USER_EMAIL,
        });
    });
});
