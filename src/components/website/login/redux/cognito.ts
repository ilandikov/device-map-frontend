import { EMPTY, catchError, from, mergeMap, of, switchMap } from 'rxjs';
import { ofType } from 'redux-observable';
import CognitoClient from '@mancho.devs/cognito';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { AllActions, Dependency, RootEpic } from '../../../../redux/store';
import { mapAppAuthenticationCompleted } from '../../mapApp/redux/MapAppAction';
import { LoginModalActionType, loginModalRemoteAnswerFailure, loginModalRemoteAnswerSuccess } from './LoginModalAction';
import { AuthenticationState, AuthenticationStep } from './AuthenticationState';
import { reasonFromCognitoError } from './cognitoHelpers';

export const cognito: RootEpic = (action$, state$, { cognitoClient }) =>
    action$.pipe(
        ofType(LoginModalActionType.REMOTE_REQUEST),
        switchMap(() => processAuthMethod(state$.value.authentication, cognitoClient)),
    );

function processAuthMethod(authenticationState: AuthenticationState, cognitoClient: Dependency<CognitoClient>) {
    const skipRequest = authenticationState.error !== null;
    if (skipRequest) {
        return EMPTY;
    }

    const method = authenticationMethods[authenticationState.step];
    if (!method) {
        return EMPTY;
    }

    const successActions: AllActions[] = [loginModalRemoteAnswerSuccess()];
    if (method.completesAuthentication) {
        successActions.push(mapAppAuthenticationCompleted());
    }

    return fromPromise(method.call(cognitoClient, authenticationState)).pipe(
        mergeMap(() => from(successActions)),
        catchError((error) => of(loginModalRemoteAnswerFailure(reasonFromCognitoError(error)))),
    );
}

type AuthenticationMethod = {
    call: (cognitoClient: Dependency<CognitoClient>, authenticationState: AuthenticationState) => Promise<any>;
    completesAuthentication?: boolean;
};

const authenticationMethods: Partial<{ [key in AuthenticationStep]: AuthenticationMethod }> = {
    PASSWORD_CREATION_LOADING: {
        call: (cognitoClient, authenticationState) =>
            cognitoClient.signUp(authenticationState.email, authenticationState.password),
    },
    PASSWORD_CREATION_OTP_LOADING: {
        call: (cognitoClient, authenticationState) =>
            cognitoClient.signUpConfirmCode(authenticationState.email, authenticationState.OTP),
        completesAuthentication: true,
    },
    PASSWORD_CREATION_OTP_RESEND_LOADING: {
        call: (cognitoClient, authenticationState) => cognitoClient.resendConfirmCode(authenticationState.email),
    },
    LOGIN_LOADING: {
        call: (cognitoClient, authenticationState) =>
            cognitoClient.signIn(authenticationState.email, authenticationState.password),
        completesAuthentication: true,
    },
    PASSWORD_RESET_REQUEST_LOADING: {
        call: (cognitoClient, authenticationState) => cognitoClient.forgotPassword(authenticationState.email),
    },
    PASSWORD_RESET_LOADING: {
        call: (cognitoClient, authenticationState) =>
            cognitoClient.confirmPassword(
                authenticationState.email,
                authenticationState.OTP,
                authenticationState.password,
            ),
        completesAuthentication: true,
    },
    LOGGED_IN: {
        call: (cognitoClient, _) => cognitoClient.signOut(),
    },
};
