import CognitoClient from '@mancho.devs/cognito';
import {
    LoginModalNotificationTypes,
    LoginModalVerifyTypes,
    loginModalFailureNotification,
    loginModalSuccessNotification,
    loginModalVerifyRequest,
} from '../actions';
import { buildAuthenticationStateForEpic } from '../__mocks__/AuthenticationState';
import { verifyCognitoEpic } from './epicTestHelpers';

describe('user sign up tests', () => {
    it.each([
        [Promise.resolve(), loginModalSuccessNotification(LoginModalNotificationTypes.SIGNUP)],
        [
            Promise.reject({ code: 'MockedException', message: 'signUp() went wrong' }),
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
            Promise.reject({ code: 'MockedException', message: 'signUpConfirmCode() went wrong' }),
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
