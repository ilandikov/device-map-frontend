import { buildMessageFromCognitoException } from '../epicHelpers';

describe('Cognito exception management', () => {
    it('should explain UsernameExistsException exception', () => {
        const explanation = buildMessageFromCognitoException({ code: 'UsernameExistsException' });

        expect(explanation).toEqual('remoteAuthServiceUsernameExistsException');
    });

    it('should explain UsernameExistsException exception', () => {
        const explanation = buildMessageFromCognitoException({ code: 'UserNotFoundException' });

        expect(explanation).toEqual('remoteAuthServiceUserNotFoundException');
    });

    it('should explain an unknown exception', () => {
        const explanation = buildMessageFromCognitoException({ code: 'omgWhatIsThis?!' });

        expect(explanation).toEqual('remoteAuthServiceUnknownException');
    });

    it('should explain an exception with a different format', () => {
        const explanation = buildMessageFromCognitoException({ nonExistentField: 'thisIsWhatIGotForYou' });

        expect(explanation).toEqual('remoteAuthServiceUnknownException');
    });
});
