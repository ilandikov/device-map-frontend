import { lastValueFrom, of } from 'rxjs';
import CognitoClient from '@mancho.devs/cognito';
import { signUpEpic } from '../epic';
import { LoginModalActionTypes, LoginModalSignUp } from '../actions';

jest.spyOn(CognitoClient.prototype, 'signUp').mockImplementation(
    async (username: string, password: string): Promise<any> => {
        if (username === 'signMeUp@cognito.com' && 'securely') {
            return Promise.resolve();
        }

        return Promise.reject();
    },
);

describe('sign up epic tests', () => {
    it('should dispatch sign up ok action on sign up', async () => {
        const sentAction: LoginModalSignUp = {
            type: LoginModalActionTypes.SIGNUP,
            email: 'signMeUp@cognito.com',
            password: 'securely',
        };

        const state$ = signUpEpic(of(sentAction));
        const receivedAction = await lastValueFrom(state$);

        expect(receivedAction).toEqual({ type: LoginModalActionTypes.SIGNUP_OK });
    });

    it('should dispatch sign up failed action on sign up', async () => {
        const sentAction: LoginModalSignUp = {
            type: LoginModalActionTypes.SIGNUP,
            email: 'notAValidEmail',
            password: 'softpassword',
        };

        const state$ = signUpEpic(of(sentAction));
        const receivedAction = await lastValueFrom(state$);

        expect(receivedAction).toEqual({ type: LoginModalActionTypes.SIGNUP_FAILED });
    });
});
