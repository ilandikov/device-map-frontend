import { LoginModalState, loginModalReducer } from '../reducer';
import { MailInputError, UserAuthState } from '../UserAuthStateUtils';
import {
    LoginModalAction,
    LoginModalActionTypes,
    LoginModalRequestVerifyUserEmail,
    LoginModalUserEmailInput,
    loginModalButtonClick,
} from '../actions';

function buildLoginModalInitialState({
    userAuthState,
    userEmail,
    userEmailError,
    userPassword,
    userPasswordRepeat,
}: {
    userAuthState?: UserAuthState;
    userEmail?: string;
    userEmailError?: Error;
    userPassword?: string;
    userPasswordRepeat?: string;
}): LoginModalState {
    return {
        userAuthState: userAuthState ?? UserAuthState.WELCOME,
        userEmail: userEmail ?? '',
        userEmailError: userEmailError ?? null,
        userPassword: userPassword ?? '',
        userPasswordRepeat: userPasswordRepeat ?? '',
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
        });
    });

    it('should transition to email input', () => {
        const nextState = loginModalReducer(undefined, loginModalButtonClick('accountRegister'));

        expect(nextState).toEqual({
            userAuthState: UserAuthState.MAIL_INPUT,
            userEmail: '',
            userEmailError: null,
            userPassword: '',
            userPasswordRepeat: '',
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
        });
    });

    it.each(Object.keys(UserAuthState))(
        'nav cancel button: should transition back to welcome from %s state',
        (initialUserAuthState: UserAuthState) => {
            const initialState = buildLoginModalInitialState({ userAuthState: initialUserAuthState });
            const action = loginModalButtonClick('cancel');

            const expectedState: LoginModalState = {
                userAuthState: UserAuthState.WELCOME,
                userEmail: '',
                userEmailError: null,
                userPassword: '',
                userPasswordRepeat: '',
            };

            verifyNextState(initialState, action, expectedState);
        },
    );

    it.each([
        // From mail input to welcome
        [UserAuthState.MAIL_INPUT, UserAuthState.WELCOME],

        // From password input to mail input
        [UserAuthState.LOGIN, UserAuthState.MAIL_INPUT],

        // From password reset to login
        [UserAuthState.LOGIN_PASSWORD_RESET, UserAuthState.LOGIN],

        // From password creation to mail input
        [UserAuthState.SIGNUP_PASSWORD, UserAuthState.MAIL_INPUT],
    ])('nav go back button: should transition from %s to %s', (initialUserAuthState, expectedUserAuthState) => {
        const initialState = buildLoginModalInitialState({ userAuthState: initialUserAuthState });
        const action = loginModalButtonClick('goBack');

        const expectedState: LoginModalState = {
            userAuthState: expectedUserAuthState,
            userEmail: '',
            userEmailError: null,
            userPassword: '',
            userPasswordRepeat: '',
        };

        verifyNextState(initialState, action, expectedState);
    });

    it('should update user email', () => {
        const initialState = buildLoginModalInitialState({ userAuthState: UserAuthState.MAIL_INPUT });
        const action: LoginModalUserEmailInput = {
            type: LoginModalActionTypes.USER_EMAIL_INPUT,
            userEmail: 'myMail@myServer.xyz',
        };

        const expectedState: LoginModalState = {
            userAuthState: UserAuthState.MAIL_INPUT,
            userEmail: 'myMail@myServer.xyz',
            userEmailError: null,
            userPassword: '',
            userPasswordRepeat: '',
        };

        verifyNextState(initialState, action, expectedState);
    });

    it('should remove mail error and transition to password creation after good mail has been sent to verification', () => {
        const initialState = buildLoginModalInitialState({
            userAuthState: UserAuthState.MAIL_INPUT,
            userEmail: 'good@email.com',
            userEmailError: new Error('omgSomethingIsWrong'),
        });
        const action: LoginModalRequestVerifyUserEmail = {
            type: LoginModalActionTypes.REQUEST_VERIFY_USER_EMAIL,
        };

        const expectedState: LoginModalState = {
            userAuthState: UserAuthState.SIGNUP_PASSWORD,
            userEmail: 'good@email.com',
            userEmailError: null,
            userPassword: '',
            userPasswordRepeat: '',
        };

        verifyNextState(initialState, action, expectedState);
    });

    it('should set mail error and stay at mail input when bad mail has been sent to verification', () => {
        const initialState = buildLoginModalInitialState({
            userAuthState: UserAuthState.MAIL_INPUT,
            userEmail: 'this is not an email!',
        });
        const action: LoginModalRequestVerifyUserEmail = {
            type: LoginModalActionTypes.REQUEST_VERIFY_USER_EMAIL,
        };

        const expectedState: LoginModalState = {
            userAuthState: UserAuthState.MAIL_INPUT,
            userEmail: 'this is not an email!',
            userEmailError: new Error(MailInputError.NOT_VALID),
            userPassword: '',
            userPasswordRepeat: '',
        };

        verifyNextState(initialState, action, expectedState);
    });

    it('should set mail error and stay at mail input when already existing mail has been sent to verification', () => {
        const initialState = buildLoginModalInitialState({
            userAuthState: UserAuthState.MAIL_INPUT,
            userEmail: 'already@exists.com',
        });
        const action: LoginModalRequestVerifyUserEmail = {
            type: LoginModalActionTypes.REQUEST_VERIFY_USER_EMAIL,
        };

        const expectedState: LoginModalState = {
            userAuthState: UserAuthState.MAIL_INPUT,
            userEmail: 'already@exists.com',
            userEmailError: new Error(MailInputError.ALREADY_EXISTS),
            userPassword: '',
            userPasswordRepeat: '',
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
        };

        verifyNextState(initialState, action, expectedState);
    });
});
