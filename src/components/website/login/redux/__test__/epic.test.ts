import {
    LoginModalNotificationTypes,
    LoginModalVerifyTypes,
    loginModalFailureNotification,
    loginModalSuccessNotification,
    loginModalVerifyRequest,
} from '../actions';
import { buildAuthenticationState } from '../__mocks__/AuthenticationState';
import { AuthenticationStep } from '../state';
import { PromiseResult, verifyCognitoEpic2, verifyCognitoEpicNoAction } from './epicTestHelpers';

describe('user sign up tests', () => {
    it.each([
        [PromiseResult.RESOLVE, loginModalSuccessNotification(LoginModalNotificationTypes.SIGN_UP)],
        [
            PromiseResult.REJECT,
            loginModalFailureNotification(LoginModalNotificationTypes.SIGN_UP, 'cognitoUnknownException'),
        ],
    ])(
        'should dispatch sign up notification when remote answer is: %s',
        async (remoteServiceAnswer, expectedAction) => {
            const initialState = buildAuthenticationState({
                step: AuthenticationStep.PASSWORD_CREATION_LOADING,
            });
            const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.PASSWORD);

            await verifyCognitoEpic2(sentAction, initialState, remoteServiceAnswer, expectedAction);
        },
    );

    it.each([
        [PromiseResult.RESOLVE, loginModalSuccessNotification(LoginModalNotificationTypes.PASSWORD_RESET)],
        [
            PromiseResult.REJECT,
            loginModalFailureNotification(LoginModalNotificationTypes.PASSWORD_RESET, 'cognitoUnknownException'),
        ],
    ])(
        'should dispatch password has been reset notification when remote answer is: %s',
        async (remoteServiceAnswer, expectedAction) => {
            const initialState = buildAuthenticationState({
                step: AuthenticationStep.PASSWORD_RESET_LOADING,
            });
            const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.PASSWORD);

            await verifyCognitoEpic2(sentAction, initialState, remoteServiceAnswer, expectedAction);
        },
    );
});

describe('user sign up OTP code confirmation tests (from password creation loading step)', () => {
    it.each([
        [PromiseResult.RESOLVE, loginModalSuccessNotification(LoginModalNotificationTypes.OTP)],
        [
            PromiseResult.REJECT,
            loginModalFailureNotification(LoginModalNotificationTypes.OTP, 'cognitoUnknownException'),
        ],
    ])('should dispatch OTP notification when remote answer is: %s', async (remoteServiceAnswer, expectedAction) => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_CREATION_OTP_LOADING,
        });
        const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.OTP);

        await verifyCognitoEpic2(sentAction, initialState, remoteServiceAnswer, expectedAction);
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
        [PromiseResult.RESOLVE, loginModalSuccessNotification(LoginModalNotificationTypes.SIGN_IN)],
        [
            PromiseResult.REJECT,
            loginModalFailureNotification(LoginModalNotificationTypes.SIGN_IN, 'cognitoUnknownException'),
        ],
    ])('should dispatch login notification when remote answer is: %s', async (remoteServiceAnswer, expectedAction) => {
        const initialState = buildAuthenticationState({ step: AuthenticationStep.LOGIN_LOADING });
        const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.EMAIL_AND_PASSWORD);

        await verifyCognitoEpic2(sentAction, initialState, remoteServiceAnswer, expectedAction);
    });
});

describe('password reset tests', () => {
    it('should not call cognito service on email verification during mail input step', async () => {
        const initialState = buildAuthenticationState({ step: AuthenticationStep.MAIL_INPUT });
        const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.EMAIL);

        await verifyCognitoEpicNoAction(sentAction, initialState);
    });

    it.each([
        [PromiseResult.RESOLVE, loginModalSuccessNotification(LoginModalNotificationTypes.FORGOT_PASSWORD)],
        [
            PromiseResult.REJECT,
            loginModalFailureNotification(LoginModalNotificationTypes.FORGOT_PASSWORD, 'cognitoUnknownException'),
        ],
    ])(
        'should dispatch forgot password notification when remote answer is: %s',
        async (remoteServiceAnswer, expectedAction) => {
            const initialState = buildAuthenticationState({ step: AuthenticationStep.PASSWORD_RESET_LOADING });
            const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.EMAIL);

            await verifyCognitoEpic2(sentAction, initialState, remoteServiceAnswer, expectedAction);
        },
    );
});
