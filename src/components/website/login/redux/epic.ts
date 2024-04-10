import { Observable, catchError, mergeMap, of, switchMap } from 'rxjs';
import CognitoClient from '@mancho.devs/cognito';
import { ofType } from 'redux-observable';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
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
        switchMap((action: LoginModalVerifyRequest) => {
            const authenticationState: AuthenticationState = state$.value.authentication;
            const skipRequest = authenticationState.error !== null;
            if (skipRequest) {
                return of(loginModalNoAction());
            }
            switch (action.verify) {
                case LoginModalVerifyTypes.PASSWORD: {
                    switch (authenticationState.step) {
                        case AuthenticationStep.PASSWORD_CREATION_LOADING:
                            return fromPromise(
                                cognitoClient.signUp(authenticationState.email, authenticationState.password),
                            ).pipe(
                                mergeMap(() => {
                                    return of(loginModalSuccessNotification(LoginModalNotificationTypes.SIGN_UP));
                                }),
                                catchError((reason) => {
                                    return of(
                                        loginModalFailureNotification(
                                            LoginModalNotificationTypes.SIGN_UP,
                                            buildMessageFromCognitoException(reason),
                                        ),
                                    );
                                }),
                            );
                        case AuthenticationStep.PASSWORD_RESET_LOADING:
                            return fromPromise(
                                cognitoClient.confirmPassword(
                                    authenticationState.email,
                                    authenticationState.OTP,
                                    authenticationState.password,
                                ),
                            ).pipe(
                                mergeMap(() => {
                                    return of(
                                        loginModalSuccessNotification(LoginModalNotificationTypes.PASSWORD_RESET),
                                    );
                                }),
                                catchError((reason) => {
                                    return of(
                                        loginModalFailureNotification(
                                            LoginModalNotificationTypes.PASSWORD_RESET,
                                            buildMessageFromCognitoException(reason),
                                        ),
                                    );
                                }),
                            );
                    }

                    return of(loginModalNoAction());
                }
                case LoginModalVerifyTypes.EMAIL_AND_PASSWORD: {
                    return fromPromise(
                        cognitoClient.signIn(authenticationState.email, authenticationState.password),
                    ).pipe(
                        mergeMap(() => {
                            return of(loginModalSuccessNotification(LoginModalNotificationTypes.SIGN_IN));
                        }),
                        catchError((reason) => {
                            return of(
                                loginModalFailureNotification(
                                    LoginModalNotificationTypes.SIGN_IN,
                                    buildMessageFromCognitoException(reason),
                                ),
                            );
                        }),
                    );
                }
                case LoginModalVerifyTypes.OTP: {
                    if (authenticationState.step !== AuthenticationStep.PASSWORD_CREATION_OTP_LOADING) {
                        return of(loginModalNoAction());
                    }

                    return fromPromise(
                        cognitoClient.signUpConfirmCode(authenticationState.email, authenticationState.OTP),
                    ).pipe(
                        mergeMap(() => {
                            return of(loginModalSuccessNotification(LoginModalNotificationTypes.OTP));
                        }),
                        catchError((reason) => {
                            return of(
                                loginModalFailureNotification(
                                    LoginModalNotificationTypes.OTP,
                                    buildMessageFromCognitoException(reason),
                                ),
                            );
                        }),
                    );
                }
                case LoginModalVerifyTypes.EMAIL: {
                    if (authenticationState.step !== AuthenticationStep.PASSWORD_RESET_LOADING) {
                        return of(loginModalNoAction());
                    }

                    return fromPromise(cognitoClient.forgotPassword(authenticationState.email)).pipe(
                        mergeMap(() => {
                            return of(loginModalSuccessNotification(LoginModalNotificationTypes.FORGOT_PASSWORD));
                        }),
                        catchError((reason) => {
                            return of(
                                loginModalFailureNotification(
                                    LoginModalNotificationTypes.FORGOT_PASSWORD,
                                    buildMessageFromCognitoException(reason),
                                ),
                            );
                        }),
                    );
                }
            }

            return of(loginModalNoAction());
        }),
    );
}
