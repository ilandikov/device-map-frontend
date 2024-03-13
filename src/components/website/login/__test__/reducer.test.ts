import { loginModalReducer } from '../reducer';
import { UserAuthState } from '../UserAuthStateUtils';

describe('LoginModal reducer tests', () => {
    it('should return initial state', () => {
        const initialState = loginModalReducer(undefined, { type: 'DUMMY_ACTION' });

        expect(initialState).toEqual({
            userAuthState: UserAuthState.WELCOME,
        });
    });
});
