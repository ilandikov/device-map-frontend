import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { EMPTY, catchError, from, mergeMap, of } from 'rxjs';
import CognitoClient from '@mancho.devs/cognito';
import { mapAppAuthenticationCompleted } from '../../mapApp/redux/MapAppAction';
import { AllActions, Dependency } from '../../../../redux/store';
import {
    LoginModalRemoteAnswerType,
    loginModalRemoteAnswerFailure,
    loginModalRemoteAnswerSuccess,
} from './LoginModalAction';
import { reasonFromCognitoError } from './cognitoHelpers';
import { AuthenticationState, AuthenticationStep } from './AuthenticationState';

type AuthenticationMethod = {
    call: (cognitoClient: Dependency<CognitoClient>, authenticationState: AuthenticationState) => Promise<any>;
    answerType: LoginModalRemoteAnswerType;
    completesAuthentication?: boolean;
    availableOnlyOnStep?: AuthenticationStep;
};

const authenticationMethods: { [name: string]: AuthenticationMethod } = {
    signUp: {
        call: (cognitoClient, authenticationState) =>
            cognitoClient.signUp(authenticationState.email, authenticationState.password),
        answerType: LoginModalRemoteAnswerType.SIGN_UP,
    },
    confirmPassword: {
        call: (cognitoClient, authenticationState) =>
            cognitoClient.confirmPassword(
                authenticationState.email,
                authenticationState.OTP,
                authenticationState.password,
            ),
        answerType: LoginModalRemoteAnswerType.PASSWORD_RESET,
        completesAuthentication: true,
    },
    signIn: {
        call: (cognitoClient, authenticationState) =>
            cognitoClient.signIn(authenticationState.email, authenticationState.password),
        answerType: LoginModalRemoteAnswerType.SIGN_IN,
        completesAuthentication: true,
    },
    signUpOTP: {
        call: (cognitoClient, authenticationState) =>
            cognitoClient.signUpConfirmCode(authenticationState.email, authenticationState.OTP),
        answerType: LoginModalRemoteAnswerType.OTP,
        completesAuthentication: true,
        availableOnlyOnStep: AuthenticationStep.PASSWORD_CREATION_OTP_LOADING,
    },
    resendOTP: {
        call: (cognitoClient, authenticationState) => cognitoClient.resendConfirmCode(authenticationState.email),
        answerType: LoginModalRemoteAnswerType.OTP_RESEND,
    },
    forgotPasswordOTP: {
        call: (cognitoClient, authenticationState) => cognitoClient.forgotPassword(authenticationState.email),
        answerType: LoginModalRemoteAnswerType.FORGOT_PASSWORD,
        availableOnlyOnStep: AuthenticationStep.PASSWORD_RESET_LOADING,
    },
    signOut: {
        call: (cognitoClient, _) => cognitoClient.signOut(),
        answerType: LoginModalRemoteAnswerType.SIGN_OUT,
    },
};

export function processAuthMethod(
    name: string,
    cognitoClient: Dependency<CognitoClient>,
    authenticationState: AuthenticationState,
) {
    const method = authenticationMethods[name];
    if (method.availableOnlyOnStep && method.availableOnlyOnStep !== authenticationState.step) {
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
