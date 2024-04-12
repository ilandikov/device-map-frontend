import { Observable, catchError, from, mergeMap, of, switchMap } from 'rxjs';
import { ofType } from 'redux-observable';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { MapAppAction, mapAppAuthenticationCompleted } from '../../mapApp/redux/MapAppAction';
import {
    LoginModalAction,
    LoginModalActionTypes,
    LoginModalNotificationTypes,
    LoginModalVerifyRequest,
    LoginModalVerifyTypes,
    loginModalFailureNotification,
    loginModalNoAction,
    loginModalSuccessNotification,
} from './LoginModalAction';
import { AuthenticationStep, LoginModalAuthenticationState } from './state';
import { buildMessageFromCognitoException } from './cognitoHelpers';

export function cognito(action$, state$, { cognitoClient }): Observable<LoginModalAction> {
    return action$.pipe(
        ofType(LoginModalActionTypes.VERIFY_REQUEST),
        switchMap((action: LoginModalVerifyRequest) => {
            const authenticationState: LoginModalAuthenticationState = state$.value.loginModalAuthentication;
            const skipRequest = authenticationState.error !== null;
            if (skipRequest) {
                return of(loginModalNoAction());
            }
            switch (action.verify) {
                case LoginModalVerifyTypes.PASSWORD:
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
                                mapAppAuthenticationCompleted(),
                            );
                    }

                    break;
                case LoginModalVerifyTypes.EMAIL_AND_PASSWORD:
                    return observeEndpoint(
                        cognitoClient.signIn(authenticationState.email, authenticationState.password),
                        LoginModalNotificationTypes.SIGN_IN,
                        mapAppAuthenticationCompleted(),
                    );
                case LoginModalVerifyTypes.OTP:
                    if (authenticationState.step === AuthenticationStep.PASSWORD_CREATION_OTP_LOADING) {
                        return observeEndpoint(
                            cognitoClient.signUpConfirmCode(authenticationState.email, authenticationState.OTP),
                            LoginModalNotificationTypes.OTP,
                            mapAppAuthenticationCompleted(),
                        );
                    }
                    break;
                case LoginModalVerifyTypes.EMAIL:
                    if (authenticationState.step === AuthenticationStep.PASSWORD_RESET_LOADING) {
                        return observeEndpoint(
                            cognitoClient.forgotPassword(authenticationState.email),
                            LoginModalNotificationTypes.FORGOT_PASSWORD,
                        );
                    }
                    break;
                case LoginModalVerifyTypes.SIGN_OUT:
                    return observeEndpoint(cognitoClient.signOut(), LoginModalNotificationTypes.SIGN_OUT);
            }

            return of(loginModalNoAction());
        }),
    );
}

function observeEndpoint(
    endpoint: Promise<unknown>,
    notification: LoginModalNotificationTypes,
    mapAppAdditionalAction: MapAppAction | null = null,
): Observable<LoginModalAction | MapAppAction> {
    return fromPromise(endpoint).pipe(
        mergeMap(() => {
            if (mapAppAdditionalAction !== null) {
                return from([loginModalSuccessNotification(notification), mapAppAdditionalAction]);
            }

            return of(loginModalSuccessNotification(notification));
        }),
        catchError((reason) => {
            return of(loginModalFailureNotification(notification, buildMessageFromCognitoException(reason)));
        }),
    );
}
