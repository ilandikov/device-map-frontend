import { UserAuthState } from './LoginModal';

export function userAuthStateFromUserLogin(userEmail: string, userPassword: string) {
    if (userEmail === 'user@mail.com' && userPassword === 'short') {
        return UserAuthState.LOGGED_IN;
    }

    return UserAuthState.LOGIN;
}

export function userAuthStateFromOTP() {
    return UserAuthState.SIGNUP_OTP_LOADING;
}

export function userAuthStateFromUserPasswords(userPasswordA: string, userPasswordB: string) {
    let nextUserState = UserAuthState.SIGNUP_OTP;

    if (userPasswordA !== userPasswordB) {
        nextUserState = UserAuthState.SIGNUP_PASSWORD_ERROR;
    }

    return nextUserState;
}

export function userAuthStateFromUserEmail(userEmail: string) {
    let nextUserAuthState = UserAuthState.SIGNUP_PASSWORD;

    if (userEmail === 'already@exists.com') {
        nextUserAuthState = UserAuthState.MAIL_INPUT_ERROR_EXISTENCE;
    }

    if (!isValidEmail(userEmail)) {
        nextUserAuthState = UserAuthState.MAIL_INPUT_ERROR_VALIDITY;
    }
    return nextUserAuthState;
}
function isValidEmail(email: string) {
    const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegexp.test(email);
}
