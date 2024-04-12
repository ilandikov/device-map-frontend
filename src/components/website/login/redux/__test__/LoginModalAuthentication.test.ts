import { loginModalAuthentication } from '../LoginModalAuthentication';
import {
    LoginModalAction,
    LoginModalInputTypes,
    LoginModalNotificationTypes,
    LoginModalVerifyTypes,
    loginModalButtonClick,
    loginModalFailureNotification,
    loginModalInput,
    loginModalNoAction,
    loginModalSuccessNotification,
    loginModalVerifyRequest,
} from '../LoginModalAction';
import {
    AuthenticationState,
    AuthenticationStep,
    MailInputError,
    OTPError,
    PasswordError,
    authenticationInitialState,
    buildAuthenticationState,
} from '../state';

function verifyStateChange(
    initialState: AuthenticationState,
    action: LoginModalAction,
    expectedChange: Partial<AuthenticationState>,
) {
    const nextState = loginModalAuthentication(initialState, action);

    const expectedState: AuthenticationState = {
        ...initialState,
        ...expectedChange,
    };
    expect(nextState).toEqual(expectedState);
}

describe('LoginModal reducer tests', () => {
    it('should not change the initial state', () => {
        const initialState = authenticationInitialState;
        const action = loginModalNoAction();

        verifyStateChange(initialState, action, {});
    });
});

describe('welcome screen buttons', () => {
    it('should transition to email input', () => {
        const initialState = buildAuthenticationState({ step: AuthenticationStep.WELCOME });
        const action = loginModalButtonClick('accountRegister');

        verifyStateChange(initialState, action, {
            step: AuthenticationStep.MAIL_INPUT,
        });
    });

    it('should transition to user login', () => {
        const initialState = buildAuthenticationState({ step: AuthenticationStep.WELCOME });
        const action = loginModalButtonClick('accountLogin');

        verifyStateChange(initialState, action, {
            step: AuthenticationStep.LOGIN,
        });
    });
});

describe('navigation logic', () => {
    it('cancel button: should reset the state back to initial', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_CREATION_OTP,
            email: 'something@somewhere.com',
            error: new Error('whack'),
            password: 'authMePls',
            passwordRepeat: 'authMePls',
            OTP: '654342',
        });
        const action = loginModalButtonClick('cancel');

        verifyStateChange(initialState, action, {
            step: AuthenticationStep.WELCOME,
            email: '',
            error: null,
            password: '',
            passwordRepeat: '',
            OTP: '',
        });
    });

    it.each([
        // From mail input to welcome
        [AuthenticationStep.MAIL_INPUT, AuthenticationStep.WELCOME],

        // From password input to welcome
        [AuthenticationStep.LOGIN, AuthenticationStep.WELCOME],

        // From password reset to login
        [AuthenticationStep.PASSWORD_RESET_REQUEST, AuthenticationStep.LOGIN],

        // From password creation to mail input
        [AuthenticationStep.PASSWORD_CREATION, AuthenticationStep.MAIL_INPUT],
    ])('go back button: should transition from %s to %s', (initialUserAuthState, expectedUserAuthState) => {
        const initialState = buildAuthenticationState({ step: initialUserAuthState });
        const action = loginModalButtonClick('goBack');

        verifyStateChange(initialState, action, {
            step: expectedUserAuthState,
        });
    });
});

describe('email input logic', () => {
    it('should update user email', () => {
        const initialState = buildAuthenticationState({ step: AuthenticationStep.MAIL_INPUT });
        const action = loginModalInput(LoginModalInputTypes.EMAIL, 'myMail@myServer.xyz');

        verifyStateChange(initialState, action, {
            email: 'myMail@myServer.xyz',
        });
    });

    it('should remove mail error and transition to password creation after good mail has been sent to verification', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.MAIL_INPUT,
            email: 'good@email.com',
            error: new Error('omgSomethingIsWrong'),
        });
        const action = loginModalVerifyRequest(LoginModalVerifyTypes.EMAIL);

        verifyStateChange(initialState, action, {
            step: AuthenticationStep.PASSWORD_CREATION,
            error: null,
        });
    });

    it('should set mail error and stay at mail input when bad mail has been sent to verification', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.MAIL_INPUT,
            email: 'this is not an email!',
        });
        const action = loginModalVerifyRequest(LoginModalVerifyTypes.EMAIL);

        verifyStateChange(initialState, action, { error: new Error(MailInputError.NOT_VALID) });
    });

    it('should remove mail error and transition to login with an existing mail', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.MAIL_INPUT,
            email: 'already@exists.com',
            error: new Error(MailInputError.ALREADY_EXISTS),
        });
        const action = loginModalButtonClick('accountLogin');

        verifyStateChange(initialState, action, {
            step: AuthenticationStep.LOGIN,
            error: null,
        });
    });
});

