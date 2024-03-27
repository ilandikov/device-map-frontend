import { lastValueFrom, of } from 'rxjs';
import CognitoClient from '@mancho.devs/cognito';
import { signUpEpic } from '../epic';
import { LoginModalActionTypes, LoginModalVerifyRequest, LoginModalVerifyTypes, loginModalNoAction } from '../actions';
import { buildState } from './reducer.test';

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
        const initialState = {
            value: {
                authentication: buildState({
                    email: 'signMeUp@cognito.com',
                    password: '%secure1Pass',
                    passwordError: null,
                }),
            },
        };
        const sentAction: LoginModalVerifyRequest = {
            type: LoginModalActionTypes.VERIFY_REQUEST,
            verify: LoginModalVerifyTypes.USER_PASSWORD,
        };

        const state$ = signUpEpic(of(sentAction), initialState);
        const receivedAction = await lastValueFrom(state$);

        expect(receivedAction).toEqual({ type: LoginModalActionTypes.SIGNUP_OK });
    });

    it('should dispatch sign up failed action on sign up for bad user credentials', async () => {
        const initialState = {
            value: { authentication: buildState({ email: 'notAValidEmail', password: 'softpassword' }) },
        };
        const sentAction: LoginModalVerifyRequest = {
            type: LoginModalActionTypes.VERIFY_REQUEST,
            verify: LoginModalVerifyTypes.USER_PASSWORD,
        };

        const state$ = signUpEpic(of(sentAction), initialState);
        const receivedAction = await lastValueFrom(state$);

        expect(receivedAction).toEqual({ type: LoginModalActionTypes.SIGNUP_FAILED });
    });

    it('should dispatch no action needed action if password error is present', async () => {
        const initialState = {
            value: { authentication: buildState({ passwordError: new Error('ohNoSomethingIsWrong') }) },
        };
        const sentAction: LoginModalVerifyRequest = {
            type: LoginModalActionTypes.VERIFY_REQUEST,
            verify: LoginModalVerifyTypes.USER_PASSWORD,
        };

        const state$ = signUpEpic(of(sentAction), initialState);
        const receivedAction = await lastValueFrom(state$);

        expect(receivedAction).toEqual(loginModalNoAction());
    });
});
