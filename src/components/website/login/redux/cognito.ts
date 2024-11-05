import { EMPTY, merge, switchMap } from 'rxjs';
import { ofType } from 'redux-observable';
import { RootEpic } from '../../../../redux/store';
import { LoginModalActionType, LoginModalRemoteRequestType } from './LoginModalAction';
import { processAuthMethod } from './cognitoEndpoints';

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
                    return merge(
                        processAuthMethod('confirmPassword', cognitoClient, authenticationState),
                        processAuthMethod('signUp', cognitoClient, authenticationState),
                    );
                case LoginModalRemoteRequestType.USERNAME_AND_PASSWORD:
                    return processAuthMethod('signIn', cognitoClient, authenticationState);
                case LoginModalRemoteRequestType.OTP:
                    return processAuthMethod('signUpOTP', cognitoClient, authenticationState);
                case LoginModalRemoteRequestType.OTP_RESEND:
                    return processAuthMethod('resendOTP', cognitoClient, authenticationState);
                case LoginModalRemoteRequestType.USERNAME:
                    return processAuthMethod('forgotPasswordOTP', cognitoClient, authenticationState);
                case LoginModalRemoteRequestType.SIGN_OUT:
                    return processAuthMethod('signOut', cognitoClient, authenticationState);
                default:
                    return EMPTY;
            }
        }),
    );
};
