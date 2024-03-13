import { UserAuthState } from './UserAuthStateUtils';
import { LoginModalAction, LoginModalActionTypes } from './actions';

export interface LoginModalState {
    userAuthState: UserAuthState;
}

const loginModalInitialState: LoginModalState = {
    userAuthState: UserAuthState.WELCOME,
};

export function loginModalReducer(state: LoginModalState = loginModalInitialState, action: LoginModalAction) {
    switch (action.type) {
        case LoginModalActionTypes.BUTTON_CLICKED:
            switch (action.button) {
                case 'accountRegister':
                    return { ...state, userAuthState: UserAuthState.MAIL_INPUT };
            }
    }
    return state;
}
