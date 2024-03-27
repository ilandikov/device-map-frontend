import { Observable, switchMap } from 'rxjs';
import CognitoClient from '@mancho.devs/cognito';
import { ofType } from 'redux-observable';
import {
    LoginModalAction,
    LoginModalActionTypes,
    LoginModalNotificationResult,
    LoginModalNotificationTypes,
    LoginModalVerifyRequest,
    LoginModalVerifyTypes,
    loginModalFailureNotification,
    loginModalNoAction,
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
                    if (authenticationState.error !== null) {
                        return loginModalNoAction();
                    }

                    return cognitoClient
                        .signUp(authenticationState.email, authenticationState.password)
                        .then(() => {
                            return loginModalNotification(LoginModalNotificationTypes.SIGNUP);
                        })
                        .catch(() => {
                            return loginModalFailureNotification(LoginModalNotificationTypes.SIGNUP);
                        });
                }
                case LoginModalVerifyTypes.OTP: {
                    const authenticationState: AuthenticationState = state$.value.authentication;
                    return cognitoClient
                        .signUpConfirmCode(authenticationState.email, authenticationState.OTP)
                        .then(() => {
                            return loginModalNotification(LoginModalNotificationTypes.OTP);
                        })
                        .catch(() => {
                            return {
                                type: LoginModalActionTypes.NOTIFICATION,
                                notification: LoginModalNotificationTypes.OTP,
                                result: LoginModalNotificationResult.FAILURE,
                            };
                        });
                }
            }

            return loginModalNoAction();
        }),
    );
}
