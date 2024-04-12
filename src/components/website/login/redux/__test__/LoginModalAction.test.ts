import {
    LoginModalActionTypes,
    LoginModalInputTypes,
    LoginModalRemoteRequestType,
    loginModalButtonClick,
    loginModalInput,
    loginModalRemoteRequest,
} from '../LoginModalAction';

describe('Login Modal action creator tests', () => {
    it('should create button click action', () => {
        const action = loginModalButtonClick('fancyButton');

        expect(action).toEqual({ type: LoginModalActionTypes.BUTTON_CLICKED, button: 'fancyButton' });
    });

    it('should create verify request action', () => {
        const action = loginModalRemoteRequest(LoginModalRemoteRequestType.EMAIL);

        expect(action).toEqual({
            type: LoginModalActionTypes.VERIFY_REQUEST,
            verify: LoginModalRemoteRequestType.EMAIL,
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
