export function buildMessageFromCognitoException(reason: any): string {
    if (!reason || !reason.code) {
        return 'remoteAuthServiceUnknownException';
    }

    switch (reason.code) {
        case 'UsernameExistsException':
        case 'UserNotFoundException':
            return `remoteAuthService${reason.code}`;
    }

    return 'remoteAuthServiceUnknownException';
}
