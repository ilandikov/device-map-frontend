import { EMPTY, catchError, from, mergeMap, of, switchMap } from 'rxjs';
import { ofType } from 'redux-observable';
import CognitoClient from '@mancho.devs/cognito';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { AllActions, Dependency, RootEpic } from '../../../../redux/store';
import { mapAppAuthenticationCompleted } from '../../mapApp/redux/MapAppAction';
import {
    LoginModalActionType,
    LoginModalRemoteAnswerType,
    LoginModalRemoteRequestType,
    loginModalRemoteAnswerFailure,
    loginModalRemoteAnswerSuccess,
} from './LoginModalAction';
import { AuthenticationState, AuthenticationStep } from './AuthenticationState';
import { reasonFromCognitoError } from './cognitoHelpers';

export const cognito: RootEpic = (action$, state$, { cognitoClient }) => {
    return action$.pipe(
        ofType(LoginModalActionType.REMOTE_REQUEST),
        switchMap((action) => {
            const authenticationState = state$.value.authentication;
            const skipRequest = authenticationState.error !== null;
            if (skipRequest) {
                return EMPTY;
            }

            const authenticationMethod = authenticationMethods[`${action.request}.${authenticationState.step}`];
            if (!authenticationMethod) {
                return EMPTY;
            }

            return processAuthMethod(authenticationMethod, cognitoClient, authenticationState);
        }),
    );
};

type AuthenticationMethod = {
    call: (cognitoClient: Dependency<CognitoClient>, authenticationState: AuthenticationState) => Promise<any>;
    answerType: LoginModalRemoteAnswerType;
    availableStep: AuthenticationStep;
    completesAuthentication?: boolean;
};

function processAuthMethod(
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

type RemoteRequestAuthStep = `${LoginModalRemoteRequestType}.${AuthenticationStep}`;

const authenticationMethods: Partial<{ [key in RemoteRequestAuthStep]: AuthenticationMethod }> = {
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
    'OTP_RESEND.PASSWORD_CREATION_OTP_RESEND_LOADING': {
        call: (cognitoClient, authenticationState) => cognitoClient.resendConfirmCode(authenticationState.email),
        answerType: LoginModalRemoteAnswerType.OTP_RESEND,
        availableStep: AuthenticationStep.PASSWORD_CREATION_OTP_RESEND_LOADING,
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
