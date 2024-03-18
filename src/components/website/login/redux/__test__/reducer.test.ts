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

function buildLoginModalInitialState({
    userAuthState,
    userEmail,
    userEmailError,
    userPassword,
    userPasswordRepeat,
    userPasswordError,
}: {
    userAuthState?: UserAuthState;
    userEmail?: string;
    userEmailError?: Error;
    userPassword?: string;
    userPasswordRepeat?: string;
    userPasswordError?: Error | null;
}): LoginModalState {
    return {
        userAuthState: userAuthState ?? UserAuthState.WELCOME,
        userEmail: userEmail ?? '',
        userEmailError: userEmailError ?? null,
        userPassword: userPassword ?? '',
        userPasswordRepeat: userPasswordRepeat ?? '',
        userPasswordError: userPasswordError ?? null,
    };
}

function verifyNextState(initialState: LoginModalState, action: LoginModalAction, expectedState: LoginModalState) {
    const nextState = loginModalReducer(initialState, action);
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
            const initialState = buildLoginModalInitialState({ userAuthState: initialUserAuthState });
            const action = loginModalButtonClick('cancel');

            const expectedState: LoginModalState = {
                userAuthState: UserAuthState.WELCOME,
                userEmail: '',
                userEmailError: null,
                userPassword: '',
                userPasswordRepeat: '',
                userPasswordError: null,
            };

            verifyNextState(initialState, action, expectedState);
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
        const initialState = buildLoginModalInitialState({ userAuthState: initialUserAuthState });
        const action = loginModalButtonClick('goBack');

        const expectedState: LoginModalState = {
            userAuthState: expectedUserAuthState,
            userEmail: '',
            userEmailError: null,
            userPassword: '',
            userPasswordRepeat: '',
            userPasswordError: null,
        };

        verifyNextState(initialState, action, expectedState);
    });
});

describe('email input logic', () => {
    it('should update user email', () => {
        const initialState = buildLoginModalInitialState({ userAuthState: UserAuthState.MAIL_INPUT });
        const action = loginModalInput(LoginModalInputTypes.USER_EMAIL, 'myMail@myServer.xyz');

        const expectedState: LoginModalState = {
            userAuthState: UserAuthState.MAIL_INPUT,
            userEmail: 'myMail@myServer.xyz',
            userEmailError: null,
            userPassword: '',
            userPasswordRepeat: '',
            userPasswordError: null,
        };

        verifyNextState(initialState, action, expectedState);
    });

    it('should remove mail error and transition to password creation after good mail has been sent to verification', () => {
        const initialState = buildLoginModalInitialState({
            userAuthState: UserAuthState.MAIL_INPUT,
            userEmail: 'good@email.com',
            userEmailError: new Error('omgSomethingIsWrong'),
        });
        const action = loginModalVerifyRequest(LoginModalVerifyTypes.USER_EMAIL);

        const expectedState: LoginModalState = {
            userAuthState: UserAuthState.SIGNUP_PASSWORD,
            userEmail: 'good@email.com',
            userEmailError: null,
            userPassword: '',
            userPasswordRepeat: '',
            userPasswordError: null,
        };

        verifyNextState(initialState, action, expectedState);
    });

    it('should set mail error and stay at mail input when bad mail has been sent to verification', () => {
        const initialState = buildLoginModalInitialState({
            userAuthState: UserAuthState.MAIL_INPUT,
            userEmail: 'this is not an email!',
        });
        const action = loginModalVerifyRequest(LoginModalVerifyTypes.USER_EMAIL);

        const expectedState: LoginModalState = {
            ...initialState,
            userEmailError: new Error(MailInputError.NOT_VALID),
        };

        verifyNextState(initialState, action, expectedState);
    });

    it('should set mail error and stay at mail input when already existing mail has been sent to verification', () => {
        const initialState = buildLoginModalInitialState({
            userAuthState: UserAuthState.MAIL_INPUT,
            userEmail: 'already@exists.com',
        });
        const action = loginModalVerifyRequest(LoginModalVerifyTypes.USER_EMAIL);

        const expectedState: LoginModalState = {
            userAuthState: UserAuthState.MAIL_INPUT,
            userEmail: 'already@exists.com',
            userEmailError: new Error(MailInputError.ALREADY_EXISTS),
            userPassword: '',
            userPasswordRepeat: '',
            userPasswordError: null,
        };

        verifyNextState(initialState, action, expectedState);
    });

    it('should remove mail error and transition to login with an existing mail', () => {
        const initialState = buildLoginModalInitialState({
            userAuthState: UserAuthState.MAIL_INPUT,
            userEmail: 'already@exists.com',
            userEmailError: new Error(MailInputError.ALREADY_EXISTS),
        });
        const action = loginModalButtonClick('accountLogin');

        const expectedState: LoginModalState = {
            userAuthState: UserAuthState.LOGIN,
            userEmail: 'already@exists.com',
            userEmailError: null,
            userPassword: '',
            userPasswordRepeat: '',
            userPasswordError: null,
        };

        verifyNextState(initialState, action, expectedState);
    });
});

