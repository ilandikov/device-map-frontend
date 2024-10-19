export enum CognitoErrors {
    USERNAME_EXISTS = 'cognitoUsernameExistsException',
}

export function reasonFromCognitoError(error: any): string {
    if (!error || !error.code) {
        return 'cognitoUnknownException';
    }

    return 'cognito' + error.code;
}
