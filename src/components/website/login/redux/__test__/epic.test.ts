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
        [Promise.resolve(), loginModalSuccessNotification(LoginModalNotificationTypes.SIGNUP)],
        [
            Promise.reject(),
            loginModalFailureNotification(LoginModalNotificationTypes.SIGNUP, 'remoteAuthServiceUnknownException'),
        ],
    ])(
        'should dispatch sign up notification when remote answer is: %s',
        async (remoteServiceAnswer, expectedAction) => {
            jest.spyOn(CognitoClient.prototype, 'signUp').mockImplementation(async (): Promise<any> => {
                return remoteServiceAnswer;
            });

            const initialState = buildAuthenticationStateForEpic({});
            const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.USER_PASSWORD);

            await verifyCognitoEpic(sentAction, initialState, expectedAction);
        },
    );
});

describe('user sign up OTP code confirmation tests', () => {
    it.each([
        [Promise.resolve(), loginModalSuccessNotification(LoginModalNotificationTypes.OTP)],
        [
            Promise.reject(),
            loginModalFailureNotification(LoginModalNotificationTypes.OTP, 'remoteAuthServiceUnknownException'),
        ],
    ])('should dispatch OTP notification when remote answer is: %s', async (remoteServiceAnswer, expectedAction) => {
        jest.spyOn(CognitoClient.prototype, 'signUpConfirmCode').mockImplementation(async (): Promise<any> => {
            return remoteServiceAnswer;
        });

        const initialState = buildAuthenticationStateForEpic({});
        const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.OTP);

        await verifyCognitoEpic(sentAction, initialState, expectedAction);
    });
});

describe('user sign in tests', () => {
    it.each([
        [Promise.resolve(), loginModalSuccessNotification(LoginModalNotificationTypes.SIGN_IN)],
        [
            Promise.reject(),
            loginModalFailureNotification(LoginModalNotificationTypes.SIGN_IN, 'remoteAuthServiceUnknownException'),
        ],
    ])('should dispatch OTP notification when remote answer is: %s', async (remoteServiceAnswer, expectedAction) => {
        jest.spyOn(CognitoClient.prototype, 'signIn').mockImplementation(async (): Promise<any> => {
            return remoteServiceAnswer;
        });

        const initialState = buildAuthenticationStateForEpic({});
        const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.USER_EMAIL_AND_PASSWORD);

        await verifyCognitoEpic(sentAction, initialState, expectedAction);
    });
});

describe('password reset tests', () => {
    it('should not call cognito service on email verification during mail input step', async () => {
        jest.spyOn(CognitoClient.prototype, 'forgotPassword').mockImplementation(() => Promise.resolve());
        const initialState = buildAuthenticationStateForEpic({ step: AuthenticationStep.MAIL_INPUT });
        const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.USER_EMAIL);

        await verifyCognitoEpic(sentAction, initialState, loginModalNoAction());
    });

    it.each([
        [Promise.resolve(), loginModalSuccessNotification(LoginModalNotificationTypes.FORGOT_PASSWORD)],
        [
            Promise.reject(),
            loginModalFailureNotification(
                LoginModalNotificationTypes.FORGOT_PASSWORD,
                'remoteAuthServiceUnknownException',
            ),
        ],
    ])('should dispatch OTP notification when remote answer is: %s', async (remoteServiceAnswer, expectedAction) => {
        jest.spyOn(CognitoClient.prototype, 'forgotPassword').mockImplementation(async (): Promise<any> => {
            return remoteServiceAnswer;
        });

        const initialState = buildAuthenticationStateForEpic({});
        const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.USER_EMAIL);

        await verifyCognitoEpic(sentAction, initialState, expectedAction);
    });
});
