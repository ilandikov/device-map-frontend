import { EMPTY, catchError, from, mergeMap, of, switchMap } from 'rxjs';
import { ofType } from 'redux-observable';
import CognitoClient from '@mancho.devs/cognito';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { AllActions, Dependency, RootEpic } from '../../../../redux/store';
import { mapAppAuthenticationCompleted, mapAppGetUserPoints } from '../../mapApp/redux/MapAppAction';
import { LoginModalActionType, loginModalRemoteAnswerFailure, loginModalRemoteAnswerSuccess } from './LoginModalAction';
import { AuthenticationState, AuthenticationStep } from './AuthenticationState';
import { reasonFromCognitoError } from './cognitoHelpers';

export const cognito: RootEpic = (action$, state$, { cognitoClient }) =>
    action$.pipe(
        ofType(LoginModalActionType.REMOTE_REQUEST),
        switchMap(() => processAuthMethod(state$.value.authentication, cognitoClient)),
    );

function processAuthMethod(state: AuthenticationState, client: Dependency<CognitoClient>) {
    const skipRequest = state.error !== null;
    if (skipRequest) {
        return EMPTY;
    }

    const currentStep = state.step;
    const authenticationMethod = authenticationMethods[currentStep];
    if (!authenticationMethod) {
        return EMPTY;
    }

    return fromPromise(authenticationMethod(client, state)).pipe(
        mergeMap((response) => from(getSuccessActions(currentStep, response))),
        catchError((error) => of(loginModalRemoteAnswerFailure(reasonFromCognitoError(error)))),
    );
}

function getSuccessActions(step: AuthenticationStep, response: any): AllActions[] {
    if (step === AuthenticationStep.LOGIN_LOADING) {
        return [
            loginModalRemoteAnswerSuccess(),
            mapAppAuthenticationCompleted(response.session.idToken.payload.sub),
            mapAppGetUserPoints(response.session.idToken.payload.sub),
        ];
    }

    return [loginModalRemoteAnswerSuccess()];
}

type AuthenticationMethod = (client: Dependency<CognitoClient>, state: AuthenticationState) => Promise<any>;

const authenticationMethods: Partial<{ [key in AuthenticationStep]: AuthenticationMethod }> = {
    PASSWORD_CREATION_LOADING: (client, state) => client.signUp(state.email, state.password),
    PASSWORD_CREATION_OTP_LOADING: (client, state) => client.signUpConfirmCode(state.email, state.OTP),
    PASSWORD_CREATION_OTP_RESEND_LOADING: (client, state) => client.resendConfirmCode(state.email),
    LOGIN_LOADING: (client, state) => client.signIn(state.email, state.password),
    PASSWORD_RESET_REQUEST_LOADING: (client, state) => client.forgotPassword(state.email),
    PASSWORD_RESET_LOADING: (client, state) => client.confirmPassword(state.email, state.OTP, state.password),
    LOGGED_IN: (client, _) => client.signOut(),
};
