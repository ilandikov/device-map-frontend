import { Observable, filter, switchMap } from 'rxjs';
import CognitoClient from '@mancho.devs/cognito';
import { ofType } from 'redux-observable';
import { LoginModalAction, LoginModalActionTypes, LoginModalVerifyRequest, LoginModalVerifyTypes } from './actions';
import { AuthenticationState } from './state';

const cognitoClient = new CognitoClient({
    UserPoolId: process.env.GATSBY_COGNITO_USER_POOL_ID,
    ClientId: process.env.GATSBY_COGNITO_CLIENT_ID,
});

export function signUpEpic(action$, state$): Observable<LoginModalAction> {
    return action$.pipe(
        ofType(LoginModalActionTypes.VERIFY_REQUEST),
        filter((action: LoginModalVerifyRequest) => action.verify === LoginModalVerifyTypes.USER_PASSWORD),
        switchMap(async () => {
            const authenticationState: AuthenticationState = state$.value.authentication;
            if (authenticationState.passwordError !== null) {
                return { type: 'NO_ACTION_NEEDED' };
            }

            return cognitoClient
                .signUp(authenticationState.email, authenticationState.password)
                .then(() => {
                    return { type: LoginModalActionTypes.SIGNUP_OK };
                })
                .catch(() => {
                    return { type: LoginModalActionTypes.SIGNUP_FAILED };
                });
        }),
    );
}
