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

    const currentStep = authenticationState.step;
    const method = authenticationMethods[currentStep];
    if (!method) {
        return EMPTY;
    }

    const successActions = getSuccessActions(currentStep);

    return fromPromise(method(cognitoClient, authenticationState)).pipe(
        mergeMap(() => from(successActions)),
        catchError((error) => of(loginModalRemoteAnswerFailure(reasonFromCognitoError(error)))),
    );
}

function getSuccessActions(step: AuthenticationStep): AllActions[] {
    const stepsCompletingAuthentication: AuthenticationStep[] = [
        AuthenticationStep.PASSWORD_CREATION_OTP_LOADING,
        AuthenticationStep.LOGIN_LOADING,
        AuthenticationStep.PASSWORD_RESET_LOADING,
    ];

    if (stepsCompletingAuthentication.includes(step)) {
        return [loginModalRemoteAnswerSuccess(), mapAppAuthenticationCompleted()];
    }

    return [loginModalRemoteAnswerSuccess()];
}

type AuthenticationMethod = (
    cognitoClient: Dependency<CognitoClient>,
    authenticationState: AuthenticationState,
) => Promise<any>;

const authenticationMethods: Partial<{ [key in AuthenticationStep]: AuthenticationMethod }> = {
    PASSWORD_CREATION_LOADING: (client, state) => client.signUp(state.email, state.password),
    PASSWORD_CREATION_OTP_LOADING: (client, state) => client.signUpConfirmCode(state.email, state.OTP),
    PASSWORD_CREATION_OTP_RESEND_LOADING: (client, state) => client.resendConfirmCode(state.email),
    LOGIN_LOADING: (client, state) => client.signIn(state.email, state.password),
    PASSWORD_RESET_REQUEST_LOADING: (client, state) => client.forgotPassword(state.email),
    PASSWORD_RESET_LOADING: (client, state) => client.confirmPassword(state.email, state.OTP, state.password),
    LOGGED_IN: (client, _) => client.signOut(),
};
