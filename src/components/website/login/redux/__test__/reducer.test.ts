import { authentication } from '../reducer';
import {
    LoginModalAction,
    LoginModalInputTypes,
    LoginModalVerifyTypes,
    loginModalButtonClick,
    loginModalInput,
    loginModalVerifyRequest,
} from '../actions';
import {
    AuthenticationState,
    AuthenticationStep,
    MailInputError,
    PasswordError,
    authenticationInitialState,
} from '../state';

export function buildState(partialState: Partial<AuthenticationState>): AuthenticationState {
    return {
        step: partialState.step ?? AuthenticationStep.WELCOME,
        email: partialState.email ?? '',
        emailError: partialState.emailError ?? null,
        password: partialState.password ?? '',
        passwordRepeat: partialState.passwordRepeat ?? '',
        passwordError: partialState.passwordError ?? null,
    };
}

function verifyStateChange(
    initialState: AuthenticationState,
    action: LoginModalAction,
    expectedChange: Partial<AuthenticationState>,
) {
    const nextState = authentication(initialState, action);

    const expectedState: AuthenticationState = {
        ...initialState,
        ...expectedChange,
    };
    expect(nextState).toEqual(expectedState);
}

describe('LoginModal reducer tests', () => {
    it('should not change the initial state', () => {
        const initialState = authenticationInitialState;
        const action = { type: 'DUMMY_ACTION' };

        // @ts-expect-error
        verifyStateChange(initialState, action, {});
    });
});

describe('welcome screen buttons', () => {
    it('should transition to email input', () => {
        const initialState = buildState({ step: AuthenticationStep.WELCOME });
        const action = loginModalButtonClick('accountRegister');

        verifyStateChange(initialState, action, {
            step: AuthenticationStep.MAIL_INPUT,
        });
    });

    it('should transition to user login', () => {
        const initialState = buildState({ step: AuthenticationStep.WELCOME });
        const action = loginModalButtonClick('accountLogin');

        verifyStateChange(initialState, action, {
            step: AuthenticationStep.LOGIN,
        });
    });
});

describe('navigation logic', () => {
    it('cancel button: should reset the state back to initial', () => {
        const initialState = buildState({
            step: AuthenticationStep.SIGNUP_OTP,
            email: 'something@somewhere.com',
            emailError: new Error('whack'),
            password: 'authMePls',
            passwordRepeat: 'authMePls',
            passwordError: new Error('funnyPassword'),
        });
        const action = loginModalButtonClick('cancel');

        verifyStateChange(initialState, action, {
            step: AuthenticationStep.WELCOME,
            email: '',
            emailError: null,
            password: '',
            passwordRepeat: '',
            passwordError: null,
        });
    });

    it.each([
        // From mail input to welcome
        [AuthenticationStep.MAIL_INPUT, AuthenticationStep.WELCOME],

        // From password input to welcome
        [AuthenticationStep.LOGIN, AuthenticationStep.WELCOME],

        // From password reset to login
        [AuthenticationStep.LOGIN_PASSWORD_RESET, AuthenticationStep.LOGIN],

        // From password creation to mail input
        [AuthenticationStep.SIGNUP_PASSWORD, AuthenticationStep.MAIL_INPUT],
    ])('go back button: should transition from %s to %s', (initialUserAuthState, expectedUserAuthState) => {
        const initialState = buildState({ step: initialUserAuthState });
        const action = loginModalButtonClick('goBack');

        verifyStateChange(initialState, action, {
            step: expectedUserAuthState,
        });
    });
});

describe('email input logic', () => {
    it('should update user email', () => {
        const initialState = buildState({ step: AuthenticationStep.MAIL_INPUT });
        const action = loginModalInput(LoginModalInputTypes.USER_EMAIL, 'myMail@myServer.xyz');

        verifyStateChange(initialState, action, {
            email: 'myMail@myServer.xyz',
        });
    });

    it('should remove mail error and transition to password creation after good mail has been sent to verification', () => {
        const initialState = buildState({
            step: AuthenticationStep.MAIL_INPUT,
            email: 'good@email.com',
            emailError: new Error('omgSomethingIsWrong'),
        });
        const action = loginModalVerifyRequest(LoginModalVerifyTypes.USER_EMAIL);

        verifyStateChange(initialState, action, {
            step: AuthenticationStep.SIGNUP_PASSWORD,
            emailError: null,
        });
    });

    it('should set mail error and stay at mail input when bad mail has been sent to verification', () => {
        const initialState = buildState({
            step: AuthenticationStep.MAIL_INPUT,
            email: 'this is not an email!',
        });
        const action = loginModalVerifyRequest(LoginModalVerifyTypes.USER_EMAIL);

        verifyStateChange(initialState, action, { emailError: new Error(MailInputError.NOT_VALID) });
    });

    it('should set mail error and stay at mail input when already existing mail has been sent to verification', () => {
        const initialState = buildState({
            step: AuthenticationStep.MAIL_INPUT,
            email: 'already@exists.com',
        });
        const action = loginModalVerifyRequest(LoginModalVerifyTypes.USER_EMAIL);

        verifyStateChange(initialState, action, {
            emailError: new Error(MailInputError.ALREADY_EXISTS),
        });
    });

    it('should remove mail error and transition to login with an existing mail', () => {
        const initialState = buildState({
            step: AuthenticationStep.MAIL_INPUT,
            email: 'already@exists.com',
            emailError: new Error(MailInputError.ALREADY_EXISTS),
        });
        const action = loginModalButtonClick('accountLogin');

        verifyStateChange(initialState, action, {
            step: AuthenticationStep.LOGIN,
            emailError: null,
        });
    });
});

