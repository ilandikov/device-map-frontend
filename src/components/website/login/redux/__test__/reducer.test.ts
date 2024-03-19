import { loginModalReducer } from '../reducer';
import {
    LoginModalAction,
    LoginModalInputTypes,
    LoginModalVerifyTypes,
    loginModalButtonClick,
    loginModalInput,
    loginModalVerifyRequest,
} from '../actions';
import { LoginModalState, MailInputError, UserAuthState } from '../state';

function buildState(partialState: Partial<LoginModalState>): LoginModalState {
    return {
        userAuthState: partialState.userAuthState ?? UserAuthState.WELCOME,
        userEmail: partialState.userEmail ?? '',
        userEmailError: partialState.userEmailError ?? null,
        userPassword: partialState.userPassword ?? '',
        userPasswordRepeat: partialState.userPasswordRepeat ?? '',
        userPasswordError: partialState.userPasswordError ?? null,
    };
}

function verifyStateChange(
    initialState: LoginModalState,
    action: LoginModalAction,
    expectedChange: Partial<LoginModalState>,
) {
    const nextState = loginModalReducer(initialState, action);

    const expectedState: LoginModalState = {
        ...initialState,
        ...expectedChange,
    };
    expect(nextState).toEqual(expectedState);
}

describe('LoginModal reducer tests', () => {
    it('should return initial state', () => {
        // @ts-expect-error
        const initialState = loginModalReducer(undefined, { type: 'DUMMY_ACTION' });

        expect(initialState).toEqual({
            userAuthState: UserAuthState.WELCOME,
            userEmail: '',
            userEmailError: null,
            userPassword: '',
            userPasswordRepeat: '',
            userPasswordError: null,
        });
    });
});

describe('welcome screen buttons', () => {
    it('should transition to email input', () => {
        const nextState = loginModalReducer(undefined, loginModalButtonClick('accountRegister'));

        expect(nextState).toEqual({
            userAuthState: UserAuthState.MAIL_INPUT,
            userEmail: '',
            userEmailError: null,
            userPassword: '',
            userPasswordRepeat: '',
            userPasswordError: null,
        });
    });

    it('should transition to user login', () => {
        const nextState = loginModalReducer(undefined, loginModalButtonClick('accountLogin'));

        expect(nextState).toEqual({
            userAuthState: UserAuthState.LOGIN,
            userEmail: '',
            userEmailError: null,
            userPassword: '',
            userPasswordRepeat: '',
            userPasswordError: null,
        });
    });
});

describe('navigation logic', () => {
    it.each(Object.keys(UserAuthState))(
        'cancel button: should transition back to welcome from %s state',
        (initialUserAuthState: UserAuthState) => {
            const initialState = buildState({ userAuthState: initialUserAuthState });
            const action = loginModalButtonClick('cancel');

            verifyStateChange(initialState, action, {
                userAuthState: UserAuthState.WELCOME,
            });
        },
    );

    it.each([
        // From mail input to welcome
        [UserAuthState.MAIL_INPUT, UserAuthState.WELCOME],

        // From password input to welcome
        [UserAuthState.LOGIN, UserAuthState.WELCOME],

        // From password reset to login
        [UserAuthState.LOGIN_PASSWORD_RESET, UserAuthState.LOGIN],

        // From password creation to mail input
        [UserAuthState.SIGNUP_PASSWORD, UserAuthState.MAIL_INPUT],
    ])('go back button: should transition from %s to %s', (initialUserAuthState, expectedUserAuthState) => {
        const initialState = buildState({ userAuthState: initialUserAuthState });
        const action = loginModalButtonClick('goBack');

        verifyStateChange(initialState, action, {
            userAuthState: expectedUserAuthState,
        });
    });
});

describe('email input logic', () => {
    it('should update user email', () => {
        const initialState = buildState({ userAuthState: UserAuthState.MAIL_INPUT });
        const action = loginModalInput(LoginModalInputTypes.USER_EMAIL, 'myMail@myServer.xyz');

        verifyStateChange(initialState, action, {
            userEmail: 'myMail@myServer.xyz',
        });
    });

    it('should remove mail error and transition to password creation after good mail has been sent to verification', () => {
        const initialState = buildState({
            userAuthState: UserAuthState.MAIL_INPUT,
            userEmail: 'good@email.com',
            userEmailError: new Error('omgSomethingIsWrong'),
        });
        const action = loginModalVerifyRequest(LoginModalVerifyTypes.USER_EMAIL);

        verifyStateChange(initialState, action, {
            userAuthState: UserAuthState.SIGNUP_PASSWORD,
            userEmailError: null,
        });
    });

    it('should set mail error and stay at mail input when bad mail has been sent to verification', () => {
        const initialState = buildState({
            userAuthState: UserAuthState.MAIL_INPUT,
            userEmail: 'this is not an email!',
        });
        const action = loginModalVerifyRequest(LoginModalVerifyTypes.USER_EMAIL);

        const expectedChange = { userEmailError: new Error(MailInputError.NOT_VALID) };

        verifyStateChange(initialState, action, expectedChange);
    });

    it('should set mail error and stay at mail input when already existing mail has been sent to verification', () => {
        const initialState = buildState({
            userAuthState: UserAuthState.MAIL_INPUT,
            userEmail: 'already@exists.com',
        });
        const action = loginModalVerifyRequest(LoginModalVerifyTypes.USER_EMAIL);

        verifyStateChange(initialState, action, {
            userEmailError: new Error(MailInputError.ALREADY_EXISTS),
        });
    });

    it('should remove mail error and transition to login with an existing mail', () => {
        const initialState = buildState({
            userAuthState: UserAuthState.MAIL_INPUT,
            userEmail: 'already@exists.com',
            userEmailError: new Error(MailInputError.ALREADY_EXISTS),
        });
        const action = loginModalButtonClick('accountLogin');

        verifyStateChange(initialState, action, {
            userAuthState: UserAuthState.LOGIN,
            userEmailError: null,
        });
    });
});

