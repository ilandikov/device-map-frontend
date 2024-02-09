import { UserAuthState } from './LoginModal';

export function userAuthStateFromUserPasswords(userPasswordA: string, userPasswordB: string) {
    let nextUserState = UserAuthState.OTP_INPUT;

    if (userPasswordA !== userPasswordB) {
        nextUserState = UserAuthState.PASSWORD_CREATION_MATCH_ERROR;
    }

    return nextUserState;
}

export function userAuthStateFromUserEmail(userEmail: string) {
    let nextUserAuthState = UserAuthState.PASSWORD_CREATION;

    if (userEmail === 'already@exists.com') {
        nextUserAuthState = UserAuthState.MAIL_ALREADY_EXISTS;
    }

    if (!isValidEmail(userEmail)) {
        nextUserAuthState = UserAuthState.MAIL_NOT_VALID;
    }
    return nextUserAuthState;
}

function isValidEmail(email: string) {
    const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegexp.test(email);
}