describe('user password logic', () => {
    it('should set user password', () => {
        const initialState = buildState({});

        const action = loginModalInput(LoginModalInputTypes.USER_PASSWORD, 'haha!!11');

        verifyStateChange(initialState, action, {
            password: 'haha!!11',
        });
    });

    it('should set user password repeat', () => {
        const initialState = buildState({});

        const action = loginModalInput(LoginModalInputTypes.USER_PASSWORD_REPEAT, 'lmao!rofl!');

        verifyStateChange(initialState, action, {
            passwordRepeat: 'lmao!rofl!',
        });
    });

    it('should transition to OTP verification if passwords are matching and remove password error', () => {
        const initialState = buildState({
            step: AuthenticationStep.SIGNUP_PASSWORD,
            password: 'passwordsMatchAndAreStrong9%',
            passwordRepeat: 'passwordsMatchAndAreStrong9%',
            passwordError: new Error('thisIsSoWrong'),
        });

        const action = loginModalVerifyRequest(LoginModalVerifyTypes.USER_PASSWORD);

        verifyStateChange(initialState, action, {
            step: AuthenticationStep.SIGNUP_OTP,
            passwordError: null,
        });
    });

    it('should set password error if passwords are not matching', () => {
        const initialState = buildState({
            step: AuthenticationStep.SIGNUP_PASSWORD,
            password: 'dontMatch',
            passwordRepeat: 'likeForSureDontMatch',
        });

        const action = loginModalVerifyRequest(LoginModalVerifyTypes.USER_PASSWORD);

        verifyStateChange(initialState, action, {
            passwordError: new Error(PasswordError.NOT_MATCHING),
        });
    });
});

describe('OTP logic', () => {
    it('should move from sign up OTP to sign up OTP loading stage', () => {
        const initialState = buildState({
            step: AuthenticationStep.SIGNUP_OTP,
        });
        const action = loginModalButtonClick('next');

        verifyStateChange(initialState, action, {
            step: AuthenticationStep.SIGNUP_OTP_LOADING,
        });
    });

    it('should move from log in OTP to log in OTP loading stage', () => {
        const initialState = buildState({
            step: AuthenticationStep.LOGIN_OTP,
        });
        const action = loginModalButtonClick('next');

        verifyStateChange(initialState, action, {
            step: AuthenticationStep.LOGIN_OTP_LOADING,
        });
    });
});

describe('login logic', () => {
    it('should transition to logged in state after correct user credentials have been presented', () => {
        const initialState = buildState({
            step: AuthenticationStep.LOGIN,
            email: 'user@mail.com',
            password: 'short',
        });
        const action = loginModalVerifyRequest(LoginModalVerifyTypes.USER_EMAIL_AND_PASSWORD);

        verifyStateChange(initialState, action, {
            step: AuthenticationStep.LOGGED_IN,
        });
    });

    it('should stay at login state if incorrect user credentials have been presented', () => {
        const initialState = buildState({
            step: AuthenticationStep.LOGIN,
            email: 'another@user.com',
            password: 'wrongPassword',
        });
        const action = loginModalVerifyRequest(LoginModalVerifyTypes.USER_EMAIL_AND_PASSWORD);

        const expectedChange = {};
        verifyStateChange(initialState, action, expectedChange);
    });

    it('should transition from login to password reset state on password reset button click, keep the mail, reset the password', () => {
        const initialState = buildState({
            step: AuthenticationStep.LOGIN,
            email: 'writeMe@mail.com',
            password: 'iForgot',
        });
        const action = loginModalButtonClick('resetPassword');

        verifyStateChange(initialState, action, {
            step: AuthenticationStep.LOGIN_PASSWORD_RESET,
            password: '',
        });
    });
});

describe('password reset logic', () => {
    it('should transition to OTP verification, reset mail error on mail verification request of an existing email', () => {
        const initialState = buildState({
            step: AuthenticationStep.LOGIN_PASSWORD_RESET,
            email: 'already@exists.com',
            emailError: new Error(MailInputError.NOT_VALID),
        });
        const action = loginModalVerifyRequest(LoginModalVerifyTypes.USER_EMAIL);

        verifyStateChange(initialState, action, {
            step: AuthenticationStep.LOGIN_OTP,
            emailError: null,
        });
    });

    it('should set mail error when a bad email has been set on verification', () => {
        const initialState = buildState({
            step: AuthenticationStep.LOGIN_PASSWORD_RESET,
            email: '!notAMail',
        });
        const action = loginModalVerifyRequest(LoginModalVerifyTypes.USER_EMAIL);

        verifyStateChange(initialState, action, {
            emailError: new Error(MailInputError.NOT_VALID),
        });
    });

    it('should set mail error when such a mail is presented for password reset', () => {
        const initialState = buildState({
            step: AuthenticationStep.LOGIN_PASSWORD_RESET,
            email: 'notRegistered@email.co.kr',
        });
        const action = loginModalVerifyRequest(LoginModalVerifyTypes.USER_EMAIL);

        verifyStateChange(initialState, action, {
            emailError: new Error(MailInputError.NOT_REGISTERED),
        });
    });
});
