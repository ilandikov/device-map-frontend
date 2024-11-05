import { EMPTY, switchMap } from 'rxjs';
import { ofType } from 'redux-observable';
import { RootEpic } from '../../../../redux/store';
import { LoginModalActionType, LoginModalRemoteRequestType } from './LoginModalAction';
import { authenticationMethods, processAuthMethod } from './cognitoEndpoints';

export const cognito: RootEpic = (action$, state$, { cognitoClient }) => {
    return action$.pipe(
        ofType(LoginModalActionType.REMOTE_REQUEST),
        switchMap((action) => {
            const authenticationState = state$.value.authentication;
            const skipRequest = authenticationState.error !== null;
            if (skipRequest) {
                return EMPTY;
            }

            if (!authenticationMethods[`${action.request}.${authenticationState.step}`]) {
                return EMPTY;
            }

            switch (action.request) {
                case LoginModalRemoteRequestType.PASSWORD:
                    return processAuthMethod(
                        `${action.request}.${authenticationState.step}`,
                        cognitoClient,
                        authenticationState,
                    );
                case LoginModalRemoteRequestType.USERNAME_AND_PASSWORD:
                    return processAuthMethod(
                        `${action.request}.${authenticationState.step}`,
                        cognitoClient,
                        authenticationState,
                    );
                case LoginModalRemoteRequestType.OTP:
                    return processAuthMethod(
                        `${action.request}.${authenticationState.step}`,
                        cognitoClient,
                        authenticationState,
                    );
                case LoginModalRemoteRequestType.OTP_RESEND:
                    return processAuthMethod(
                        `${action.request}.${authenticationState.step}`,
                        cognitoClient,
                        authenticationState,
                    );
                case LoginModalRemoteRequestType.USERNAME:
                    return processAuthMethod(
                        `${action.request}.${authenticationState.step}`,
                        cognitoClient,
                        authenticationState,
                    );
                case LoginModalRemoteRequestType.SIGN_OUT:
                    return processAuthMethod(
                        `${action.request}.${authenticationState.step}`,
                        cognitoClient,
                        authenticationState,
                    );
                default:
                    return EMPTY;
            }
        }),
    );
};
