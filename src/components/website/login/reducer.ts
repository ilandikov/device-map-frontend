import { UserAuthState } from './UserAuthStateUtils';
import { LoginModalAction } from './actions';

export interface LoginModalState {
    userAuthState: UserAuthState;
}

const loginModalInitialState: LoginModalState = {
    userAuthState: UserAuthState.WELCOME,
};

export function loginModalReducer(state: LoginModalState = loginModalInitialState, action: LoginModalAction) {
    return state;
}
