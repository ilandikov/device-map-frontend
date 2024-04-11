import {
    LoginModalNotificationTypes,
    LoginModalVerifyTypes,
    loginModalFailureNotification,
    loginModalSuccessNotification,
    loginModalVerifyRequest,
} from '../actions';
import { AuthenticationStep, buildAuthenticationState } from '../state';
import { mapAppLoginModalClose } from '../../../mapApp/redux/actions';
import { verifyCognitoEpicAction, verifyCognitoEpicNoAction } from './epicTestHelpers';

const cognitoReason = 'cognitoUnknownException';

describe('user sign up tests', () => {
    it.each([
        [Promise.resolve(), [loginModalSuccessNotification(LoginModalNotificationTypes.SIGN_UP)]],
        [Promise.reject(), [loginModalFailureNotification(LoginModalNotificationTypes.SIGN_UP, cognitoReason)]],
    ])(
        'should dispatch sign up notification when remote answer is: %s',
        async (remoteServiceAnswer, expectedAction) => {
            const initialState = buildAuthenticationState({
                step: AuthenticationStep.PASSWORD_CREATION_LOADING,
            });
            const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.PASSWORD);

            await verifyCognitoEpicAction(sentAction, initialState, remoteServiceAnswer, expectedAction);
        },
    );

    it.each([
        [
            Promise.resolve(),
            [loginModalSuccessNotification(LoginModalNotificationTypes.PASSWORD_RESET), mapAppLoginModalClose()],
        ],
        [Promise.reject(), [loginModalFailureNotification(LoginModalNotificationTypes.PASSWORD_RESET, cognitoReason)]],
    ])(
        'should dispatch password has been reset notification when remote answer is: %s',
        async (remoteServiceAnswer, expectedAction) => {
            const initialState = buildAuthenticationState({
                step: AuthenticationStep.PASSWORD_RESET_LOADING,
            });
            const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.PASSWORD);

            await verifyCognitoEpicAction(sentAction, initialState, remoteServiceAnswer, expectedAction);
        },
    );
});

describe('user sign up OTP code confirmation tests (from password creation loading step)', () => {
    it.each([
        [Promise.resolve(), [loginModalSuccessNotification(LoginModalNotificationTypes.OTP), mapAppLoginModalClose()]],
        [Promise.reject(), [loginModalFailureNotification(LoginModalNotificationTypes.OTP, cognitoReason)]],
    ])('should dispatch OTP notification when remote answer is: %s', async (remoteServiceAnswer, expectedAction) => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_CREATION_OTP_LOADING,
        });
        const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.OTP);

        await verifyCognitoEpicAction(sentAction, initialState, remoteServiceAnswer, expectedAction);
    });

    it('should dispatch no action and not call signUp() from password reset loading step', async () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_RESET_LOADING,
        });
        const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.OTP);

        await verifyCognitoEpicNoAction(sentAction, initialState);
    });
});

describe('user sign in tests', () => {
    it.each([
        [
            Promise.resolve(),
            [loginModalSuccessNotification(LoginModalNotificationTypes.SIGN_IN), mapAppLoginModalClose()],
        ],
        [Promise.reject(), [loginModalFailureNotification(LoginModalNotificationTypes.SIGN_IN, cognitoReason)]],
    ])('should dispatch login notification when remote answer is: %s', async (remoteServiceAnswer, expectedAction) => {
        const initialState = buildAuthenticationState({ step: AuthenticationStep.LOGIN_LOADING });
        const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.EMAIL_AND_PASSWORD);

        await verifyCognitoEpicAction(sentAction, initialState, remoteServiceAnswer, expectedAction);
    });
});

describe('password reset tests', () => {
    it('should not call cognito service on email verification during mail input step', async () => {
        const initialState = buildAuthenticationState({ step: AuthenticationStep.MAIL_INPUT });
        const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.EMAIL);

        await verifyCognitoEpicNoAction(sentAction, initialState);
    });

    it.each([
        [Promise.resolve(), [loginModalSuccessNotification(LoginModalNotificationTypes.FORGOT_PASSWORD)]],
        [Promise.reject(), [loginModalFailureNotification(LoginModalNotificationTypes.FORGOT_PASSWORD, cognitoReason)]],
    ])(
        'should dispatch forgot password notification when remote answer is: %s',
        async (remoteServiceAnswer, expectedAction) => {
            const initialState = buildAuthenticationState({ step: AuthenticationStep.PASSWORD_RESET_LOADING });
            const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.EMAIL);

            await verifyCognitoEpicAction(sentAction, initialState, remoteServiceAnswer, expectedAction);
        },
    );
});
