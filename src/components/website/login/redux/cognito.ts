import { EMPTY, Observable, catchError, from, mergeMap, of, switchMap } from 'rxjs';
import { ofType } from 'redux-observable';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { MapAppAction, mapAppAuthenticationCompleted } from '../../mapApp/redux/MapAppAction';
import {
    LoginModalAction,
    LoginModalActionType,
    LoginModalRemoteAnswerType,
    LoginModalRemoteRequest,
    LoginModalRemoteRequestType,
    loginModalRemoteAnswerFailure,
    loginModalRemoteAnswerSuccess,
} from './LoginModalAction';
import { AuthenticationStep, LoginModalAuthenticationState } from './LoginModalAuthenticationState';
import { reasonFromCognitoError } from './cognitoHelpers';

export function cognito(action$, state$, { cognitoClient }): Observable<LoginModalAction> {
    return action$.pipe(
        ofType(LoginModalActionType.REMOTE_REQUEST),
        switchMap((action: LoginModalRemoteRequest) => {
            const authenticationState: LoginModalAuthenticationState = state$.value.loginModalAuthentication;
            const skipRequest = authenticationState.error !== null;
            if (skipRequest) {
                return EMPTY;
            }
            switch (action.request) {
                case LoginModalRemoteRequestType.PASSWORD:
                    switch (authenticationState.step) {
                        case AuthenticationStep.PASSWORD_CREATION_LOADING:
                            return observeEndpoint(
                                cognitoClient.signUp(authenticationState.email, authenticationState.password),
                                LoginModalRemoteAnswerType.SIGN_UP,
                            );
                        case AuthenticationStep.PASSWORD_RESET_LOADING:
                            return observeEndpoint(
                                cognitoClient.confirmPassword(
                                    authenticationState.email,
                                    authenticationState.OTP,
                                    authenticationState.password,
                                ),
                                LoginModalRemoteAnswerType.PASSWORD_RESET,
                                mapAppAuthenticationCompleted(),
                            );
                    }

                    break;
                case LoginModalRemoteRequestType.USERNAME_AND_PASSWORD:
                    return fromPromise(
                        cognitoClient.signIn(authenticationState.email, authenticationState.password),
                    ).pipe(
                        mergeMap(() => {
                            return from([
                                loginModalRemoteAnswerSuccess(LoginModalRemoteAnswerType.SIGN_IN),
                                mapAppAuthenticationCompleted(),
                            ]);
                        }),
                        catchError((error) => {
                            return of(
                                loginModalRemoteAnswerFailure(
                                    LoginModalRemoteAnswerType.SIGN_IN,
                                    reasonFromCognitoError(error),
                                ),
                            );
                        }),
                    );
                case LoginModalRemoteRequestType.OTP:
                    if (authenticationState.step === AuthenticationStep.PASSWORD_CREATION_OTP_LOADING) {
                        return observeEndpoint(
                            cognitoClient.signUpConfirmCode(authenticationState.email, authenticationState.OTP),
                            LoginModalRemoteAnswerType.OTP,
                            mapAppAuthenticationCompleted(),
                        );
                    }
                    break;
                case LoginModalRemoteRequestType.OTP_RESEND:
                    return observeEndpoint(
                        cognitoClient.resendConfirmCode(authenticationState.email),
                        LoginModalRemoteAnswerType.OTP_RESEND,
                    );
                case LoginModalRemoteRequestType.USERNAME:
                    if (authenticationState.step === AuthenticationStep.PASSWORD_RESET_LOADING) {
                        return observeEndpoint(
                            cognitoClient.forgotPassword(authenticationState.email),
                            LoginModalRemoteAnswerType.FORGOT_PASSWORD,
                        );
                    }
                    break;
                case LoginModalRemoteRequestType.SIGN_OUT:
                    return observeEndpoint(cognitoClient.signOut(), LoginModalRemoteAnswerType.SIGN_OUT);
            }

            return EMPTY;
        }),
    );
}

function observeEndpoint(
    endpoint: Promise<unknown>,
    notification: LoginModalRemoteAnswerType,
    mapAppAdditionalAction: MapAppAction | null = null,
): Observable<LoginModalAction | MapAppAction> {
    return fromPromise(endpoint).pipe(
        mergeMap(() => {
            return mapAppAdditionalAction
                ? from([loginModalRemoteAnswerSuccess(notification), mapAppAdditionalAction])
                : from([loginModalRemoteAnswerSuccess(notification)]);
        }),
        catchError((error) => {
            return of(loginModalRemoteAnswerFailure(notification, reasonFromCognitoError(error)));
        }),
    );
}
