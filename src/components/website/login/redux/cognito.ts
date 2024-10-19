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

export function cognito(action$, state$, { cognitoClient }): Observable<LoginModalAction | MapAppAction> {
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

            return EMPTY;
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
        default:
            return EMPTY;
    }
}

function signUp(
    authenticationState: LoginModalAuthenticationState,
    cognitoClient,
): Observable<LoginModalAction | MapAppAction> {
    return fromPromise(cognitoClient.signUp(authenticationState.email, authenticationState.password)).pipe(
        mergeMap(() => of(loginModalRemoteAnswerSuccess(LoginModalRemoteAnswerType.SIGN_UP))),
        catchError((error) =>
            of(loginModalRemoteAnswerFailure(LoginModalRemoteAnswerType.SIGN_UP, reasonFromCognitoError(error))),
        ),
    );
}

function confirmPassword(
    authenticationState: LoginModalAuthenticationState,
    cognitoClient,
): Observable<LoginModalAction | MapAppAction> {
    return fromPromise(
        cognitoClient.confirmPassword(authenticationState.email, authenticationState.OTP, authenticationState.password),
    ).pipe(
        mergeMap(() =>
            from([
                loginModalRemoteAnswerSuccess(LoginModalRemoteAnswerType.PASSWORD_RESET),
                mapAppAuthenticationCompleted(),
            ]),
        ),
        catchError((error) =>
            of(loginModalRemoteAnswerFailure(LoginModalRemoteAnswerType.PASSWORD_RESET, reasonFromCognitoError(error))),
        ),
    );
}

function signIn(
    authenticationState: LoginModalAuthenticationState,
    cognitoClient,
): Observable<LoginModalAction | MapAppAction> {
    return fromPromise(cognitoClient.signIn(authenticationState.email, authenticationState.password)).pipe(
        mergeMap(() =>
            from([loginModalRemoteAnswerSuccess(LoginModalRemoteAnswerType.SIGN_IN), mapAppAuthenticationCompleted()]),
        ),
        catchError((error) =>
            of(loginModalRemoteAnswerFailure(LoginModalRemoteAnswerType.SIGN_IN, reasonFromCognitoError(error))),
        ),
    );
}

function sendSignUpOTP(
    authenticationState: LoginModalAuthenticationState,
    cognitoClient,
): Observable<LoginModalAction | MapAppAction> {
    return fromPromise(cognitoClient.signUpConfirmCode(authenticationState.email, authenticationState.OTP)).pipe(
        mergeMap(() =>
            from([loginModalRemoteAnswerSuccess(LoginModalRemoteAnswerType.OTP), mapAppAuthenticationCompleted()]),
        ),
        catchError((error) =>
            of(loginModalRemoteAnswerFailure(LoginModalRemoteAnswerType.OTP, reasonFromCognitoError(error))),
        ),
    );
}

function resendOTP(
    authenticationState: LoginModalAuthenticationState,
    cognitoClient,
): Observable<LoginModalAction | MapAppAction> {
    return fromPromise(cognitoClient.resendConfirmCode(authenticationState.email)).pipe(
        mergeMap(() => of(loginModalRemoteAnswerSuccess(LoginModalRemoteAnswerType.OTP_RESEND))),
        catchError((error) =>
            of(loginModalRemoteAnswerFailure(LoginModalRemoteAnswerType.OTP_RESEND, reasonFromCognitoError(error))),
        ),
    );
}

function sendForgotPasswordOTP(
    authenticationState: LoginModalAuthenticationState,
    cognitoClient,
): Observable<LoginModalAction | MapAppAction> {
    return fromPromise(cognitoClient.forgotPassword(authenticationState.email)).pipe(
        mergeMap(() => of(loginModalRemoteAnswerSuccess(LoginModalRemoteAnswerType.FORGOT_PASSWORD))),
        catchError((error) =>
            of(
                loginModalRemoteAnswerFailure(
                    LoginModalRemoteAnswerType.FORGOT_PASSWORD,
                    reasonFromCognitoError(error),
                ),
            ),
        ),
    );
}

function signOut(cognitoClient): Observable<LoginModalAction | MapAppAction> {
    return fromPromise(cognitoClient.signOut()).pipe(
        mergeMap(() => of(loginModalRemoteAnswerSuccess(LoginModalRemoteAnswerType.SIGN_OUT))),
        catchError((error) =>
            of(loginModalRemoteAnswerFailure(LoginModalRemoteAnswerType.SIGN_OUT, reasonFromCognitoError(error))),
        ),
    );
}
