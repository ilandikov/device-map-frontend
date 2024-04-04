import { AuthenticationStep, PasswordError } from '../state';
import { authenticationStepFromOTP, getPasswordError, isEmailValid } from '../reducerUtils';

describe('user email validation tests', () => {
    it('should validate good email', () => {
        const email = 'good@email.com';

        const mailInputError = isEmailValid(email);

        expect(mailInputError).toEqual(true);
    });

    it('should not validate bad email', () => {
        const email = 'this is not an email!';

        const mailInputError = isEmailValid(email);

        expect(mailInputError).toEqual(false);
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

describe('OTP logic tests', () => {
    it('should move from sign up OTP to sign up OTP loading stage', () => {
        const nextUserAuthState = authenticationStepFromOTP(AuthenticationStep.PASSWORD_CREATION_OTP);

        expect(nextUserAuthState).toEqual(AuthenticationStep.PASSWORD_CREATION_OTP_LOADING);
    });

    it('should move from log in OTP to log in OTP loading stage', () => {
        const nextUserAuthState = authenticationStepFromOTP(AuthenticationStep.PASSWORD_RESET_OTP);

        expect(nextUserAuthState).toEqual(AuthenticationStep.PASSWORD_RESET_LOADING);
    });
});
