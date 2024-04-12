import {
    LoginModalNotificationTypes,
    LoginModalRemoteRequestType,
    loginModalFailureNotification,
    loginModalRemoteRequest,
    loginModalSuccessNotification,
} from '../LoginModalAction';
import { AuthenticationStep, buildAuthenticationState } from '../LoginModalAuthenticationState';
import { mapAppAuthenticationCompleted } from '../../../mapApp/redux/MapAppAction';
import { verifyCognitoEpicAction, verifyCognitoEpicNoAction } from './cognitoTestHelpers';

describe('user sign up tests', () => {
    it.each([
        [Promise.resolve(), [loginModalSuccessNotification(LoginModalNotificationTypes.SIGN_UP)]],
        [
            Promise.reject(),
            [loginModalFailureNotification(LoginModalNotificationTypes.SIGN_UP, 'cognitoUnknownException')],
        ],
    ])(
        'should dispatch sign up notification when remote answer is: %s',
        async (remoteServiceAnswer, expectedAction) => {
            const initialState = buildAuthenticationState({
                step: AuthenticationStep.PASSWORD_CREATION_LOADING,
            });
            const sentAction = loginModalRemoteRequest(LoginModalRemoteRequestType.PASSWORD);

            await verifyCognitoEpicAction(sentAction, initialState, remoteServiceAnswer, expectedAction);
        },
    );
});

describe('user password reset tests', () => {
    it.each([
        [
            Promise.resolve(),
            [
                loginModalSuccessNotification(LoginModalNotificationTypes.PASSWORD_RESET),
                mapAppAuthenticationCompleted(),
            ],
        ],
        [
            Promise.reject(),
            [loginModalFailureNotification(LoginModalNotificationTypes.PASSWORD_RESET, 'cognitoUnknownException')],
        ],
    ])(
        'should dispatch password has been reset notification when remote answer is: %s',
        async (remoteServiceAnswer, expectedAction) => {
            const initialState = buildAuthenticationState({
                step: AuthenticationStep.PASSWORD_RESET_LOADING,
            });
            const sentAction = loginModalRemoteRequest(LoginModalRemoteRequestType.PASSWORD);

            await verifyCognitoEpicAction(sentAction, initialState, remoteServiceAnswer, expectedAction);
        },
    );
});

describe('user sign up OTP code confirmation tests (from password creation loading step)', () => {
    it.each([
        [
            Promise.resolve(),
            [loginModalSuccessNotification(LoginModalNotificationTypes.OTP), mapAppAuthenticationCompleted()],
        ],
        [Promise.reject(), [loginModalFailureNotification(LoginModalNotificationTypes.OTP, 'cognitoUnknownException')]],
    ])('should dispatch OTP notification when remote answer is: %s', async (remoteServiceAnswer, expectedAction) => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_CREATION_OTP_LOADING,
        });
        const sentAction = loginModalRemoteRequest(LoginModalRemoteRequestType.OTP);

        await verifyCognitoEpicAction(sentAction, initialState, remoteServiceAnswer, expectedAction);
    });

    it('should dispatch no action and not call signUp() from password reset loading step', async () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_RESET_LOADING,
        });
        const sentAction = loginModalRemoteRequest(LoginModalRemoteRequestType.OTP);

        await verifyCognitoEpicNoAction(sentAction, initialState);
    });
});

describe('user sign in tests', () => {
    it.each([
        [
            Promise.resolve(),
            [loginModalSuccessNotification(LoginModalNotificationTypes.SIGN_IN), mapAppAuthenticationCompleted()],
        ],
        [
            Promise.reject(),
            [loginModalFailureNotification(LoginModalNotificationTypes.SIGN_IN, 'cognitoUnknownException')],
        ],
    ])('should dispatch login notification when remote answer is: %s', async (remoteServiceAnswer, expectedAction) => {
        const initialState = buildAuthenticationState({ step: AuthenticationStep.LOGIN_LOADING });
        const sentAction = loginModalRemoteRequest(LoginModalRemoteRequestType.USERNAME_AND_PASSWORD);

        await verifyCognitoEpicAction(sentAction, initialState, remoteServiceAnswer, expectedAction);
    });
});

describe('password reset request tests', () => {
    it('should not call cognito service on email verification during mail input step', async () => {
        const initialState = buildAuthenticationState({ step: AuthenticationStep.MAIL_INPUT });
        const sentAction = loginModalRemoteRequest(LoginModalRemoteRequestType.USERNAME);

        await verifyCognitoEpicNoAction(sentAction, initialState);
    });

    it.each([
        [Promise.resolve(), [loginModalSuccessNotification(LoginModalNotificationTypes.FORGOT_PASSWORD)]],
        [
            Promise.reject(),
            [loginModalFailureNotification(LoginModalNotificationTypes.FORGOT_PASSWORD, 'cognitoUnknownException')],
        ],
    ])(
        'should dispatch forgot password notification when remote answer is: %s',
        async (remoteServiceAnswer, expectedAction) => {
            const initialState = buildAuthenticationState({
                step: AuthenticationStep.PASSWORD_RESET_LOADING,
            });
            const sentAction = loginModalRemoteRequest(LoginModalRemoteRequestType.USERNAME);

            await verifyCognitoEpicAction(sentAction, initialState, remoteServiceAnswer, expectedAction);
        },
    );
});

describe('user sign out tests', () => {
    it.each([
        [Promise.resolve(), [loginModalSuccessNotification(LoginModalNotificationTypes.SIGN_OUT)]],
        [
            Promise.reject(),
            [loginModalFailureNotification(LoginModalNotificationTypes.SIGN_OUT, 'cognitoUnknownException')],
        ],
    ])('should sign out user when remote answer is: %s', async (remoteServiceAnswer, expectedAction) => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_RESET_LOADING,
        });
        const sentAction = loginModalRemoteRequest(LoginModalRemoteRequestType.SIGN_OUT);

        await verifyCognitoEpicAction(sentAction, initialState, remoteServiceAnswer, expectedAction);
    });
});
