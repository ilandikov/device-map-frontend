import { UserAuthState } from './UserAuthStateUtils';
import { LoginModalAction, LoginModalActionTypes } from './actions';

export interface LoginModalState {
    userAuthState: UserAuthState;
    userEmail: string;
}

const loginModalInitialState: LoginModalState = {
    userAuthState: UserAuthState.WELCOME,
    userEmail: '',
};

export function loginModalReducer(state: LoginModalState = loginModalInitialState, action: LoginModalAction) {
    switch (action.type) {
        case LoginModalActionTypes.BUTTON_CLICKED:
            switch (action.button) {
                case 'accountRegister':
                    return { ...state, userAuthState: UserAuthState.MAIL_INPUT };
                case 'accountLogin':
                    return { ...state, userAuthState: UserAuthState.LOGIN };
                case 'cancel':
                    return { ...state, userAuthState: UserAuthState.WELCOME };
                case 'goBack':
                    switch (state.userAuthState) {
                        case UserAuthState.MAIL_INPUT:
                            return { ...state, userAuthState: UserAuthState.WELCOME };
                        case UserAuthState.SIGNUP_PASSWORD:
                        case UserAuthState.LOGIN:
                            return { ...state, userAuthState: UserAuthState.MAIL_INPUT };
                        case UserAuthState.LOGIN_PASSWORD_RESET:
                            return { ...state, userAuthState: UserAuthState.LOGIN };
                    }
            }
    }
    return state;
}
