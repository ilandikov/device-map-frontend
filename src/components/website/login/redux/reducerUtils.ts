import { AuthenticationStep, PasswordError } from './state';

export function authenticationStepFromOTP(
    userAuthState: AuthenticationStep.PASSWORD_RESET_OTP | AuthenticationStep.PASSWORD_CREATION_OTP,
) {
    if (userAuthState === AuthenticationStep.PASSWORD_RESET_OTP) {
        return AuthenticationStep.PASSWORD_RESET_OTP_LOADING;
    }

    return AuthenticationStep.PASSWORD_CREATION_OTP_LOADING;
}

export function isEmailValid(email: string) {
    const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegexp.test(email);
}

export function getPasswordError(password: string): Error | null {
    if (password === '') {
        return new Error(PasswordError.EMPTY);
    }

    const upperCaseRegExp = new RegExp(/[A-Z]/);
    if (upperCaseRegExp.test(password) === false) {
        return new Error(PasswordError.NO_UPPERCASE);
    }

    const lowerCaseRegExp = new RegExp(/[a-z]/);
    if (lowerCaseRegExp.test(password) === false) {
        return new Error(PasswordError.NO_LOWERCASE);
    }

    const digitsRegExp = new RegExp(/\d/);
    if (digitsRegExp.test(password) === false) {
        return new Error(PasswordError.NO_DIGITS);
    }

    const specialCharacterRegExp = new RegExp(/\W|_/);
    if (specialCharacterRegExp.test(password) === false) {
        return new Error(PasswordError.NO_SPECIAL_CHARS);
    }

    if (password.length < 8) {
        return new Error(PasswordError.TOO_SHORT);
    }

    return null;
}

export function isEmailRegistered(userEmail: string) {
    if (userEmail === 'already@exists.com') {
        return true;
    }

    return false;
}