describe('user password logic', () => {
    it('should set user password', () => {
        const initialState = buildState({});

        const action = loginModalInput(LoginModalInputTypes.USER_PASSWORD, 'haha!!11');

        verifyStateChange(initialState, action, {
            userPassword: 'haha!!11',
        });
    });

    it('should set user password repeat', () => {
        const initialState = buildState({});

        const action = loginModalInput(LoginModalInputTypes.USER_PASSWORD_REPEAT, 'lmao!rofl!');

        verifyStateChange(initialState, action, {
            userPasswordRepeat: 'lmao!rofl!',
        });
    });

    it('should transition to OTP verification if passwords are matching and remove password error', () => {
        const initialState = buildState({
            userAuthState: UserAuthState.SIGNUP_PASSWORD,
            userPassword: 'passwordsMatch',
            userPasswordRepeat: 'passwordsMatch',
            userPasswordError: new Error('thisIsSoWrong'),
        });

        const action = loginModalVerifyRequest(LoginModalVerifyTypes.USER_PASSWORD);

        verifyStateChange(initialState, action, {
            userAuthState: UserAuthState.SIGNUP_OTP,
            userPasswordError: null,
        });
    });

    it('should stay at password input if user passwords are not matching', () => {
        const initialState = buildState({
            userAuthState: UserAuthState.SIGNUP_PASSWORD,
            userPassword: 'dontMatch',
            userPasswordRepeat: 'likeForSureDontMatch',
        });

        const action = loginModalVerifyRequest(LoginModalVerifyTypes.USER_PASSWORD);

        verifyStateChange(initialState, action, {
            userPasswordError: new Error(),
        });
    });
});

describe('OTP logic', () => {
    it('should move from sign up OTP to sign up OTP loading stage', () => {
        const initialState = buildState({
            userAuthState: UserAuthState.SIGNUP_OTP,
        });
        const action = loginModalButtonClick('next');

        verifyStateChange(initialState, action, {
            userAuthState: UserAuthState.SIGNUP_OTP_LOADING,
        });
    });

    it('should move from log in OTP to log in OTP loading stage', () => {
        const initialState = buildState({
            userAuthState: UserAuthState.LOGIN_OTP,
        });
        const action = loginModalButtonClick('next');

        verifyStateChange(initialState, action, {
            userAuthState: UserAuthState.LOGIN_OTP_LOADING,
        });
    });
});

describe('login logic', () => {
    it('should transition to logged in state after correct user credentials have been presented', () => {
        const initialState = buildState({
            userAuthState: UserAuthState.LOGIN,
            userEmail: 'user@mail.com',
            userPassword: 'short',
        });
        const action = loginModalVerifyRequest(LoginModalVerifyTypes.USER_EMAIL_AND_PASSWORD);

        verifyStateChange(initialState, action, {
            userAuthState: UserAuthState.LOGGED_IN,
        });
    });

    it('should stay at login state if incorrect user credentials have been presented', () => {
        const initialState = buildState({
            userAuthState: UserAuthState.LOGIN,
            userEmail: 'another@user.com',
            userPassword: 'wrongPassword',
        });
        const action = loginModalVerifyRequest(LoginModalVerifyTypes.USER_EMAIL_AND_PASSWORD);

        const expectedChange = {};
        verifyStateChange(initialState, action, expectedChange);
    });

    it('should transition from login to password reset state on password reset button click, keep the mail, reset the password', () => {
        const initialState = buildState({
            userAuthState: UserAuthState.LOGIN,
            userEmail: 'writeMe@mail.com',
            userPassword: 'iForgot',
        });
        const action = loginModalButtonClick('resetPassword');

        verifyStateChange(initialState, action, {
            userAuthState: UserAuthState.LOGIN_PASSWORD_RESET,
            userPassword: '',
        });
    });
});

describe('password reset logic', () => {
    it('should transition to OTP verification from after password reset request', () => {
        const initialState = buildState({
            userAuthState: UserAuthState.LOGIN_PASSWORD_RESET,
            userEmail: 'please@reset.com',
        });
        const action = loginModalVerifyRequest(LoginModalVerifyTypes.USER_EMAIL);

        verifyStateChange(initialState, action, {
            userAuthState: UserAuthState.LOGIN_OTP,
        });
    });
});
