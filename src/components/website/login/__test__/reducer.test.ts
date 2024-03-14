import { LoginModalState, loginModalReducer } from '../reducer';
import { UserAuthState } from '../UserAuthStateUtils';
import { LoginModalActionTypes, LoginModalUserEmailInput, loginModalButtonClick } from '../actions';

function buildLoginModalInitialState({
    userAuthState,
    userEmail,
}: {
    userAuthState?: UserAuthState;
    userEmail?: string;
}): LoginModalState {
    return { userAuthState: userAuthState ?? UserAuthState.WELCOME, userEmail: userEmail ?? '' };
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
            const nextState = loginModalReducer(
                buildLoginModalInitialState({ userAuthState: initialUserAuthState }),
                loginModalButtonClick('cancel'),
            );

            expect(nextState).toEqual({
                userAuthState: UserAuthState.WELCOME,
                userEmail: '',
            });
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
        const nextState = loginModalReducer(
            buildLoginModalInitialState({ userAuthState: initialUserAuthState }),
            loginModalButtonClick('goBack'),
        );

        expect(nextState).toEqual({
            userAuthState: expectedUserAuthState,
            userEmail: '',
        });
    });

    it('should update user email', () => {
        const action: LoginModalUserEmailInput = {
            type: LoginModalActionTypes.USER_EMAIL_INPUT,
            userEmail: 'myMail@myServer.xyz',
        };

        const nextState = loginModalReducer(
            buildLoginModalInitialState({ userAuthState: UserAuthState.MAIL_INPUT }),
            action,
        );

        expect(nextState).toEqual({
            userAuthState: UserAuthState.MAIL_INPUT,
            userEmail: 'myMail@myServer.xyz',
        });
    });
});
