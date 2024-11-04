import {
    LoginModalActionType,
    LoginModalInputType,
    LoginModalRemoteRequestType,
    loginModalButtonClick,
    loginModalInput,
    loginModalRemoteRequest,
} from '../LoginModalAction';

describe('Login Modal action creator tests', () => {
    it('should create button click action', () => {
        // @ts-expect-error
        const action = loginModalButtonClick('fancyButton');

        expect(action).toEqual({ type: LoginModalActionType.BUTTON_CLICKED, button: 'fancyButton' });
    });

    it('should create verify request action', () => {
        const action = loginModalRemoteRequest(LoginModalRemoteRequestType.USERNAME);

        expect(action).toEqual({
            type: LoginModalActionType.REMOTE_REQUEST,
            request: LoginModalRemoteRequestType.USERNAME,
        });
    });

    it('should create input action', () => {
        const action = loginModalInput(LoginModalInputType.EMAIL, 'fancy@address.com');

        expect(action).toEqual({
            type: LoginModalActionType.INPUT,
            input: {
                type: LoginModalInputType.EMAIL,
                payload: 'fancy@address.com',
            },
        });
    });
});
