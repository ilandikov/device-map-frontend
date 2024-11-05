import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { catchError, from, mergeMap, of } from 'rxjs';
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

type anotherSauce = {
    call: (cognitoClient, authenticationState) => Promise<any>;
    answerType: LoginModalRemoteAnswerType;
    successCompletesAuthentication?: boolean;
};

type NewCognitoClient = {
    [berrySauce: string]: anotherSauce;
};

export const newCognitoClient: NewCognitoClient = {
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
    },
    resendOTP: {
        call: (cognitoClient, authenticationState) => cognitoClient.resendConfirmCode(authenticationState.email),
        answerType: LoginModalRemoteAnswerType.OTP_RESEND,
    },
    forgotPasswordOTP: {
        call: (cognitoClient, authenticationState) => cognitoClient.forgotPassword(authenticationState.email),
        answerType: LoginModalRemoteAnswerType.FORGOT_PASSWORD,
    },
};

export function clientMethodProcessor(
    clientMethod: anotherSauce,
    cognitoClient: Dependency<CognitoClient>,
    authenticationState: AuthenticationState,
) {
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

export const signOut: CognitoEndpoint = (cognitoClient) => {
    return fromPromise(cognitoClient.signOut()).pipe(
        mergeMap(() => of(loginModalRemoteAnswerSuccess(LoginModalRemoteAnswerType.SIGN_OUT))),
        catchError((error) =>
            of(loginModalRemoteAnswerFailure(LoginModalRemoteAnswerType.SIGN_OUT, reasonFromCognitoError(error))),
        ),
    );
};
