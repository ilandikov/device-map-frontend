import CognitoClient from '@mancho.devs/cognito';
import {
    LoginModalActionTypes,
    LoginModalNotificationTypes,
    LoginModalVerifyTypes,
    loginModalNotification,
    loginModalVerifyRequest,
} from '../actions';
import { buildAuthenticationStateForEpic } from '../__mocks__/AuthenticationState';
import { verifyCognitoEpic } from './epicTestHelpers';

jest.spyOn(CognitoClient.prototype, 'signUp').mockImplementation(
    async (username: string, password: string): Promise<any> => {
        if (username === 'signMeUp@cognito.com' && password === '%secure1Pass') {
            return Promise.resolve();
        }

        return Promise.reject();
    },
);

jest.spyOn(CognitoClient.prototype, 'signUpConfirmCode').mockImplementation(
    async (username: string, verificationCode: string): Promise<any> => {
        if (username === 'verify@code.me' && verificationCode === '849621') {
            return Promise.resolve();
        }

        return Promise.reject();
    },
);

describe('sign up epic tests', () => {
    it('should dispatch sign up ok action on sign up if there is no password error', async () => {
        const initialState = buildAuthenticationStateForEpic({
            email: 'signMeUp@cognito.com',
            password: '%secure1Pass',
            passwordError: null,
            emailError: null,
        });
        const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.USER_PASSWORD);

        await verifyCognitoEpic(
            sentAction,
            initialState,
            loginModalNotification(LoginModalNotificationTypes.SIGNUP_OK),
        );
    });

    it('should dispatch sign up failed action on sign up for bad user credentials', async () => {
        const initialState = buildAuthenticationStateForEpic({
            email: 'notAValidEmailIHaveInput',
            password: 'short',
        });
        const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.USER_PASSWORD);

        await verifyCognitoEpic(sentAction, initialState, { type: LoginModalActionTypes.SIGNUP_FAILED });
    });

    it('should dispatch no action needed action if password error is present', async () => {
        const initialState = buildAuthenticationStateForEpic({
            passwordError: new Error('ohNoSomethingIsWrongWeCannotSolve'),
            emailError: new Error('ohNoSomethingIsWrongWeCannotSolve'),
        });
        const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.USER_PASSWORD);

        await verifyCognitoEpic(
            sentAction,
            initialState,
            loginModalNotification(LoginModalNotificationTypes.NO_ACTION),
        );
    });
});

describe('OTP verification epic tests', () => {
    it('should dispatch OTP verification ok action if the OTP code is incorrect', async () => {
        const initialState = buildAuthenticationStateForEpic({ email: 'verify@code.me', OTP: '849621' });
        const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.OTP);

        await verifyCognitoEpic(sentAction, initialState, loginModalNotification(LoginModalNotificationTypes.OTP_OK));
    });

    it('should dispatch OTP verification failed action if the OTP code is incorrect', async () => {
        const initialState = buildAuthenticationStateForEpic({ email: 'verify@code.me', OTP: '000000' });
        const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.OTP);

        await verifyCognitoEpic(sentAction, initialState, { type: LoginModalActionTypes.OTP_FAILED });
    });
});
