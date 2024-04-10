import CognitoClient from '@mancho.devs/cognito';
import {
    LoginModalNotificationTypes,
    LoginModalVerifyTypes,
    loginModalFailureNotification,
    loginModalNoAction,
    loginModalSuccessNotification,
    loginModalVerifyRequest,
} from '../actions';
import { buildAuthenticationStateForEpic } from '../__mocks__/AuthenticationState';
import { AuthenticationStep } from '../state';
import { verifyCognitoEpic } from './epicTestHelpers';

describe('user sign up tests', () => {
    it.each([
        [Promise.resolve(), loginModalSuccessNotification(LoginModalNotificationTypes.SIGN_UP)],
        [
            Promise.reject(),
            loginModalFailureNotification(LoginModalNotificationTypes.SIGN_UP, 'cognitoUnknownException'),
        ],
    ])(
        'should dispatch sign up notification when remote answer is: %s',
        async (remoteServiceAnswer, expectedAction) => {
            jest.spyOn(CognitoClient.prototype, 'signUp').mockImplementation(async (): Promise<any> => {
                return remoteServiceAnswer;
            });

            const initialState = buildAuthenticationStateForEpic({
                step: AuthenticationStep.PASSWORD_CREATION_LOADING,
            });
            const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.PASSWORD);

            await verifyCognitoEpic(sentAction, initialState, expectedAction);
        },
    );

    it.each([
        [Promise.resolve(), loginModalSuccessNotification(LoginModalNotificationTypes.PASSWORD_RESET)],
        [
            Promise.reject(),
            loginModalFailureNotification(LoginModalNotificationTypes.PASSWORD_RESET, 'cognitoUnknownException'),
        ],
    ])(
        'should dispatch password has been reset notification when remote answer is: %s',
        async (remoteServiceAnswer, expectedAction) => {
            jest.spyOn(CognitoClient.prototype, 'confirmPassword').mockImplementation(async (): Promise<any> => {
                return remoteServiceAnswer;
            });

            const initialState = buildAuthenticationStateForEpic({
                step: AuthenticationStep.PASSWORD_RESET_LOADING,
            });
            const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.PASSWORD);

            await verifyCognitoEpic(sentAction, initialState, expectedAction);
        },
    );
});

describe('user sign up OTP code confirmation tests (from password creation loading step)', () => {
    it.each([
        [Promise.resolve(), loginModalSuccessNotification(LoginModalNotificationTypes.OTP)],
        [Promise.reject(), loginModalFailureNotification(LoginModalNotificationTypes.OTP, 'cognitoUnknownException')],
    ])('should dispatch OTP notification when remote answer is: %s', async (remoteServiceAnswer, expectedAction) => {
        jest.spyOn(CognitoClient.prototype, 'signUpConfirmCode').mockImplementation(async (): Promise<any> => {
            return remoteServiceAnswer;
        });

        const initialState = buildAuthenticationStateForEpic({
            step: AuthenticationStep.PASSWORD_CREATION_OTP_LOADING,
        });
        const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.OTP);

        await verifyCognitoEpic(sentAction, initialState, expectedAction);
    });

    it('should dispatch no action and not call signUp() from password reset loading step', async () => {
        const initialState = buildAuthenticationStateForEpic({
            step: AuthenticationStep.PASSWORD_RESET_LOADING,
        });
        const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.OTP);

        await verifyCognitoEpic(sentAction, initialState, loginModalNoAction());
    });
});

describe('user sign in tests', () => {
    it.each([
        [Promise.resolve(), loginModalSuccessNotification(LoginModalNotificationTypes.SIGN_IN)],
        [
            Promise.reject(),
            loginModalFailureNotification(LoginModalNotificationTypes.SIGN_IN, 'cognitoUnknownException'),
        ],
    ])('should dispatch login notification when remote answer is: %s', async (remoteServiceAnswer, expectedAction) => {
        jest.spyOn(CognitoClient.prototype, 'signIn').mockImplementation(async (): Promise<any> => {
            return remoteServiceAnswer;
        });

        const initialState = buildAuthenticationStateForEpic({ step: AuthenticationStep.LOGIN_LOADING });
        const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.EMAIL_AND_PASSWORD);

        await verifyCognitoEpic(sentAction, initialState, expectedAction);
    });
});

describe('password reset tests', () => {
    it('should not call cognito service on email verification during mail input step', async () => {
        jest.spyOn(CognitoClient.prototype, 'forgotPassword').mockImplementation(() => Promise.resolve());
        const initialState = buildAuthenticationStateForEpic({ step: AuthenticationStep.MAIL_INPUT });
        const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.EMAIL);

        await verifyCognitoEpic(sentAction, initialState, loginModalNoAction());
    });

    it.each([
        [Promise.resolve(), loginModalSuccessNotification(LoginModalNotificationTypes.FORGOT_PASSWORD)],
        [
            Promise.reject(),
            loginModalFailureNotification(LoginModalNotificationTypes.FORGOT_PASSWORD, 'cognitoUnknownException'),
        ],
    ])(
        'should dispatch forgot password notification when remote answer is: %s',
        async (remoteServiceAnswer, expectedAction) => {
            jest.spyOn(CognitoClient.prototype, 'forgotPassword').mockImplementation(async (): Promise<any> => {
                return remoteServiceAnswer;
            });

            const initialState = buildAuthenticationStateForEpic({ step: AuthenticationStep.PASSWORD_RESET_LOADING });
            const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.EMAIL);

            await verifyCognitoEpic(sentAction, initialState, expectedAction);
        },
    );
});
