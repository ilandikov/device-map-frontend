import { AuthenticationStep, PasswordError } from '../state';
import {
    authenticationStepFromOTP,
    authenticationStepFromUserLogin,
    getPasswordError,
    isEmailRegistered,
    isEmailValid,
} from '../reducerUtils';

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

    it('should report registered email', () => {
        const email = 'already@exists.com';

        const mailInputError = isEmailRegistered(email);

        expect(mailInputError).toEqual(true);
    });

    it('should report not registered email', () => {
        const email = 'new@user.fr';

        const mailInputError = isEmailRegistered(email);

        expect(mailInputError).toEqual(false);
    });
});

describe('user password logic tests', () => {
    it('should return no error if a strong password has been input', () => {
        const passwordInputError = getPasswordError('strongPassword1!');

        expect(passwordInputError).toEqual(null);
    });

    it.each([
        ['', PasswordError.EMPTY],
        ['lowercase', PasswordError.NO_UPPERCASE],
        ['UPPERCASE', PasswordError.NO_LOWERCASE],
        ['upperCaseAndLowerCase', PasswordError.NO_DIGITS],
    ])('should return error for password "%s"', (password, expectedError) => {
        const passwordInputError = getPasswordError(password);
        expect(passwordInputError).toEqual(new Error(expectedError));
    });
});

describe('OTP logic tests', () => {
    it('should move from sign up OTP to sign up OTP loading stage', () => {
        const nextUserAuthState = authenticationStepFromOTP(AuthenticationStep.SIGNUP_OTP);

        expect(nextUserAuthState).toEqual(AuthenticationStep.SIGNUP_OTP_LOADING);
    });

    it('should move from log in OTP to log in OTP loading stage', () => {
        const nextUserAuthState = authenticationStepFromOTP(AuthenticationStep.LOGIN_OTP);

        expect(nextUserAuthState).toEqual(AuthenticationStep.LOGIN_OTP_LOADING);
    });
});

describe('User authentication logic tests', () => {
    it('should move a good user to logged state', () => {
        const nextUserAuthState = authenticationStepFromUserLogin('user@mail.com', 'short');

        expect(nextUserAuthState).toEqual(AuthenticationStep.LOGGED_IN);
    });

    it('should keep a bad user at the password input state', () => {
        const nextUserAuthState = authenticationStepFromUserLogin('bad@user.com', 'badPassword');

        expect(nextUserAuthState).toEqual(AuthenticationStep.LOGIN);
    });
});
