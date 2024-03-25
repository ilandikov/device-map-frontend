import { lastValueFrom, of } from 'rxjs';
import CognitoClient from '@mancho.devs/cognito';
import { signUpEpic } from '../epic';
import { LoginModalActionTypes, LoginModalSignUp } from '../actions';
import { buildState } from './reducer.test';

jest.spyOn(CognitoClient.prototype, 'signUp').mockImplementation(
    async (username: string, password: string): Promise<any> => {
        if (username === 'signMeUp@cognito.com' && password === 'securely') {
            return Promise.resolve();
        }

        return Promise.reject();
    },
);

describe('sign up epic tests', () => {
    it('should dispatch sign up ok action on sign up if there is no password error', async () => {
        const initialState = { value: { authentication: buildState({ passwordError: null }) } };
        const sentAction: LoginModalSignUp = {
            type: LoginModalActionTypes.SIGNUP,
            email: 'signMeUp@cognito.com',
            password: 'securely',
        };

        const state$ = signUpEpic(of(sentAction), initialState);
        const receivedAction = await lastValueFrom(state$);

        expect(receivedAction).toEqual({ type: LoginModalActionTypes.SIGNUP_OK });
    });

    it('should dispatch sign up failed action on sign up for bad user credentials', async () => {
        const initialState = { value: { authentication: buildState({}) } };
        const sentAction: LoginModalSignUp = {
            type: LoginModalActionTypes.SIGNUP,
            email: 'notAValidEmail',
            password: 'softpassword',
        };

        const state$ = signUpEpic(of(sentAction), initialState);
        const receivedAction = await lastValueFrom(state$);

        expect(receivedAction).toEqual({ type: LoginModalActionTypes.SIGNUP_FAILED });
    });

    it('should dispatch no action needed action if password error is present', async () => {
        const initialState = { value: { authentication: buildState({ passwordError: new Error() }) } };
        const sentAction: LoginModalSignUp = {
            type: LoginModalActionTypes.SIGNUP,
            email: 'signMeUp@cognito.com',
            password: 'securely',
        };

        const state$ = signUpEpic(of(sentAction), initialState);
        const receivedAction = await lastValueFrom(state$);

        expect(receivedAction).toEqual({ type: 'NO_ACTION_NEEDED' });
    });
});
