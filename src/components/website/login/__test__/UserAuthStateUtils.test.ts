import {
    userAuthStateFromOTP,
    userAuthStateFromUserEmail,
    userAuthStateFromUserLogin,
    userAuthStateFromUserPasswords,
} from '../UserAuthStateUtils';
import { UserAuthState } from '../LoginModal';

describe('user email logic tests', () => {
    it('should move to password creation when new email is presented', () => {
        const email = 'good@email.com';

        const newUserState = userAuthStateFromUserEmail(email);

        expect(newUserState).toEqual(UserAuthState.PASSWORD_CREATION);
    });

    it('should move to email not valid stage when a bad email is presented', () => {
        const email = 'this is not an email!';

        const newUserState = userAuthStateFromUserEmail(email);

        expect(newUserState).toEqual(UserAuthState.MAIL_NOT_VALID);
    });

    it('should move to email already exists stage when already existing mail is presented', () => {
        const email = 'already@exists.com';

        const newUserState = userAuthStateFromUserEmail(email);

        expect(newUserState).toEqual(UserAuthState.MAIL_ALREADY_EXISTS);
    });
});

describe('user password logic tests', () => {
    it('should move to OTP input if passwords match', () => {
        const nextUserAuthState = userAuthStateFromUserPasswords('passwordsMatch', 'passwordsMatch');

        expect(nextUserAuthState).toEqual(UserAuthState.OTP_INPUT);
    });

    it('should move to error state if passwords dont match', () => {
        const nextUserAuthState = userAuthStateFromUserPasswords('passwordsDontMatch', 'passwordsMatch');

        expect(nextUserAuthState).toEqual(UserAuthState.PASSWORD_CREATION_MATCH_ERROR);
    });

    it.failing('should move to error state if password has not been input or it is an empty string', () => {
        const nextUserAuthState = userAuthStateFromUserPasswords('', '');

        expect(nextUserAuthState).toHaveBeenCalledWith(UserAuthState.PASSWORD_CREATION_MATCH_ERROR);
    });
});

describe('OTP logic tests', () => {
    it('should move to OTP loading stage', () => {
        const nextUserAuthState = userAuthStateFromOTP();

        expect(nextUserAuthState).toEqual(UserAuthState.OTP_LOADING);
    });
});

describe('User authentication logic tests', () => {
    it('should move a good user to logged state', () => {
        const nextUserAuthState = userAuthStateFromUserLogin('user@mail.com', 'short');

        expect(nextUserAuthState).toEqual(UserAuthState.USER_LOGGED_IN);
    });

    it('should keep a bad user at the password input state', () => {
        const nextUserAuthState = userAuthStateFromUserLogin('bad@user.com', 'badPassword');

        expect(nextUserAuthState).toEqual(UserAuthState.PASSWORD_INPUT);
    });
});