describe('user password logic', () => {
    it('should set user password', () => {
        const initialState = buildAuthenticationState({});

        const action = loginModalInput(LoginModalInputTypes.PASSWORD, 'haha!!11');

        verifyStateChange(initialState, action, {
            password: 'haha!!11',
        });
    });

    it('should set user password repeat', () => {
        const initialState = buildAuthenticationState({});

        const action = loginModalInput(LoginModalInputTypes.PASSWORD_REPEAT, 'lmao!rofl!');

        verifyStateChange(initialState, action, {
            passwordRepeat: 'lmao!rofl!',
        });
    });

    it('should transition to loading step after password creation if passwords are matching and remove password error', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_CREATION,
            password: 'passwordsMatchAndAreStrong9%',
            passwordRepeat: 'passwordsMatchAndAreStrong9%',
            error: new Error('thisIsSoWrong'),
        });

        const action = loginModalVerifyRequest(LoginModalVerifyTypes.PASSWORD);

        verifyStateChange(initialState, action, {
            step: AuthenticationStep.PASSWORD_CREATION_LOADING,
            error: null,
        });
    });

    it('should transition to loading after password reset if passwords are matching and remove password error', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_RESET,
            password: '1!veryGoodPassword',
            passwordRepeat: '1!veryGoodPassword',
            error: new Error('shouldNotHappen'),
        });

        const action = loginModalVerifyRequest(LoginModalVerifyTypes.PASSWORD);

        verifyStateChange(initialState, action, {
            step: AuthenticationStep.PASSWORD_RESET_LOADING,
            error: null,
        });
    });

    it('should set password error if passwords are not matching', () => {
        const initialState = buildAuthenticationState({
            password: 'dontMatch',
            passwordRepeat: 'likeForSureDontMatch',
        });

        const action = loginModalVerifyRequest(LoginModalVerifyTypes.PASSWORD);

        verifyStateChange(initialState, action, {
            error: new Error(PasswordError.NOT_MATCHING),
        });
    });
});

describe('sign up logic', () => {
    it('should transition to OTP input if sign up succeeded', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_CREATION_LOADING,
        });
        const action = loginModalSuccessNotification(LoginModalNotificationTypes.SIGN_UP);

        verifyStateChange(initialState, action, {
            step: AuthenticationStep.PASSWORD_CREATION_OTP,
        });
    });

    it('should transition to mail input if sign up failed', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_CREATION_LOADING,
            error: null,
        });
        const action = loginModalFailureNotification(LoginModalNotificationTypes.SIGN_UP, 'thisIsWhy');

        verifyStateChange(initialState, action, {
            step: AuthenticationStep.MAIL_INPUT,
            error: new Error('thisIsWhy'),
        });
    });
});

describe('sign up OTP logic', () => {
    it('should move from sign up OTP to sign up OTP loading stage', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_CREATION_OTP,
            OTP: '451035',
        });
        const action = loginModalVerifyRequest(LoginModalVerifyTypes.OTP);

        verifyStateChange(initialState, action, {
            step: AuthenticationStep.PASSWORD_CREATION_OTP_LOADING,
        });
    });

    it('should move from password reset OTP to new password input step and reset the error', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_RESET_OTP,
            OTP: '781340',
            error: new Error('verifyTheCodeAgain'),
        });
        const action = loginModalVerifyRequest(LoginModalVerifyTypes.OTP);

        verifyStateChange(initialState, action, {
            step: AuthenticationStep.PASSWORD_RESET,
            error: null,
        });
    });

    it('should move from log in OTP to log in OTP loading stage', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_RESET_OTP,
        });
        const action = loginModalButtonClick('next');

        verifyStateChange(initialState, action, {
            step: AuthenticationStep.PASSWORD_RESET_LOADING,
        });
    });

    it('should set OTP value in the state', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_RESET_OTP,
        });
        const action = loginModalInput(LoginModalInputTypes.OTP, '9832');

        verifyStateChange(initialState, action, {
            OTP: '9832',
        });
    });

    it('should set error if OTP is less than 6 characters', () => {
        const initialState = buildAuthenticationState({
            OTP: '51094',
        });
        const action = loginModalVerifyRequest(LoginModalVerifyTypes.OTP);

        verifyStateChange(initialState, action, {
            error: new Error(OTPError.TOO_SHORT),
        });
    });

    it('should transition to logged in after sign up has been confirmed', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_CREATION_OTP_LOADING,
        });
        const action = loginModalSuccessNotification(LoginModalNotificationTypes.OTP);

        verifyStateChange(initialState, action, {
            step: AuthenticationStep.LOGGED_IN,
        });
    });

    it('should transition back to OTP input if a sign up confirmation failed and set an error', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_CREATION_OTP_LOADING,
        });
        const action = loginModalFailureNotification(
            LoginModalNotificationTypes.OTP,
            'signUpWasNotConfirmedUnfortunately',
        );

        verifyStateChange(initialState, action, {
            step: AuthenticationStep.PASSWORD_CREATION_OTP,
            error: new Error('signUpWasNotConfirmedUnfortunately'),
        });
    });
});

