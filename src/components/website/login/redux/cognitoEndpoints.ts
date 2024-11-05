import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { Observable, catchError, from, mergeMap, of } from 'rxjs';
import CognitoClient from '@mancho.devs/cognito';
import { mapAppAuthenticationCompleted } from '../../mapApp/redux/MapAppAction';
import { AllActions, Dependency } from '../../../../redux/store';
import {
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
        errorType: LoginModalRemoteAnswerType;
    };
};

export const newCognitoClient: NewCognitoClient = {
    signUp: {
        call: (cognitoClient, authenticationState) =>
            cognitoClient.signUp(authenticationState.email, authenticationState.password),
        answer: () => of(loginModalRemoteAnswerSuccess(LoginModalRemoteAnswerType.SIGN_UP)),
        errorType: LoginModalRemoteAnswerType.SIGN_UP,
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
        errorType: LoginModalRemoteAnswerType.PASSWORD_RESET,
    },
    signIn: {
        call: (cognitoClient, authenticationState) =>
            cognitoClient.signIn(authenticationState.email, authenticationState.password),
        answer: () =>
            from([loginModalRemoteAnswerSuccess(LoginModalRemoteAnswerType.SIGN_IN), mapAppAuthenticationCompleted()]),
        errorType: LoginModalRemoteAnswerType.SIGN_IN,
    },
    signUpOTP: {
        call: (cognitoClient, authenticationState) =>
            cognitoClient.signUpConfirmCode(authenticationState.email, authenticationState.OTP),
        answer: () =>
            from([loginModalRemoteAnswerSuccess(LoginModalRemoteAnswerType.OTP), mapAppAuthenticationCompleted()]),
        errorType: LoginModalRemoteAnswerType.OTP,
    },
    resendOTP: {
        call: (cognitoClient, authenticationState) => cognitoClient.resendConfirmCode(authenticationState.email),
        answer: () => of(loginModalRemoteAnswerSuccess(LoginModalRemoteAnswerType.OTP_RESEND)),
        errorType: LoginModalRemoteAnswerType.OTP_RESEND,
    },
};

export function clientMethodProcessor(
    clientMethod: {
        call: (cognitoClient, authenticationState) => Promise<any>;
        answer: () => Observable<AllActions>;
        errorType: LoginModalRemoteAnswerType;
    },
    cognitoClient: Dependency<CognitoClient>,
    authenticationState: AuthenticationState,
) {
    return fromPromise(clientMethod.call(cognitoClient, authenticationState)).pipe(
        mergeMap(clientMethod.answer),
        catchError((error) => of(loginModalRemoteAnswerFailure(clientMethod.errorType, reasonFromCognitoError(error)))),
    );
}

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
