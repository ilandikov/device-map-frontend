import { EMPTY, Observable, switchMap } from 'rxjs';
import { ofType } from 'redux-observable';
import { MapAppAction } from '../../mapApp/redux/MapAppAction';
import { RootEpic } from '../../../../redux/store';
import {
    LoginModalAction,
    LoginModalActionType,
    LoginModalRemoteRequest,
    LoginModalRemoteRequestType,
} from './LoginModalAction';
import { AuthenticationStep, LoginModalAuthenticationState } from './LoginModalAuthenticationState';
import {
    confirmPassword,
    resendOTP,
    sendForgotPasswordOTP,
    sendSignUpOTP,
    signIn,
    signOut,
    signUp,
} from './cognitoEndpoints';
import { CognitoClients } from './cognitoHelpers';

export const cognito: RootEpic = (action$, state$, { cognitoClient }: { cognitoClient: CognitoClients }) => {
    return action$.pipe(
        ofType(LoginModalActionType.REMOTE_REQUEST),
        switchMap((action) => {
            const authenticationState = state$.value.loginModalAuthentication;
            const skipRequest = authenticationState.error !== null;
            if (skipRequest) {
                return EMPTY;
            }

            return processCognitoRequest(action, authenticationState, cognitoClient);
        }),
    );
};

function processCognitoRequest(
    action: LoginModalRemoteRequest,
    authenticationState: LoginModalAuthenticationState,
    cognitoClient: CognitoClients,
): Observable<LoginModalAction | MapAppAction> {
    switch (action.request) {
        case LoginModalRemoteRequestType.PASSWORD:
            switch (authenticationState.step) {
                case AuthenticationStep.PASSWORD_CREATION_LOADING:
                    return signUp(cognitoClient, authenticationState);
                case AuthenticationStep.PASSWORD_RESET_LOADING:
                    return confirmPassword(cognitoClient, authenticationState);
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
}
