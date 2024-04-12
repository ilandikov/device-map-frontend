import {
    LoginModalActionTypes,
    LoginModalInputTypes,
    LoginModalVerifyTypes,
    loginModalButtonClick,
    loginModalInput,
    loginModalVerifyRequest,
} from '../LoginModalAction';

describe('Login Modal action creator tests', () => {
    it('should create button click action', () => {
        const action = loginModalButtonClick('fancyButton');

        expect(action).toEqual({ type: LoginModalActionTypes.BUTTON_CLICKED, button: 'fancyButton' });
    });

    it('should create verify request action', () => {
        const action = loginModalVerifyRequest(LoginModalVerifyTypes.EMAIL);

        expect(action).toEqual({
            type: LoginModalActionTypes.VERIFY_REQUEST,
            verify: LoginModalVerifyTypes.EMAIL,
        });
    });

    it('should create input action', () => {
        const action = loginModalInput(LoginModalInputTypes.EMAIL, 'fancy@address.com');

        expect(action).toEqual({
            type: LoginModalActionTypes.INPUT,
            input: {
                type: LoginModalInputTypes.EMAIL,
                payload: 'fancy@address.com',
            },
        });
    });
});
