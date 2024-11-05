import { EMPTY, switchMap } from 'rxjs';
import { ofType } from 'redux-observable';
import { RootEpic } from '../../../../redux/store';
import { LoginModalActionType, LoginModalRemoteRequestType } from './LoginModalAction';
import { AuthenticationStep } from './AuthenticationState';
import { clientMethodProcessor } from './cognitoEndpoints';

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
                            return clientMethodProcessor('signUp', cognitoClient, authenticationState);
                        case AuthenticationStep.PASSWORD_RESET_LOADING:
                            return clientMethodProcessor('confirmPassword', cognitoClient, authenticationState);
                    }

                    return EMPTY;
                case LoginModalRemoteRequestType.USERNAME_AND_PASSWORD:
                    return clientMethodProcessor('signIn', cognitoClient, authenticationState);
                case LoginModalRemoteRequestType.OTP:
                    return clientMethodProcessor('signUpOTP', cognitoClient, authenticationState);
                case LoginModalRemoteRequestType.OTP_RESEND:
                    return clientMethodProcessor('resendOTP', cognitoClient, authenticationState);
                case LoginModalRemoteRequestType.USERNAME:
                    return clientMethodProcessor('forgotPasswordOTP', cognitoClient, authenticationState);
                case LoginModalRemoteRequestType.SIGN_OUT:
                    return clientMethodProcessor('signOut', cognitoClient, authenticationState);
                default:
                    return EMPTY;
            }
        }),
    );
};
