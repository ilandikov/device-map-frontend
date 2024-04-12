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
        const action = loginModalRemoteRequest(LoginModalRemoteRequestType.USERNAME);

        expect(action).toEqual({
            type: LoginModalActionTypes.REMOTE_REQUEST,
            request: LoginModalRemoteRequestType.USERNAME,
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
