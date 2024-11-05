import { EMPTY, switchMap } from 'rxjs';
import { ofType } from 'redux-observable';
import { RootEpic } from '../../../../redux/store';
import { LoginModalActionType, LoginModalRemoteRequestType } from './LoginModalAction';
import { AuthenticationStep } from './AuthenticationState';
import {
    clientMethodProcessor,
    newCognitoClient,
    resendOTP,
    sendForgotPasswordOTP,
    sendSignUpOTP,
    signIn,
    signOut,
} from './cognitoEndpoints';

export const cognito: RootEpic = (action$, state$, { cognitoClient }) => {
    return action$.pipe(
        ofType(LoginModalActionType.REMOTE_REQUEST),
        switchMap((action) => {
            const authenticationState = state$.value.authentication;
            const skipRequest = authenticationState.error !== null;
            if (skipRequest) {
                return EMPTY;
            }

            switch (action.request) {
                case LoginModalRemoteRequestType.PASSWORD:
                    switch (authenticationState.step) {
                        case AuthenticationStep.PASSWORD_CREATION_LOADING:
                            return clientMethodProcessor(
                                newCognitoClient['signUp'],
                                cognitoClient,
                                authenticationState,
                            );
                        case AuthenticationStep.PASSWORD_RESET_LOADING:
                            return clientMethodProcessor(
                                newCognitoClient['confirmPassword'],
                                cognitoClient,
                                authenticationState,
                            );
                    }

                    return EMPTY;
                case LoginModalRemoteRequestType.USERNAME_AND_PASSWORD:
                    return signIn(cognitoClient, authenticationState);
                case LoginModalRemoteRequestType.OTP:
                    if (authenticationState.step !== AuthenticationStep.PASSWORD_CREATION_OTP_LOADING) {
                        return EMPTY;
                    }

                    return sendSignUpOTP(cognitoClient, authenticationState);
                case LoginModalRemoteRequestType.OTP_RESEND:
                    return resendOTP(cognitoClient, authenticationState);
                case LoginModalRemoteRequestType.USERNAME:
                    if (authenticationState.step !== AuthenticationStep.PASSWORD_RESET_LOADING) {
                        return EMPTY;
                    }

                    return sendForgotPasswordOTP(cognitoClient, authenticationState);
                case LoginModalRemoteRequestType.SIGN_OUT:
                    return signOut(cognitoClient, authenticationState);
                default:
                    return EMPTY;
            }
        }),
    );
};
