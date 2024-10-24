import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { Observable, catchError, from, mergeMap, of } from 'rxjs';
import CognitoClient from '@mancho.devs/cognito';
import { MapAppAction, mapAppAuthenticationCompleted } from '../../mapApp/redux/MapAppAction';
import {
    LoginModalAction,
    LoginModalRemoteAnswerType,
    loginModalRemoteAnswerFailure,
    loginModalRemoteAnswerSuccess,
} from './LoginModalAction';
import { reasonFromCognitoError } from './cognitoHelpers';
import { CognitoTestClient } from './__test__/cognitoTestHelpers';
import { LoginModalAuthenticationState } from './LoginModalAuthenticationState';

type CognitoEndpoint = (
    cognitoClient: CognitoClient | CognitoTestClient,
    authenticationState: LoginModalAuthenticationState,
) => Observable<LoginModalAction | MapAppAction>;

export const signUp: CognitoEndpoint = (cognitoClient, authenticationState) => {
    return fromPromise(cognitoClient.signUp(authenticationState.email, authenticationState.password)).pipe(
        mergeMap(() => of(loginModalRemoteAnswerSuccess(LoginModalRemoteAnswerType.SIGN_UP))),
        catchError((error) =>
            of(loginModalRemoteAnswerFailure(LoginModalRemoteAnswerType.SIGN_UP, reasonFromCognitoError(error))),
        ),
    );
};
export const confirmPassword: CognitoEndpoint = (cognitoClient, authenticationState) => {
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
};
export const signIn: CognitoEndpoint = (cognitoClient, authenticationState) => {
    return fromPromise(cognitoClient.signIn(authenticationState.email, authenticationState.password)).pipe(
        mergeMap(() =>
            from([loginModalRemoteAnswerSuccess(LoginModalRemoteAnswerType.SIGN_IN), mapAppAuthenticationCompleted()]),
        ),
        catchError((error) =>
            of(loginModalRemoteAnswerFailure(LoginModalRemoteAnswerType.SIGN_IN, reasonFromCognitoError(error))),
        ),
    );
};
export const sendSignUpOTP: CognitoEndpoint = (cognitoClient, authenticationState) => {
    return fromPromise(cognitoClient.signUpConfirmCode(authenticationState.email, authenticationState.OTP)).pipe(
        mergeMap(() =>
            from([loginModalRemoteAnswerSuccess(LoginModalRemoteAnswerType.OTP), mapAppAuthenticationCompleted()]),
        ),
        catchError((error) =>
            of(loginModalRemoteAnswerFailure(LoginModalRemoteAnswerType.OTP, reasonFromCognitoError(error))),
        ),
    );
};
export const resendOTP: CognitoEndpoint = (cognitoClient, authenticationState) => {
    return fromPromise(cognitoClient.resendConfirmCode(authenticationState.email)).pipe(
        mergeMap(() => of(loginModalRemoteAnswerSuccess(LoginModalRemoteAnswerType.OTP_RESEND))),
        catchError((error) =>
            of(loginModalRemoteAnswerFailure(LoginModalRemoteAnswerType.OTP_RESEND, reasonFromCognitoError(error))),
        ),
    );
};
export const sendForgotPasswordOTP: CognitoEndpoint = (cognitoClient, authenticationState) => {
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
};
export const signOut: CognitoEndpoint = (cognitoClient) => {
    return fromPromise(cognitoClient.signOut()).pipe(
        mergeMap(() => of(loginModalRemoteAnswerSuccess(LoginModalRemoteAnswerType.SIGN_OUT))),
        catchError((error) =>
            of(loginModalRemoteAnswerFailure(LoginModalRemoteAnswerType.SIGN_OUT, reasonFromCognitoError(error))),
        ),
    );
};
