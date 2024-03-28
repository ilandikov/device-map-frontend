import { Observable, switchMap } from 'rxjs';
import CognitoClient from '@mancho.devs/cognito';
import { ofType } from 'redux-observable';
import {
    LoginModalAction,
    LoginModalActionTypes,
    LoginModalNotificationTypes,
    LoginModalVerifyRequest,
    LoginModalVerifyTypes,
    loginModalFailureNotification,
    loginModalNoAction,
    loginModalSuccessNotification,
} from './actions';
import { AuthenticationState } from './state';

const cognitoClient = new CognitoClient({
    UserPoolId: process.env.GATSBY_COGNITO_USER_POOL_ID,
    ClientId: process.env.GATSBY_COGNITO_CLIENT_ID,
});

export function buildMessageFromCognitoException(reason: any): string {
    switch (reason.code) {
        case 'UsernameExistsException':
        case 'UserNotFoundException':
            return `remoteAuthService${reason.code}`;
    }

    return 'remoteAuthServiceUnknownException';
}

export function cognito(action$, state$): Observable<LoginModalAction> {
    return action$.pipe(
        ofType(LoginModalActionTypes.VERIFY_REQUEST),
        switchMap(async (action: LoginModalVerifyRequest) => {
            const authenticationState: AuthenticationState = state$.value.authentication;
            if (authenticationState.error !== null) {
                return loginModalNoAction();
            }

            switch (action.verify) {
                case LoginModalVerifyTypes.USER_PASSWORD: {
                    return cognitoClient
                        .signUp(authenticationState.email, authenticationState.password)
                        .then(() => {
                            return loginModalSuccessNotification(LoginModalNotificationTypes.SIGNUP);
                        })
                        .catch((reason) => {
                            return loginModalFailureNotification(
                                LoginModalNotificationTypes.SIGNUP,
                                buildMessageFromCognitoException(reason),
                            );
                        });
                }
                case LoginModalVerifyTypes.OTP: {
                    return cognitoClient
                        .signUpConfirmCode(authenticationState.email, authenticationState.OTP)
                        .then(() => {
                            return loginModalSuccessNotification(LoginModalNotificationTypes.OTP);
                        })
                        .catch((reason) => {
                            return loginModalFailureNotification(
                                LoginModalNotificationTypes.OTP,
                                buildMessageFromCognitoException(reason),
                            );
                        });
                }
            }

            return loginModalNoAction();
        }),
    );
}
