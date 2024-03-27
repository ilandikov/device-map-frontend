import CognitoClient from '@mancho.devs/cognito';
import { LoginModalActionTypes, LoginModalVerifyTypes, loginModalNoAction, loginModalVerifyRequest } from '../actions';
import { buildAuthenticationStateForEpic } from '../__mocks__/AuthenticationState';
import { verifySignUpEpic } from './epicTestHelpers';

jest.spyOn(CognitoClient.prototype, 'signUp').mockImplementation(
    async (username: string, password: string): Promise<any> => {
        if (username === 'signMeUp@cognito.com' && password === '%secure1Pass') {
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
        });
        const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.USER_PASSWORD);

        await verifySignUpEpic(sentAction, initialState, { type: LoginModalActionTypes.SIGNUP_OK });
    });

    it('should dispatch sign up failed action on sign up for bad user credentials', async () => {
        const initialState = buildAuthenticationStateForEpic({ email: 'notAValidEmail', password: 'softpassword' });
        const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.USER_PASSWORD);

        await verifySignUpEpic(sentAction, initialState, { type: LoginModalActionTypes.SIGNUP_FAILED });
    });

    it('should dispatch no action needed action if password error is present', async () => {
        const initialState = buildAuthenticationStateForEpic({ passwordError: new Error('ohNoSomethingIsWrong') });
        const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.USER_PASSWORD);

        await verifySignUpEpic(sentAction, initialState, loginModalNoAction());
    });
});
