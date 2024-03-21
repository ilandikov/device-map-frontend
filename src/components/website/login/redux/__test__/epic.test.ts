import { lastValueFrom, of } from 'rxjs';
import { signUpEpic } from '../epic';
import { LoginModalActionTypes, LoginModalSignUp } from '../actions';

describe('sign up epic tests', () => {
    it('should answer sing up ok to sign up', async () => {
        const sentAction: LoginModalSignUp = { type: LoginModalActionTypes.SIGNUP };

        const state$ = signUpEpic(of(sentAction));
        const receivedAction = await lastValueFrom(state$);

        expect(receivedAction).toEqual({ type: LoginModalActionTypes.SIGNUP_OK });
    });
});
