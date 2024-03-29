import CognitoClient from '@mancho.devs/cognito';
import { of } from 'rxjs';
import {
    LoginModalNotificationTypes,
    LoginModalVerifyTypes,
    loginModalFailureNotification,
    loginModalNoAction,
    loginModalSuccessNotification,
    loginModalVerifyRequest,
} from '../actions';
import { buildAuthenticationStateForEpic } from '../__mocks__/AuthenticationState';
import { cognito } from '../epic';
import { verifyCognitoEpic } from './epicTestHelpers';

jest.spyOn(CognitoClient.prototype, 'signUp').mockImplementation(
    async (username: string, password: string): Promise<any> => {
        if (username === 'signMeUp@cognito.com' && password === '%secure1Pass') {
            return Promise.resolve();
        }

        return Promise.reject({ code: 'MockedException', message: 'signUp() went wrong' });
    },
);

jest.spyOn(CognitoClient.prototype, 'signUpConfirmCode').mockImplementation(
    async (username: string, verificationCode: string): Promise<any> => {
        if (username === 'verify@code.me' && verificationCode === '849621') {
            return Promise.resolve();
        }

        return Promise.reject({ code: 'MockedException', message: 'signIn() went wrong' });
    },
);

describe('epic test not related to a particular service', () => {
    it('should dispatch no action if there is an error', () => {
        const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.OTP);

        const state$ = cognito(of(sentAction));
        const actions = [];
        state$.forEach((action) => {
            actions.push(action);
        });
        expect(actions).toEqual([loginModalNoAction(), loginModalNoAction()]);
    });
});

describe('sign up epic tests', () => {
    it('should dispatch sign up ok action on sign up if there is no password error', async () => {
        const initialState = buildAuthenticationStateForEpic({
            email: 'signMeUp@cognito.com',
            password: '%secure1Pass',
            error: null,
        });
        const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.USER_PASSWORD);

        await verifyCognitoEpic(
            sentAction,
            initialState,
            loginModalSuccessNotification(LoginModalNotificationTypes.SIGNUP),
        );
    });

    it('should dispatch sign up failed action on sign up for bad user credentials', async () => {
        const initialState = buildAuthenticationStateForEpic({
            email: 'notAValidEmailIHaveInput',
            password: 'short',
        });
        const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.USER_PASSWORD);

        await verifyCognitoEpic(
            sentAction,
            initialState,
            loginModalFailureNotification(LoginModalNotificationTypes.SIGNUP, 'remoteAuthServiceUnknownException'),
        );
    });
});

describe('OTP verification epic tests', () => {
    it('should dispatch OTP verification ok action if the OTP code is incorrect', async () => {
        const initialState = buildAuthenticationStateForEpic({ email: 'verify@code.me', OTP: '849621' });
        const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.OTP);

        await verifyCognitoEpic(
            sentAction,
            initialState,
            loginModalSuccessNotification(LoginModalNotificationTypes.OTP),
        );
    });

    it('should dispatch OTP verification failed action if the OTP code is incorrect', async () => {
        const initialState = buildAuthenticationStateForEpic({ email: 'verify@code.me', OTP: '000000' });
        const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.OTP);

        await verifyCognitoEpic(
            sentAction,
            initialState,
            loginModalFailureNotification(LoginModalNotificationTypes.OTP, 'remoteAuthServiceUnknownException'),
        );
    });
});
