import { Observable, map } from 'rxjs';
import CognitoClient from '@mancho.devs/cognito';
import { ofType } from 'redux-observable';
import { LoginModalActionTypes, LoginModalSignUp } from './actions';

const cognitoClient = new CognitoClient({
    UserPoolId: process.env.GATSBY_COGNITO_USER_POOL_ID,
    ClientId: process.env.GATSBY_COGNITO_CLIENT_ID,
});

export function signUpEpic(action$): Observable<LoginModalSignUp> {
    return action$.pipe(
        ofType(LoginModalActionTypes.SIGNUP),
        map(() =>
            cognitoClient
                .signUp('aUser', 'aPassword')
                .then(() => {
                    return { type: LoginModalActionTypes.SIGNUP_OK };
                })
                .catch(() => {
                    return { type: LoginModalActionTypes.SIGNUP_FAILED };
                }),
        ),
    );
}
