import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { EMPTY, catchError, from, mergeMap, of } from 'rxjs';
import CognitoClient from '@mancho.devs/cognito';
import { mapAppAuthenticationCompleted } from '../../mapApp/redux/MapAppAction';
import { AllActions, Dependency } from '../../../../redux/store';
import {
    LoginModalRemoteAnswerType,
    LoginModalRemoteRequestType,
    loginModalRemoteAnswerFailure,
    loginModalRemoteAnswerSuccess,
} from './LoginModalAction';
import { reasonFromCognitoError } from './cognitoHelpers';
import { AuthenticationState, AuthenticationStep } from './AuthenticationState';

type AuthenticationMethod = {
    call: (cognitoClient: Dependency<CognitoClient>, authenticationState: AuthenticationState) => Promise<any>;
    answerType: LoginModalRemoteAnswerType;
    availableStep: AuthenticationStep;
    completesAuthentication?: boolean;
};

type RemoteRequestAuthStep = `${LoginModalRemoteRequestType}.${AuthenticationStep}`;

export const authenticationMethods: Partial<{ [key in RemoteRequestAuthStep]: AuthenticationMethod }> = {
    'PASSWORD.PASSWORD_CREATION_LOADING': {
        call: (cognitoClient, authenticationState) =>
            cognitoClient.signUp(authenticationState.email, authenticationState.password),
        answerType: LoginModalRemoteAnswerType.SIGN_UP,
        availableStep: AuthenticationStep.PASSWORD_CREATION_LOADING,
    },
    'PASSWORD.PASSWORD_RESET_LOADING': {
        call: (cognitoClient, authenticationState) =>
            cognitoClient.confirmPassword(
                authenticationState.email,
                authenticationState.OTP,
                authenticationState.password,
            ),
        answerType: LoginModalRemoteAnswerType.PASSWORD_RESET,
        availableStep: AuthenticationStep.PASSWORD_RESET_LOADING,
        completesAuthentication: true,
    },
    'USERNAME_AND_PASSWORD.LOGIN_LOADING': {
        call: (cognitoClient, authenticationState) =>
            cognitoClient.signIn(authenticationState.email, authenticationState.password),
        answerType: LoginModalRemoteAnswerType.SIGN_IN,
        availableStep: AuthenticationStep.LOGIN_LOADING,
        completesAuthentication: true,
    },
    'OTP.PASSWORD_CREATION_OTP_LOADING': {
        call: (cognitoClient, authenticationState) =>
            cognitoClient.signUpConfirmCode(authenticationState.email, authenticationState.OTP),
        answerType: LoginModalRemoteAnswerType.OTP,
        availableStep: AuthenticationStep.PASSWORD_CREATION_OTP_LOADING,
        completesAuthentication: true,
    },
    'OTP_RESEND.PASSWORD_CREATION_OTP_LOADING': {
        call: (cognitoClient, authenticationState) => cognitoClient.resendConfirmCode(authenticationState.email),
        answerType: LoginModalRemoteAnswerType.OTP_RESEND,
        availableStep: AuthenticationStep.PASSWORD_CREATION_OTP_LOADING,
    },
    'USERNAME.PASSWORD_RESET_LOADING': {
        call: (cognitoClient, authenticationState) => cognitoClient.forgotPassword(authenticationState.email),
        answerType: LoginModalRemoteAnswerType.FORGOT_PASSWORD,
        availableStep: AuthenticationStep.PASSWORD_RESET_LOADING,
    },
    'SIGN_OUT.LOGGED_IN': {
        call: (cognitoClient, _) => cognitoClient.signOut(),
        availableStep: AuthenticationStep.LOGGED_IN,
        answerType: LoginModalRemoteAnswerType.SIGN_OUT,
    },
};

export function processAuthMethod(
    authenticationMethod: AuthenticationMethod,
    cognitoClient: Dependency<CognitoClient>,
    authenticationState: AuthenticationState,
) {
    const method = authenticationMethod;
    if (method.availableStep !== authenticationState.step) {
        return EMPTY;
    }

    const successActions: AllActions[] = [loginModalRemoteAnswerSuccess(method.answerType)];
    if (method.completesAuthentication) {
        successActions.push(mapAppAuthenticationCompleted());
    }

    return fromPromise(method.call(cognitoClient, authenticationState)).pipe(
        mergeMap(() => from(successActions)),
        catchError((error) => of(loginModalRemoteAnswerFailure(method.answerType, reasonFromCognitoError(error)))),
    );
}
