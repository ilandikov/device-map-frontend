import { UserAuthState } from './LoginModal';

export function userAuthStateFromUserLogin(userEmail: string, userPassword: string) {
    if (userEmail === 'user@mail.com' && userPassword === 'short') {
        return UserAuthState.LOGGED_IN;
    }

    return UserAuthState.LOGIN;
}

export function userAuthStateFromOTP(userAuthState: UserAuthState.LOGIN_OTP | UserAuthState.SIGNUP_OTP) {
    if (userAuthState === UserAuthState.LOGIN_OTP) {
        return UserAuthState.LOGIN_OTP_LOADING;
    }

    return UserAuthState.SIGNUP_OTP_LOADING;
}

export enum MailInputError {
    NOT_VALID = 'mailNotValid',
    ALREADY_EXISTS = 'mailAlreadyExists',
}

export function getUserEmailError(userEmail: string): Error | null {
    if (userEmail === 'already@exists.com') {
        return new Error(MailInputError.ALREADY_EXISTS);
    }

    if (!isValidEmail(userEmail)) {
        return new Error(MailInputError.NOT_VALID);
    }

    return null;
}

function isValidEmail(email: string) {
    const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegexp.test(email);
}

function getPasswordInputError(userPassword: string, userPasswordRepeat: string): Error | null {
    if (userPassword !== userPasswordRepeat) {
        return new Error();
    }

    return null;
}

export function getPasswordInputErrorAndNextState(userPassword: string, userPasswordRepeat: string) {
    const passwordInputError = getPasswordInputError(userPassword, userPasswordRepeat);
    const nextUserAuthState = passwordInputError ? UserAuthState.SIGNUP_PASSWORD : UserAuthState.SIGNUP_OTP;

    return { passwordInputError, nextUserAuthState };
}

export function getUserEmailErrorAndNextState(userEmail: string) {
    const mailInputError = getUserEmailError(userEmail);
    const nextUserAuthState = mailInputError ? UserAuthState.MAIL_INPUT : UserAuthState.SIGNUP_PASSWORD;
    return { mailInputError, nextUserAuthState };
}
