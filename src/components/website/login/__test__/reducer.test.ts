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
});
