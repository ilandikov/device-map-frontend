import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { Observable, catchError, from, mergeMap, of } from 'rxjs';
import CognitoClient from '@mancho.devs/cognito';
import { mapAppAuthenticationCompleted } from '../../mapApp/redux/MapAppAction';
import { AllActions, Dependency } from '../../../../redux/store';
import {
    LoginModalRemoteAnswer,
    LoginModalRemoteAnswerType,
    loginModalRemoteAnswerFailure,
    loginModalRemoteAnswerSuccess,
} from './LoginModalAction';
import { CognitoEndpoint, reasonFromCognitoError } from './cognitoHelpers';
import { AuthenticationState } from './AuthenticationState';

type NewCognitoClient = {
    [berrySauce: string]: {
        call: (cognitoClient, authenticationState) => Promise<any>;
        answer: () => Observable<AllActions>;
        error: (error) => Observable<LoginModalRemoteAnswer>;
    };
};

const newCognitoClient: NewCognitoClient = {
    signUp: {
        call: (cognitoClient, authenticationState) =>
            cognitoClient.signUp(authenticationState.email, authenticationState.password),
        answer: () => of(loginModalRemoteAnswerSuccess(LoginModalRemoteAnswerType.SIGN_UP)),
        error: (error) =>
            of(loginModalRemoteAnswerFailure(LoginModalRemoteAnswerType.SIGN_UP, reasonFromCognitoError(error))),
    },
    confirmPassword: {
        call: (cognitoClient, authenticationState) =>
            cognitoClient.confirmPassword(
                authenticationState.email,
                authenticationState.OTP,
                authenticationState.password,
            ),
        answer: () =>
            from([
                loginModalRemoteAnswerSuccess(LoginModalRemoteAnswerType.PASSWORD_RESET),
                mapAppAuthenticationCompleted(),
            ]),
        error: (error) =>
            of(loginModalRemoteAnswerFailure(LoginModalRemoteAnswerType.PASSWORD_RESET, reasonFromCognitoError(error))),
    },
};

function clientMethodProcessor(
    clientMethod: {
        call: (cognitoClient, authenticationState) => Promise<any>;
        answer: () => Observable<AllActions>;
        error: (error) => Observable<LoginModalRemoteAnswer>;
    },
    cognitoClient: Dependency<CognitoClient>,
    authenticationState: AuthenticationState,
) {
    return fromPromise(clientMethod.call(cognitoClient, authenticationState)).pipe(
        mergeMap(clientMethod.answer),
        catchError(clientMethod.error),
    );
}

export const signUp: CognitoEndpoint = (cognitoClient, authenticationState) => {
    return clientMethodProcessor(newCognitoClient['signUp'], cognitoClient, authenticationState);
};
export const confirmPassword: CognitoEndpoint = (cognitoClient, authenticationState) => {
    const berrySauce = 'confirmPassword';
    return fromPromise(newCognitoClient[berrySauce].call(cognitoClient, authenticationState)).pipe(
        mergeMap(newCognitoClient[berrySauce].answer),
        catchError(newCognitoClient[berrySauce].error),
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
