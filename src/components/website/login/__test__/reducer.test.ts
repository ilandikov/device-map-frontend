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
});
