import { lastValueFrom, of } from 'rxjs';
import CognitoClient from '@mancho.devs/cognito';
import { signUpEpic } from '../epic';
import { LoginModalActionTypes, LoginModalVerifyTypes, loginModalNoAction, loginModalVerifyRequest } from '../actions';

import { buildAuthenticationState } from '../__mocks__/AuthenticationState';
import { AuthenticationState } from '../state';

jest.spyOn(CognitoClient.prototype, 'signUp').mockImplementation(
    async (username: string, password: string): Promise<any> => {
        if (username === 'signMeUp@cognito.com' && password === '%secure1Pass') {
            return Promise.resolve();
        }

        return Promise.reject();
    },
);

function buildAuthenticationStateForEpic(partialState: Partial<AuthenticationState>) {
    return {
        value: {
            authentication: buildAuthenticationState(partialState),
        },
    };
}

describe('sign up epic tests', () => {
    it('should dispatch sign up ok action on sign up if there is no password error', async () => {
        const initialState = buildAuthenticationStateForEpic({
            email: 'signMeUp@cognito.com',
            password: '%secure1Pass',
            passwordError: null,
        });
        const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.USER_PASSWORD);

        const state$ = signUpEpic(of(sentAction), initialState);
        const receivedAction = await lastValueFrom(state$);

        expect(receivedAction).toEqual({ type: LoginModalActionTypes.SIGNUP_OK });
    });

    it('should dispatch sign up failed action on sign up for bad user credentials', async () => {
        const initialState = {
            value: { authentication: buildAuthenticationState({ email: 'notAValidEmail', password: 'softpassword' }) },
        };
        const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.USER_PASSWORD);

        const state$ = signUpEpic(of(sentAction), initialState);
        const receivedAction = await lastValueFrom(state$);

        expect(receivedAction).toEqual({ type: LoginModalActionTypes.SIGNUP_FAILED });
    });

    it('should dispatch no action needed action if password error is present', async () => {
        const initialState = {
            value: { authentication: buildAuthenticationState({ passwordError: new Error('ohNoSomethingIsWrong') }) },
        };
        const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.USER_PASSWORD);

        const state$ = signUpEpic(of(sentAction), initialState);
        const receivedAction = await lastValueFrom(state$);

        expect(receivedAction).toEqual(loginModalNoAction());
    });
});