describe('login logic', () => {
    it('should transition to loading state on user and password verify request', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.LOGIN,
        });
        const action = loginModalVerifyRequest(LoginModalVerifyTypes.EMAIL_AND_PASSWORD);

        verifyStateChange(initialState, action, {
            step: AuthenticationStep.LOGIN_LOADING,
        });
    });

    it('should transition from login to password reset state on password reset button click, keep the mail, reset the password and the error', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.LOGIN,
            email: 'writeMe@mail.com',
            password: 'iForgot',
            error: new Error('triedToInputPasswordButFailed'),
        });
        const action = loginModalButtonClick('resetPassword');

        verifyStateChange(initialState, action, {
            step: AuthenticationStep.PASSWORD_RESET_REQUEST,
            password: '',
            error: null,
        });
    });

    it('should transition from loading state to logged in on login success notification', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.LOGIN_LOADING,
        });
        const action = loginModalSuccessNotification(LoginModalNotificationTypes.SIGN_IN);

        verifyStateChange(initialState, action, {
            step: AuthenticationStep.LOGGED_IN,
        });
    });

    it('should transition from loading state back to login step on login failure notification', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.LOGIN_LOADING,
        });
        const action = loginModalFailureNotification(LoginModalNotificationTypes.SIGN_IN, 'thereHasBeenAnError');

        verifyStateChange(initialState, action, {
            step: AuthenticationStep.LOGIN,
            error: new Error('thereHasBeenAnError'),
        });
    });
});

describe('password reset logic', () => {
    it('should transition to loading step and reset error on mail verify request with a valid email', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_RESET_REQUEST,
            email: 'valid@mail.com',
            error: new Error(MailInputError.NOT_VALID),
        });
        const action = loginModalVerifyRequest(LoginModalVerifyTypes.EMAIL);

        verifyStateChange(initialState, action, {
            step: AuthenticationStep.PASSWORD_RESET_LOADING,
            error: null,
        });
    });

    it('should set mail error when a bad email has been set on verification', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_RESET_REQUEST,
            email: '!notAMail',
        });
        const action = loginModalVerifyRequest(LoginModalVerifyTypes.EMAIL);

        verifyStateChange(initialState, action, {
            error: new Error(MailInputError.NOT_VALID),
        });
    });

    it('should transition to OTP input step after password reset OTP has been successfully sent', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_RESET_LOADING,
        });
        const action = loginModalSuccessNotification(LoginModalNotificationTypes.FORGOT_PASSWORD);

        verifyStateChange(initialState, action, {
            step: AuthenticationStep.PASSWORD_RESET_OTP,
        });
    });

    it('should transition back to email input for password reset step on failure', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_RESET_LOADING,
        });
        const action = loginModalFailureNotification(
            LoginModalNotificationTypes.FORGOT_PASSWORD,
            'thereHasBeenAnError',
        );

        verifyStateChange(initialState, action, {
            step: AuthenticationStep.PASSWORD_RESET_REQUEST,
            error: new Error('thereHasBeenAnError'),
        });
    });

    it('should transition to logged in state when password has been reset successfully', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_RESET_LOADING,
        });
        const action = loginModalSuccessNotification(LoginModalNotificationTypes.PASSWORD_RESET);

        verifyStateChange(initialState, action, {
            step: AuthenticationStep.LOGGED_IN,
        });
    });

    it('should go back to OTP input when password has not been reset successfully', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_RESET_LOADING,
        });
        const action = loginModalFailureNotification(
            LoginModalNotificationTypes.PASSWORD_RESET,
            'thisCouldNotGoWorseThanThat',
        );

        verifyStateChange(initialState, action, {
            step: AuthenticationStep.PASSWORD_RESET_OTP,
            error: new Error('thisCouldNotGoWorseThanThat'),
        });
    });
});

describe('logout logic', () => {
    it('should reset the whole state on user button click', () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.LOGGED_IN,
            email: 'reset@me.com',
            error: new Error('meToo!'),
            password: 'andMe',
            passwordRepeat: 'thisAsWell',
            OTP: '457674',
        });
        const action = loginModalButtonClick('userButton');

        verifyStateChange(initialState, action, authenticationInitialState);
    });
});
