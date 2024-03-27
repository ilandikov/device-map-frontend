import { Observable, filter, switchMap } from 'rxjs';
import CognitoClient from '@mancho.devs/cognito';
import { ofType } from 'redux-observable';
import {
    LoginModalAction,
    LoginModalActionTypes,
    LoginModalNotificationTypes,
    LoginModalVerifyRequest,
    LoginModalVerifyTypes,
    loginModalNotification,
} from './actions';
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
                return loginModalNotification(LoginModalNotificationTypes.NO_ACTION);
            }

            return cognitoClient
                .signUp(authenticationState.email, authenticationState.password)
                .then(() => {
                    return loginModalNotification(LoginModalNotificationTypes.SIGNUP_OK);
                })
                .catch(() => {
                    return { type: LoginModalActionTypes.SIGNUP_FAILED };
                });
        }),
    );
}
