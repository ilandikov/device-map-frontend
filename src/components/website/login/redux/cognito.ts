import { EMPTY, catchError, from, mergeMap, of, switchMap } from 'rxjs';
import { ofType } from 'redux-observable';
import CognitoClient from '@mancho.devs/cognito';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { AllActions, Dependency, RootEpic } from '../../../../redux/store';
import { mapAppAuthenticationCompleted } from '../../mapApp/redux/MapAppAction';
import {
    LoginModalActionType,
    LoginModalRemoteAnswerType,
    loginModalRemoteAnswerFailure,
    loginModalRemoteAnswerSuccess,
} from './LoginModalAction';
import { AuthenticationState, AuthenticationStep } from './AuthenticationState';
import { reasonFromCognitoError } from './cognitoHelpers';

export const cognito: RootEpic = (action$, state$, { cognitoClient }) => {
    return action$.pipe(
        ofType(LoginModalActionType.REMOTE_REQUEST),
        switchMap(() => {
            const authenticationState = state$.value.authentication;
            const authenticationMethod = authenticationMethods[authenticationState.step];
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
    method: AuthenticationMethod,
    cognitoClient: Dependency<CognitoClient>,
    authenticationState: AuthenticationState,
) {
    const skipRequest = authenticationState.error !== null;
    if (skipRequest) {
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

const authenticationMethods: Partial<{ [key in AuthenticationStep]: AuthenticationMethod }> = {
    PASSWORD_CREATION_LOADING: {
        call: (cognitoClient, authenticationState) =>
            cognitoClient.signUp(authenticationState.email, authenticationState.password),
        answerType: LoginModalRemoteAnswerType.SIGN_UP,
        availableStep: AuthenticationStep.PASSWORD_CREATION_LOADING,
    },
    PASSWORD_CREATION_OTP_LOADING: {
        call: (cognitoClient, authenticationState) =>
            cognitoClient.signUpConfirmCode(authenticationState.email, authenticationState.OTP),
        answerType: LoginModalRemoteAnswerType.OTP,
        availableStep: AuthenticationStep.PASSWORD_CREATION_OTP_LOADING,
        completesAuthentication: true,
    },
    PASSWORD_CREATION_OTP_RESEND_LOADING: {
        call: (cognitoClient, authenticationState) => cognitoClient.resendConfirmCode(authenticationState.email),
        answerType: LoginModalRemoteAnswerType.OTP_RESEND,
        availableStep: AuthenticationStep.PASSWORD_CREATION_OTP_RESEND_LOADING,
    },
    LOGIN_LOADING: {
        call: (cognitoClient, authenticationState) =>
            cognitoClient.signIn(authenticationState.email, authenticationState.password),
        answerType: LoginModalRemoteAnswerType.SIGN_IN,
        availableStep: AuthenticationStep.LOGIN_LOADING,
        completesAuthentication: true,
    },
    PASSWORD_RESET_REQUEST_LOADING: {
        call: (cognitoClient, authenticationState) => cognitoClient.forgotPassword(authenticationState.email),
        answerType: LoginModalRemoteAnswerType.FORGOT_PASSWORD,
        availableStep: AuthenticationStep.PASSWORD_RESET_REQUEST_LOADING,
    },
    PASSWORD_RESET_LOADING: {
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
    LOGGED_IN: {
        call: (cognitoClient, _) => cognitoClient.signOut(),
        availableStep: AuthenticationStep.LOGGED_IN,
        answerType: LoginModalRemoteAnswerType.SIGN_OUT,
    },
};
