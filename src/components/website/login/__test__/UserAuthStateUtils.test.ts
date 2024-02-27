import {
    MailInputError,
    getPasswordInputErrorAndNextState,
    getUserEmailError,
    userAuthStateFromOTP,
    userAuthStateFromUserLogin,
} from '../UserAuthStateUtils';
import { UserAuthState } from '../LoginModal';

describe('user email logic tests', () => {
    it('should not throw error when good email is presented', () => {
        const email = 'good@email.com';

        const userEmailError = getUserEmailError(email);

        expect(userEmailError).toEqual(null);
    });

    it('should throw mail not valid error', () => {
        const email = 'this is not an email!';

        const userEmailError = getUserEmailError(email);

        expect(userEmailError).toEqual(new Error(MailInputError.NOT_VALID));
    });

    it('should throw mail already exists error', () => {
        const email = 'already@exists.com';

        const userEmailError = getUserEmailError(email);

        expect(userEmailError).toEqual(new Error(MailInputError.ALREADY_EXISTS));
    });
});

describe('user password logic tests', () => {
    it('should return no error and provide OTP state if passwords match', () => {
        const { passwordInputError, nextUserAuthState } = getPasswordInputErrorAndNextState(
            'passwordsMatch',
            'passwordsMatch',
        );

        expect(passwordInputError).toEqual(null);
        expect(nextUserAuthState).toEqual(UserAuthState.SIGNUP_OTP);
    });

    it('should return an error and keep the state if passwords dont match', () => {
        const { passwordInputError, nextUserAuthState } = getPasswordInputErrorAndNextState(
            'passwordsDontMatch',
            'passwordsMatch',
        );

        expect(passwordInputError).not.toEqual(null);
        expect(nextUserAuthState).toEqual(UserAuthState.SIGNUP_PASSWORD);
    });

    it.failing(
        'should return an error and keep the state if password has not been input or it is an empty string',
        () => {
            const { passwordInputError, nextUserAuthState } = getPasswordInputErrorAndNextState('', '');

            expect(passwordInputError).not.toEqual(null);
            expect(nextUserAuthState).toEqual(UserAuthState.SIGNUP_OTP);
        },
    );
});

describe('OTP logic tests', () => {
    it('should move from sign up OTP to sign up OTP loading stage', () => {
        const nextUserAuthState = userAuthStateFromOTP(UserAuthState.SIGNUP_OTP);

        expect(nextUserAuthState).toEqual(UserAuthState.SIGNUP_OTP_LOADING);
    });

    it('should move from log in OTP to log in OTP loading stage', () => {
        const nextUserAuthState = userAuthStateFromOTP(UserAuthState.LOGIN_OTP);

        expect(nextUserAuthState).toEqual(UserAuthState.LOGIN_OTP_LOADING);
    });
});

describe('User authentication logic tests', () => {
    it('should move a good user to logged state', () => {
        const nextUserAuthState = userAuthStateFromUserLogin('user@mail.com', 'short');

        expect(nextUserAuthState).toEqual(UserAuthState.LOGGED_IN);
    });

    it('should keep a bad user at the password input state', () => {
        const nextUserAuthState = userAuthStateFromUserLogin('bad@user.com', 'badPassword');

        expect(nextUserAuthState).toEqual(UserAuthState.LOGIN);
    });
});
