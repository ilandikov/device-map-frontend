import { Observable, switchMap } from 'rxjs';
import CognitoClient from '@mancho.devs/cognito';
import { ofType } from 'redux-observable';
import { LoginModalActionTypes, LoginModalSignUp } from './actions';
import { AuthenticationState } from './state';

const cognitoClient = new CognitoClient({
    UserPoolId: process.env.GATSBY_COGNITO_USER_POOL_ID,
    ClientId: process.env.GATSBY_COGNITO_CLIENT_ID,
});

export function signUpEpic(action$, state$): Observable<LoginModalSignUp> {
    return action$.pipe(
        ofType(LoginModalActionTypes.SIGNUP),
        switchMap(async (action: LoginModalSignUp) => {
            const authenticationState: AuthenticationState = state$.value.authentication;
            if (authenticationState.passwordError !== null) {
                return { type: 'NO_ACTION_NEEDED' };
            }

            return cognitoClient
                .signUp(action.email, action.password)
                .then(() => {
                    return { type: LoginModalActionTypes.SIGNUP_OK };
                })
                .catch(() => {
                    return { type: LoginModalActionTypes.SIGNUP_FAILED };
                });
        }),
    );
}
