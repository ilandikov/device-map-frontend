import { LoginModalState, loginModalReducer } from '../reducer';
import { UserAuthState } from '../UserAuthStateUtils';
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
}: {
    userAuthState?: UserAuthState;
    userEmail?: string;
}): LoginModalState {
    return { userAuthState: userAuthState ?? UserAuthState.WELCOME, userEmail: userEmail ?? '' };
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
        });
    });

    it('should transition to email input', () => {
        const nextState = loginModalReducer(undefined, loginModalButtonClick('accountRegister'));

        expect(nextState).toEqual({
            userAuthState: UserAuthState.MAIL_INPUT,
            userEmail: '',
        });
    });

    it('should transition to user login', () => {
        const nextState = loginModalReducer(undefined, loginModalButtonClick('accountLogin'));

        expect(nextState).toEqual({
            userAuthState: UserAuthState.LOGIN,
            userEmail: '',
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
        };

        verifyNextState(initialState, action, expectedState);
    });

    it('should remove mail error and transition to password creation after good mail has been sent to verification', () => {
        const initialState = buildLoginModalInitialState({
            userAuthState: UserAuthState.MAIL_INPUT,
            userEmail: 'good@email.com',
        });
        const action: LoginModalRequestVerifyUserEmail = {
            type: LoginModalActionTypes.REQUEST_VERIFY_USER_EMAIL,
        };

        const expectedState: LoginModalState = {
            userAuthState: UserAuthState.SIGNUP_PASSWORD,
            userEmail: 'good@email.com',
        };

        verifyNextState(initialState, action, expectedState);
    });
});
