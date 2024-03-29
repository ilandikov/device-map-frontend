export function buildMessageFromCognitoException(reason: any): string {
    switch (reason.code) {
        case 'UsernameExistsException':
        case 'UserNotFoundException':
            return `remoteAuthService${reason.code}`;
    }

    return 'remoteAuthServiceUnknownException';
}
