import { AuthenticationStep } from './state';

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

export function getPasswordError(password: string): Error | null {
    if (password === '') {
        return new Error();
    }

    return null;
}

export function isEmailRegistered(userEmail: string) {
    if (userEmail === 'already@exists.com') {
        return true;
    }

    return false;
}
