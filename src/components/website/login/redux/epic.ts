import { Observable, switchMap } from 'rxjs';
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

export function cognito(action$, state$): Observable<LoginModalAction> {
    return action$.pipe(
        ofType(LoginModalActionTypes.VERIFY_REQUEST),
        switchMap(async (action: LoginModalVerifyRequest) => {
            switch (action.verify) {
                case LoginModalVerifyTypes.USER_PASSWORD: {
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
                }
                case LoginModalVerifyTypes.OTP: {
                    const authenticationState: AuthenticationState = state$.value.authentication;
                    return cognitoClient
                        .signUpConfirmCode(authenticationState.email, authenticationState.OTP)
                        .then(() => {
                            return loginModalNotification(LoginModalNotificationTypes.OTP_OK);
                        })
                        .catch(() => {
                            return { type: LoginModalActionTypes.OTP_FAILED };
                        });
                }
            }

            return loginModalNotification(LoginModalNotificationTypes.NO_ACTION);
        }),
    );
}
