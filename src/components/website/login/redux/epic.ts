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
                            return observeEndpoint(
                                cognitoClient.signUp(authenticationState.email, authenticationState.password),
                                LoginModalNotificationTypes.SIGN_UP,
                            );
                        case AuthenticationStep.PASSWORD_RESET_LOADING:
                            return observeEndpoint(
                                cognitoClient.confirmPassword(
                                    authenticationState.email,
                                    authenticationState.OTP,
                                    authenticationState.password,
                                ),
                                LoginModalNotificationTypes.PASSWORD_RESET,
                            );
                    }

                    break;
                }
                case LoginModalVerifyTypes.EMAIL_AND_PASSWORD:
                    return observeEndpoint(
                        cognitoClient.signIn(authenticationState.email, authenticationState.password),
                        LoginModalNotificationTypes.SIGN_IN,
                    );
                case LoginModalVerifyTypes.OTP: {
                    if (authenticationState.step !== AuthenticationStep.PASSWORD_CREATION_OTP_LOADING) {
                        return of(loginModalNoAction());
                    }

                    return observeEndpoint(
                        cognitoClient.signUpConfirmCode(authenticationState.email, authenticationState.OTP),
                        LoginModalNotificationTypes.OTP,
                    );
                }
                case LoginModalVerifyTypes.EMAIL: {
                    if (authenticationState.step !== AuthenticationStep.PASSWORD_RESET_LOADING) {
                        return of(loginModalNoAction());
                    }

                    return observeEndpoint(
                        cognitoClient.forgotPassword(authenticationState.email),
                        LoginModalNotificationTypes.FORGOT_PASSWORD,
                    );
                }
            }

            return of(loginModalNoAction());
        }),
    );
}

function observeEndpoint(
    endpoint: Promise<unknown>,
    notification: LoginModalNotificationTypes,
): Observable<LoginModalAction> {
    return fromPromise(endpoint).pipe(
        mergeMap(() => {
            return of(loginModalSuccessNotification(notification));
        }),
        catchError((reason) => {
            return of(loginModalFailureNotification(notification, buildMessageFromCognitoException(reason)));
        }),
    );
}
