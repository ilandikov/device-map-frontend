import { AuthenticationStep, MailInputError } from './state';

export function authenticationStepFromUserLogin(email: string, password: string) {
    if (email === 'user@mail.com' && password === 'short') {
        return AuthenticationStep.LOGGED_IN;
    }

    return AuthenticationStep.LOGIN;
}

export function authenticationStepFromOTP(userAuthState: AuthenticationStep.LOGIN_OTP | AuthenticationStep.SIGNUP_OTP) {
    if (userAuthState === AuthenticationStep.LOGIN_OTP) {
        return AuthenticationStep.LOGIN_OTP_LOADING;
    }

    return AuthenticationStep.SIGNUP_OTP_LOADING;
}

export function isEmailValid(email: string) {
    const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegexp.test(email);
}

function getPasswordInputError(password: string, passwordRepeat: string): Error | null {
    if (password === '' && passwordRepeat === '') {
        return new Error();
    }

    if (password !== passwordRepeat) {
        return new Error();
    }

    return null;
}

export function getPasswordInputErrorAndNextState(password: string, passwordRepeat: string) {
    const passwordInputError = getPasswordInputError(password, passwordRepeat);
    const nextAuthenticationStep = passwordInputError
        ? AuthenticationStep.SIGNUP_PASSWORD
        : AuthenticationStep.SIGNUP_OTP;

    return { passwordInputError, nextUserAuthState: nextAuthenticationStep };
}
export function getMailInputError(userEmail: string): Error | null {
    if (userEmail === 'already@exists.com') {
        return new Error(MailInputError.ALREADY_EXISTS);
    }

    return null;
}