describe('user password logic', () => {
    it('should set user password', () => {
        const initialState = buildLoginModalInitialState({});

        const action = loginModalInput(LoginModalInputTypes.USER_PASSWORD, 'haha!!11');

        const expectedState: LoginModalState = {
            userAuthState: UserAuthState.WELCOME,
            userEmail: '',
            userEmailError: null,
            userPassword: 'haha!!11',
            userPasswordRepeat: '',
            userPasswordError: null,
        };

        verifyNextState(initialState, action, expectedState);
    });

    it('should set user password repeat', () => {
        const initialState = buildLoginModalInitialState({});

        const action = loginModalInput(LoginModalInputTypes.USER_PASSWORD_REPEAT, 'lmao!rofl!');

        const expectedState: LoginModalState = {
            userAuthState: UserAuthState.WELCOME,
            userEmail: '',
            userEmailError: null,
            userPassword: '',
            userPasswordRepeat: 'lmao!rofl!',
            userPasswordError: null,
        };

        verifyNextState(initialState, action, expectedState);
    });

    it('should transition to OTP verification if passwords are matching and remove password error', () => {
        const initialState = buildLoginModalInitialState({
            userAuthState: UserAuthState.SIGNUP_PASSWORD,
            userPassword: 'passwordsMatch',
            userPasswordRepeat: 'passwordsMatch',
            userPasswordError: new Error('thisIsSoWrong'),
        });

        const action = loginModalVerifyRequest(LoginModalVerifyTypes.USER_PASSWORD);

        const expectedState: LoginModalState = {
            userAuthState: UserAuthState.SIGNUP_OTP,
            userEmail: '',
            userEmailError: null,
            userPassword: 'passwordsMatch',
            userPasswordRepeat: 'passwordsMatch',
            userPasswordError: null,
        };

        verifyNextState(initialState, action, expectedState);
    });

    it('should stay at password input if user passwords are not matching', () => {
        const initialState = buildLoginModalInitialState({
            userAuthState: UserAuthState.SIGNUP_PASSWORD,
            userPassword: 'dontMatch',
            userPasswordRepeat: 'likeForSureDontMatch',
        });

        const action = loginModalVerifyRequest(LoginModalVerifyTypes.USER_PASSWORD);

        const expectedState: LoginModalState = {
            userAuthState: UserAuthState.SIGNUP_PASSWORD,
            userEmail: '',
            userEmailError: null,
            userPassword: 'dontMatch',
            userPasswordRepeat: 'likeForSureDontMatch',
            userPasswordError: new Error(),
        };

        verifyNextState(initialState, action, expectedState);
    });
});

describe('OTP logic', () => {
    it('should move from sign up OTP to sign up OTP loading stage', () => {
        const initialState = buildLoginModalInitialState({
            userAuthState: UserAuthState.SIGNUP_OTP,
        });
        const action = loginModalButtonClick('next');

        const expectedState: LoginModalState = {
            userAuthState: UserAuthState.SIGNUP_OTP_LOADING,
            userEmail: '',
            userEmailError: null,
            userPassword: '',
            userPasswordRepeat: '',
            userPasswordError: null,
        };

        verifyNextState(initialState, action, expectedState);
    });

    it('should move from log in OTP to log in OTP loading stage', () => {
        const initialState = buildLoginModalInitialState({
            userAuthState: UserAuthState.LOGIN_OTP,
        });
        const action = loginModalButtonClick('next');

        const expectedState: LoginModalState = {
            userAuthState: UserAuthState.LOGIN_OTP_LOADING,
            userEmail: '',
            userEmailError: null,
            userPassword: '',
            userPasswordRepeat: '',
            userPasswordError: null,
        };

        verifyNextState(initialState, action, expectedState);
    });
});

describe('login logic', () => {
    it('should transition to logged in state after correct user credentials have been presented', () => {
        const initialState = buildLoginModalInitialState({
            userAuthState: UserAuthState.LOGIN,
            userEmail: 'user@mail.com',
            userPassword: 'short',
        });
        const action = loginModalVerifyRequest(LoginModalVerifyTypes.USER_EMAIL_AND_PASSWORD);

        const expectedState: LoginModalState = {
            userAuthState: UserAuthState.LOGGED_IN,
            userEmail: 'user@mail.com',
            userEmailError: null,
            userPassword: 'short',
            userPasswordRepeat: '',
            userPasswordError: null,
        };

        verifyNextState(initialState, action, expectedState);
    });

    it('should stay at login state if incorrect user credentials have been presented', () => {
        const initialState = buildLoginModalInitialState({
            userAuthState: UserAuthState.LOGIN,
            userEmail: 'another@user.com',
            userPassword: 'wrongPassword',
        });
        const action = loginModalVerifyRequest(LoginModalVerifyTypes.USER_EMAIL_AND_PASSWORD);

        const expectedState: LoginModalState = {
            userAuthState: UserAuthState.LOGIN,
            userEmail: 'another@user.com',
            userEmailError: null,
            userPassword: 'wrongPassword',
            userPasswordRepeat: '',
            userPasswordError: null,
        };

        verifyNextState(initialState, action, expectedState);
    });

    it('should transition from login to password reset state on password reset button click, keep the mail, reset the password', () => {
        const initialState = buildLoginModalInitialState({
            userAuthState: UserAuthState.LOGIN,
            userEmail: 'writeMe@mail.com',
            userPassword: 'iForgot',
        });
        const action = loginModalButtonClick('passwordReset');

        const expectedState: LoginModalState = {
            userAuthState: UserAuthState.LOGIN_PASSWORD_RESET,
            userEmail: 'writeMe@mail.com',
            userEmailError: null,
            userPassword: '',
            userPasswordRepeat: '',
            userPasswordError: null,
        };

        verifyNextState(initialState, action, expectedState);
    });
});

describe('password reset logic', () => {
    it('should transition to OTP verification from after password reset request', () => {
        const initialState = buildLoginModalInitialState({
            userAuthState: UserAuthState.LOGIN_PASSWORD_RESET,
            userEmail: 'please@reset.com',
        });
        const action = loginModalButtonClick('OTPSendSMS');

        const expectedState: LoginModalState = {
            userAuthState: UserAuthState.LOGIN_OTP,
            userEmail: 'please@reset.com',
            userEmailError: null,
            userPassword: '',
            userPasswordRepeat: '',
            userPasswordError: null,
        };

        verifyNextState(initialState, action, expectedState);
    });
});
