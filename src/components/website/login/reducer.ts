import { UserAuthState, getUserEmailErrorAndNextState } from './UserAuthStateUtils';
import { LoginModalAction, LoginModalActionTypes } from './actions';

export interface LoginModalState {
    userAuthState: UserAuthState;
    userEmail: string;
    userEmailError: Error | null;
    userPassword: string;
    userPasswordRepeat: string;
}

const loginModalInitialState: LoginModalState = {
    userAuthState: UserAuthState.WELCOME,
    userEmail: '',
    userEmailError: null,
    userPassword: '',
    userPasswordRepeat: '',
};

export function loginModalReducer(state: LoginModalState = loginModalInitialState, action: LoginModalAction) {
    switch (action.type) {
        case LoginModalActionTypes.USER_EMAIL_INPUT: {
            return { ...state, userEmail: action.userEmail };
        }
        case LoginModalActionTypes.REQUEST_VERIFY_USER_EMAIL: {
            // TODO move or inline getUserEmailErrorAndNextState() to this file
            const { mailInputError, nextUserAuthState } = getUserEmailErrorAndNextState(state.userEmail);
            return { ...state, userAuthState: nextUserAuthState, userEmailError: mailInputError };
        }
        case LoginModalActionTypes.USER_PASSWORD_INPUT: {
            return { ...state, userPassword: action.userPassword };
        }
        case LoginModalActionTypes.USER_PASSWORD_REPEAT_INPUT: {
            return { ...state, userPasswordRepeat: action.userPasswordRepeat };
        }
        case LoginModalActionTypes.BUTTON_CLICKED:
            switch (action.button) {
                case 'accountRegister':
                    return { ...state, userAuthState: UserAuthState.MAIL_INPUT };
                case 'accountLogin':
                    return { ...state, userAuthState: UserAuthState.LOGIN, userEmailError: null };
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
