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

            return processCognitoRequest(action, authenticationState, cognitoClient);
        }),
    );
}
function processCognitoRequest(
    action: LoginModalRemoteRequest,
    authenticationState: LoginModalAuthenticationState,
    cognitoClient,
): Observable<LoginModalAction | MapAppAction> {
    switch (action.request) {
        case LoginModalRemoteRequestType.PASSWORD:
            switch (authenticationState.step) {
                case AuthenticationStep.PASSWORD_CREATION_LOADING:
                    return signUp(authenticationState, cognitoClient);
                case AuthenticationStep.PASSWORD_RESET_LOADING:
                    return confirmPassword(authenticationState, cognitoClient);
            }

            break;
        case LoginModalRemoteRequestType.USERNAME_AND_PASSWORD:
            return signIn(authenticationState, cognitoClient);
        case LoginModalRemoteRequestType.OTP:
            if (authenticationState.step !== AuthenticationStep.PASSWORD_CREATION_OTP_LOADING) {
                return EMPTY;
            }

            return sendSignUpOTP(authenticationState, cognitoClient);
        case LoginModalRemoteRequestType.OTP_RESEND:
            return resendOTP(authenticationState, cognitoClient);
        case LoginModalRemoteRequestType.USERNAME:
            if (authenticationState.step !== AuthenticationStep.PASSWORD_RESET_LOADING) {
                return EMPTY;
            }

            return sendForgotPasswordOTP(authenticationState, cognitoClient);
        case LoginModalRemoteRequestType.SIGN_OUT:
            return signOut(cognitoClient);
    }

    return EMPTY;
}

function signUp(authenticationState: LoginModalAuthenticationState, cognitoClient) {
    return fromPromise(cognitoClient.signUp(authenticationState.email, authenticationState.password)).pipe(
        mergeMap(() => {
            return from([loginModalRemoteAnswerSuccess(LoginModalRemoteAnswerType.SIGN_UP)]);
        }),
        catchError((error) => {
            return of(loginModalRemoteAnswerFailure(LoginModalRemoteAnswerType.SIGN_UP, reasonFromCognitoError(error)));
        }),
    );
}

function confirmPassword(authenticationState: LoginModalAuthenticationState, cognitoClient) {
    return fromPromise(
        cognitoClient.confirmPassword(authenticationState.email, authenticationState.OTP, authenticationState.password),
    ).pipe(
        mergeMap(() => {
            return mapAppAuthenticationCompleted()
                ? from([
                      loginModalRemoteAnswerSuccess(LoginModalRemoteAnswerType.PASSWORD_RESET),
                      mapAppAuthenticationCompleted(),
                  ])
                : from([loginModalRemoteAnswerSuccess(LoginModalRemoteAnswerType.PASSWORD_RESET)]);
        }),
        catchError((error) => {
            return of(
                loginModalRemoteAnswerFailure(LoginModalRemoteAnswerType.PASSWORD_RESET, reasonFromCognitoError(error)),
            );
        }),
    );
}

function signIn(authenticationState: LoginModalAuthenticationState, cognitoClient) {
    return fromPromise(cognitoClient.signIn(authenticationState.email, authenticationState.password)).pipe(
        mergeMap(() => {
            return from([
                loginModalRemoteAnswerSuccess(LoginModalRemoteAnswerType.SIGN_IN),
                mapAppAuthenticationCompleted(),
            ]);
        }),
        catchError((error) => {
            return of(loginModalRemoteAnswerFailure(LoginModalRemoteAnswerType.SIGN_IN, reasonFromCognitoError(error)));
        }),
    );
}

function sendSignUpOTP(authenticationState: LoginModalAuthenticationState, cognitoClient) {
    return fromPromise(cognitoClient.signUpConfirmCode(authenticationState.email, authenticationState.OTP)).pipe(
        mergeMap(() => {
            return mapAppAuthenticationCompleted()
                ? from([loginModalRemoteAnswerSuccess(LoginModalRemoteAnswerType.OTP), mapAppAuthenticationCompleted()])
                : from([loginModalRemoteAnswerSuccess(LoginModalRemoteAnswerType.OTP)]);
        }),
        catchError((error) => {
            return of(loginModalRemoteAnswerFailure(LoginModalRemoteAnswerType.OTP, reasonFromCognitoError(error)));
        }),
    );
}

function resendOTP(authenticationState: LoginModalAuthenticationState, cognitoClient) {
    return fromPromise(cognitoClient.resendConfirmCode(authenticationState.email)).pipe(
        mergeMap(() => {
            // eslint-disable-next-line no-constant-condition
            return null
                ? from([loginModalRemoteAnswerSuccess(LoginModalRemoteAnswerType.OTP_RESEND), null])
                : from([loginModalRemoteAnswerSuccess(LoginModalRemoteAnswerType.OTP_RESEND)]);
        }),
        catchError((error) => {
            return of(
                loginModalRemoteAnswerFailure(LoginModalRemoteAnswerType.OTP_RESEND, reasonFromCognitoError(error)),
            );
        }),
    );
}

function sendForgotPasswordOTP(authenticationState: LoginModalAuthenticationState, cognitoClient) {
    return fromPromise(cognitoClient.forgotPassword(authenticationState.email)).pipe(
        mergeMap(() => {
            // eslint-disable-next-line no-constant-condition
            return null
                ? from([loginModalRemoteAnswerSuccess(LoginModalRemoteAnswerType.FORGOT_PASSWORD), null])
                : from([loginModalRemoteAnswerSuccess(LoginModalRemoteAnswerType.FORGOT_PASSWORD)]);
        }),
        catchError((error) => {
            return of(
                loginModalRemoteAnswerFailure(
                    LoginModalRemoteAnswerType.FORGOT_PASSWORD,
                    reasonFromCognitoError(error),
                ),
            );
        }),
    );
}

function signOut(cognitoClient) {
    return fromPromise(cognitoClient.signOut()).pipe(
        mergeMap(() => {
            // eslint-disable-next-line no-constant-condition
            return null
                ? from([loginModalRemoteAnswerSuccess(LoginModalRemoteAnswerType.SIGN_OUT), null])
                : from([loginModalRemoteAnswerSuccess(LoginModalRemoteAnswerType.SIGN_OUT)]);
        }),
        catchError((error) => {
            return of(
                loginModalRemoteAnswerFailure(LoginModalRemoteAnswerType.SIGN_OUT, reasonFromCognitoError(error)),
            );
        }),
    );
}
