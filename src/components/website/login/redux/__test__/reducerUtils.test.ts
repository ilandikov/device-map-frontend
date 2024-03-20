import { AuthenticationStep, MailInputError } from '../state';
import {
    authenticationStepFromOTP,
    authenticationStepFromUserLogin,
    getMailInputError,
    getPasswordInputErrorAndNextState,
} from '../reducerUtils';

describe('user email validation tests', () => {
    it('should return no error on valid mail', () => {
        const email = 'good@email.com';

        const mailInputError = getMailInputError(email);

        expect(mailInputError).toEqual(null);
    });

    it.failing('should throw mail not valid error', () => {
        const email = 'this is not an email!';

        const mailInputError = getMailInputError(email);

        expect(mailInputError).toEqual(new Error(MailInputError.NOT_VALID));
    });

    it('should throw mail already exists error', () => {
        const email = 'already@exists.com';

        const mailInputError = getMailInputError(email);

        expect(mailInputError).toEqual(new Error(MailInputError.ALREADY_EXISTS));
    });
});

describe('user password logic tests', () => {
    it('should return no error and provide OTP state if passwords match', () => {
        const { passwordInputError, nextUserAuthState } = getPasswordInputErrorAndNextState(
            'passwordsMatch',
            'passwordsMatch',
        );

        expect(passwordInputError).toEqual(null);
        expect(nextUserAuthState).toEqual(AuthenticationStep.SIGNUP_OTP);
    });

    it('should return an error and keep the state if passwords dont match', () => {
        const { passwordInputError, nextUserAuthState } = getPasswordInputErrorAndNextState(
            'passwordsDontMatch',
            'passwordsMatch',
        );

        expect(passwordInputError).not.toEqual(null);
        expect(nextUserAuthState).toEqual(AuthenticationStep.SIGNUP_PASSWORD);
    });

    it('should return an error and keep the state if passwords have not been input', () => {
        const { passwordInputError, nextUserAuthState } = getPasswordInputErrorAndNextState('', '');

        expect(passwordInputError).not.toEqual(null);
        expect(nextUserAuthState).toEqual(AuthenticationStep.SIGNUP_PASSWORD);
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
