import { MailInputError, PasswordError, getEmailError, getPasswordError } from '../LoginModalAuthenticationHelpers';

describe('user email validation tests', () => {
    it('should report no error for a valid email', () => {
        const email = 'good@email.com';

        const mailInputError = getEmailError(email);

        expect(mailInputError).toEqual(null);
    });

    it('should report a not valid error for a not valid email', () => {
        const email = 'this is not an email!';

        const mailInputError = getEmailError(email);

        expect(mailInputError).toEqual(new Error(MailInputError.NOT_VALID));
    });
});

describe('user password logic tests', () => {
    it('should return no error if a strong password has been input', () => {
        const passwordInputError = getPasswordError('8Chars_!');

        expect(passwordInputError).toEqual(null);
    });

    it.each([
        ['', PasswordError.EMPTY],
        ['lowercase', PasswordError.NO_UPPERCASE],
        ['UPPERCASE', PasswordError.NO_LOWERCASE],
        ['upperCaseAndLowerCase', PasswordError.NO_DIGITS],
        ['NO1SpecialCHARS7', PasswordError.NO_SPECIAL_CHARS],
        ['7Chars_', PasswordError.TOO_SHORT],
    ])('should return error for password "%s"', (password, expectedErrorMessage) => {
        const passwordInputError = getPasswordError(password);
        expect(passwordInputError).toEqual(new Error(expectedErrorMessage));
    });
});
