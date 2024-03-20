import { AuthenticationStep, MailInputError } from './state';

export function userAuthStateFromUserLogin(userEmail: string, userPassword: string) {
    if (userEmail === 'user@mail.com' && userPassword === 'short') {
        return AuthenticationStep.LOGGED_IN;
    }

    return AuthenticationStep.LOGIN;
}

export function userAuthStateFromOTP(userAuthState: AuthenticationStep.LOGIN_OTP | AuthenticationStep.SIGNUP_OTP) {
    if (userAuthState === AuthenticationStep.LOGIN_OTP) {
        return AuthenticationStep.LOGIN_OTP_LOADING;
    }

    return AuthenticationStep.SIGNUP_OTP_LOADING;
}

function isValidEmail(email: string) {
    const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegexp.test(email);
}

function getPasswordInputError(userPassword: string, userPasswordRepeat: string): Error | null {
    if (userPassword === '' && userPasswordRepeat === '') {
        return new Error();
    }

    if (userPassword !== userPasswordRepeat) {
        return new Error();
    }

    return null;
}

export function getPasswordInputErrorAndNextState(userPassword: string, userPasswordRepeat: string) {
    const passwordInputError = getPasswordInputError(userPassword, userPasswordRepeat);
    const nextUserAuthState = passwordInputError ? AuthenticationStep.SIGNUP_PASSWORD : AuthenticationStep.SIGNUP_OTP;

    return { passwordInputError, nextUserAuthState };
}
export function getMailInputError(userEmail: string): Error | null {
    if (userEmail === 'already@exists.com') {
        return new Error(MailInputError.ALREADY_EXISTS);
    }

    if (!isValidEmail(userEmail)) {
        return new Error(MailInputError.NOT_VALID);
    }

    return null;
}
