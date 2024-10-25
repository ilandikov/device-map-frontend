import CognitoClient from '@mancho.devs/cognito';
import { Observable } from 'rxjs';
import { MapAppAction } from '../../mapApp/redux/MapAppAction';
import { Like } from '../../../../redux/store';
import { LoginModalAuthenticationState } from './LoginModalAuthenticationState';
import { LoginModalAction } from './LoginModalAction';

export enum CognitoErrors {
    USERNAME_EXISTS = 'cognitoUsernameExistsException',
}

export function reasonFromCognitoError(error: any): string {
    if (!error || !error.code) {
        return 'cognitoUnknownException';
    }

    return 'cognito' + error.code;
}

export type CognitoEndpoint = (
    cognitoClient: Like<CognitoClient>,
    authenticationState: LoginModalAuthenticationState,
) => Observable<LoginModalAction | MapAppAction>;
