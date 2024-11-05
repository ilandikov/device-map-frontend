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

type anotherSauce = {
    call: (cognitoClient, authenticationState) => Promise<any>;
    answerType: LoginModalRemoteAnswerType;
    successCompletesAuthentication?: boolean;
    availableOnlyOnStep?: AuthenticationStep;
};

type NewCognitoClient = {
    [berrySauce: string]: anotherSauce;
};

const newCognitoClient: NewCognitoClient = {
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
        successCompletesAuthentication: true,
    },
    signIn: {
        call: (cognitoClient, authenticationState) =>
            cognitoClient.signIn(authenticationState.email, authenticationState.password),
        answerType: LoginModalRemoteAnswerType.SIGN_IN,
        successCompletesAuthentication: true,
    },
    signUpOTP: {
        call: (cognitoClient, authenticationState) =>
            cognitoClient.signUpConfirmCode(authenticationState.email, authenticationState.OTP),
        answerType: LoginModalRemoteAnswerType.OTP,
        successCompletesAuthentication: true,
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

export function clientMethodProcessor(
    clientMethodKey: string,
    cognitoClient: Dependency<CognitoClient>,
    authenticationState: AuthenticationState,
) {
    const clientMethod = newCognitoClient[clientMethodKey];
    if (clientMethod.availableOnlyOnStep && clientMethod.availableOnlyOnStep !== authenticationState.step) {
        return EMPTY;
    }

    const successActions: AllActions[] = [loginModalRemoteAnswerSuccess(clientMethod.answerType)];
    if (clientMethod.successCompletesAuthentication) {
        successActions.push(mapAppAuthenticationCompleted());
    }

    return fromPromise(clientMethod.call(cognitoClient, authenticationState)).pipe(
        mergeMap(() => from(successActions)),
        catchError((error) =>
            of(loginModalRemoteAnswerFailure(clientMethod.answerType, reasonFromCognitoError(error))),
        ),
    );
}
