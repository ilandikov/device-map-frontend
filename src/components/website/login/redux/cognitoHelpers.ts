import CognitoClient from '@mancho.devs/cognito';
import { Observable } from 'rxjs';
import { MapAppAction } from '../../mapApp/redux/MapAppAction';
import { Dependency } from '../../../../redux/store';
import { AuthenticationState } from './AuthenticationState';
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
    cognitoClient: Dependency<CognitoClient>,
    authenticationState: AuthenticationState,
) => Observable<LoginModalAction | MapAppAction>;
