import { Observable, switchMap } from 'rxjs';
import CognitoClient from '@mancho.devs/cognito';
import { ofType } from 'redux-observable';
import {
    LoginModalAction,
    LoginModalActionTypes,
    LoginModalNotificationTypes,
    LoginModalVerifyRequest,
    LoginModalVerifyTypes,
    loginModalFailureNotification,
    loginModalNoAction,
    loginModalSuccessNotification,
} from './actions';
import { AuthenticationState, AuthenticationStep } from './state';
import { buildMessageFromCognitoException } from './epicHelpers';

const cognitoClient = new CognitoClient({
    UserPoolId: process.env.GATSBY_COGNITO_USER_POOL_ID,
    ClientId: process.env.GATSBY_COGNITO_CLIENT_ID,
});

export function cognito(action$, state$): Observable<LoginModalAction> {
    return action$.pipe(
        ofType(LoginModalActionTypes.VERIFY_REQUEST),
        switchMap(async (action: LoginModalVerifyRequest) => {
            const authenticationState: AuthenticationState = state$.value.authentication;
            const skipRequest = authenticationState.error !== null;
            if (skipRequest) {
                return loginModalNoAction();
            }

            switch (action.verify) {
                case LoginModalVerifyTypes.PASSWORD: {
                    switch (authenticationState.step) {
                        case AuthenticationStep.PASSWORD_CREATION_OTP:
                            return cognitoClient
                                .signUp(authenticationState.email, authenticationState.password)
                                .then(() => {
                                    return loginModalSuccessNotification(LoginModalNotificationTypes.SIGN_UP);
                                })
                                .catch((reason) => {
                                    return loginModalFailureNotification(
                                        LoginModalNotificationTypes.SIGN_UP,
                                        buildMessageFromCognitoException(reason),
                                    );
                                });
                        case AuthenticationStep.PASSWORD_RESET_LOADING:
                            return cognitoClient
                                .confirmPassword(
                                    authenticationState.email,
                                    authenticationState.OTP,
                                    authenticationState.password,
                                )
                                .then(() => {
                                    return loginModalSuccessNotification(LoginModalNotificationTypes.PASSWORD_RESET);
                                })
                                .catch((reason) => {
                                    return loginModalFailureNotification(
                                        LoginModalNotificationTypes.PASSWORD_RESET,
                                        buildMessageFromCognitoException(reason),
                                    );
                                });
                    }

                    return loginModalNoAction();
                }
                case LoginModalVerifyTypes.EMAIL_AND_PASSWORD: {
                    return cognitoClient
                        .signIn(authenticationState.email, authenticationState.password)
                        .then(() => {
                            return loginModalSuccessNotification(LoginModalNotificationTypes.SIGN_IN);
                        })
                        .catch((reason) => {
                            return loginModalFailureNotification(
                                LoginModalNotificationTypes.SIGN_IN,
                                buildMessageFromCognitoException(reason),
                            );
                        });
                }
                case LoginModalVerifyTypes.OTP: {
                    if (authenticationState.step !== AuthenticationStep.PASSWORD_CREATION_OTP_LOADING) {
                        return loginModalNoAction();
                    }

                    return cognitoClient
                        .signUpConfirmCode(authenticationState.email, authenticationState.OTP)
                        .then(() => {
                            return loginModalSuccessNotification(LoginModalNotificationTypes.OTP);
                        })
                        .catch((reason) => {
                            return loginModalFailureNotification(
                                LoginModalNotificationTypes.OTP,
                                buildMessageFromCognitoException(reason),
                            );
                        });
                }
                case LoginModalVerifyTypes.EMAIL_FOR_PASSWORD_RESET: {
                    if (authenticationState.step !== AuthenticationStep.PASSWORD_RESET_LOADING) {
                        return loginModalNoAction();
                    }

                    return cognitoClient
                        .forgotPassword(authenticationState.email)
                        .then(() => {
                            return loginModalSuccessNotification(LoginModalNotificationTypes.FORGOT_PASSWORD);
                        })
                        .catch((reason) => {
                            return loginModalFailureNotification(
                                LoginModalNotificationTypes.FORGOT_PASSWORD,
                                buildMessageFromCognitoException(reason),
                            );
                        });
                }
            }

            return loginModalNoAction();
        }),
    );
}
