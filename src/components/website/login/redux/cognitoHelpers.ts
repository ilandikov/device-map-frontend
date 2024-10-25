import CognitoClient from '@mancho.devs/cognito';
import { Observable } from 'rxjs';
import { MapAppAction } from '../../mapApp/redux/MapAppAction';
import { CognitoTestClient } from './__test__/cognitoTestHelpers';
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

export type CognitoClients = CognitoClient | CognitoTestClient | Like<CognitoClient>;

export type Like<T> = { [key in keyof T]: T[key] };

export type CognitoEndpoint = (
    cognitoClient: CognitoClients,
    authenticationState: LoginModalAuthenticationState,
) => Observable<LoginModalAction | MapAppAction>;
