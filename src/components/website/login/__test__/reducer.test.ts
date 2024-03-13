import { loginModalReducer } from '../reducer';
import { UserAuthState } from '../UserAuthStateUtils';
import { loginModalButtonClick } from '../actions';

describe('LoginModal reducer tests', () => {
    it('should return initial state', () => {
        const initialState = loginModalReducer(undefined, { type: 'DUMMY_ACTION' });

        expect(initialState).toEqual({
            userAuthState: UserAuthState.WELCOME,
        });
    });

    it('should transition to email input', () => {
        const nextState = loginModalReducer(undefined, loginModalButtonClick('accountRegister'));

        expect(nextState).toEqual({
            userAuthState: UserAuthState.MAIL_INPUT,
        });
    });

    it('should transition to user login', () => {
        const nextState = loginModalReducer(undefined, loginModalButtonClick('accountLogin'));

        expect(nextState).toEqual({
            userAuthState: UserAuthState.LOGIN,
        });
    });

    it.each(Object.keys(UserAuthState))(
        'nav cancel button: should transition back to welcome from %s state',
        (userAuthState: UserAuthState) => {
            const nextState = loginModalReducer({ userAuthState }, loginModalButtonClick('cancel'));

            expect(nextState).toEqual({
                userAuthState: UserAuthState.WELCOME,
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
    ])('nav go back button: should transition from %s to %s', (initialState, expectedState) => {
        const nextState = loginModalReducer({ userAuthState: initialState }, loginModalButtonClick('goBack'));

        expect(nextState).toEqual({
            userAuthState: expectedState,
        });
    });
});
