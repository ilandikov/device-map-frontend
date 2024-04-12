export function buildMessageFromCognitoException(reason: any): string {
    if (!reason || !reason.code) {
        return 'cognitoUnknownException';
    }

    return 'cognito' + reason.code;
}
