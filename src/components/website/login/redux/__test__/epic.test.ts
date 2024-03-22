import { lastValueFrom, of } from 'rxjs';
import CognitoClient from '@mancho.devs/cognito';
import { signUpEpic } from '../epic';
import { LoginModalActionTypes, LoginModalSignUp } from '../actions';

jest.spyOn(CognitoClient.prototype, 'signUp').mockImplementation(async (): Promise<any> => {
    return Promise.resolve();
});

describe('sign up epic tests', () => {
    it('should answer sing up ok to sign up', async () => {
        const sentAction: LoginModalSignUp = { type: LoginModalActionTypes.SIGNUP };

        const state$ = signUpEpic(of(sentAction));
        const receivedAction = await lastValueFrom(state$);

        expect(receivedAction).toEqual({ type: LoginModalActionTypes.SIGNUP_OK });
    });
});
