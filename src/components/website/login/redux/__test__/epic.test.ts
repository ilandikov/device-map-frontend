import { lastValueFrom, of } from 'rxjs';
import CognitoClient from '@mancho.devs/cognito';
import { signUpEpic } from '../epic';
import { LoginModalActionTypes, LoginModalSignUp } from '../actions';

const signUpMock = jest.spyOn(CognitoClient.prototype, 'signUp');

describe('sign up epic tests', () => {
    beforeEach(() => {
        signUpMock.mockReset();
        signUpMock.mockImplementation(async (): Promise<any> => {
            return Promise;
        });
    });

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
        signUpMock.mockRejectedValue({});
        const sentAction: LoginModalSignUp = {
            type: LoginModalActionTypes.SIGNUP,
            email: 'signMeUp@cognito.com',
            password: 'securely',
        };

        const state$ = signUpEpic(of(sentAction));
        const receivedAction = await lastValueFrom(state$);

        expect(receivedAction).toEqual({ type: LoginModalActionTypes.SIGNUP_FAILED });
    });
});
