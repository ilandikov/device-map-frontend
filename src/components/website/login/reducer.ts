import { UserAuthState } from './UserAuthStateUtils';

interface LoginModalState {
    userAuthState: UserAuthState;
}

const loginModalInitialState: LoginModalState = {
    userAuthState: UserAuthState.WELCOME,
};

export function loginModalReducer(state: LoginModalState = loginModalInitialState, action: { type: string }) {
    return state;
}
