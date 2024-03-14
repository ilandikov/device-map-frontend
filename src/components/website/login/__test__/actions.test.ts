import {
    LoginModalActionTypes,
    LoginModalInputTypes,
    LoginModalVerifyTypes,
    loginModalButtonClick,
    loginModalInput,
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

    it('should create input action', () => {
        const action = loginModalInput(LoginModalInputTypes.USER_EMAIL, 'fancy@address.com');

        expect(action).toEqual({
            type: LoginModalActionTypes.USER_EMAIL_INPUT,
            input: {
                type: LoginModalInputTypes.USER_EMAIL,
                payload: 'fancy@address.com',
            },
        });
    });
});
