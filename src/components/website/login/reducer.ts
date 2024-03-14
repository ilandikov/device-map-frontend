import { UserAuthState, getPasswordInputErrorAndNextState, getUserEmailErrorAndNextState } from './UserAuthStateUtils';
import { LoginModalAction, LoginModalActionTypes, LoginModalInputTypes, LoginModalVerifyTypes } from './actions';

export interface LoginModalState {
    userAuthState: UserAuthState;
    userEmail: string;
    // TODO make userEmailError optional
    userEmailError: Error | null;
    userPassword: string;
    userPasswordRepeat: string;
    // TODO make userPasswordError optional
    userPasswordError: Error | null;
}

const loginModalInitialState: LoginModalState = {
    userAuthState: UserAuthState.WELCOME,
    userEmail: '',
    userEmailError: null,
    userPassword: '',
    userPasswordRepeat: '',
    userPasswordError: null,
};

export function loginModalReducer(state: LoginModalState = loginModalInitialState, action: LoginModalAction) {
    switch (action.type) {
        case LoginModalActionTypes.INPUT: {
            switch (action.input.type) {
                case LoginModalInputTypes.USER_EMAIL:
                    return { ...state, userEmail: action.input.payload };
                case LoginModalInputTypes.USER_PASSWORD:
                    return { ...state, userPassword: action.input.payload };
                case LoginModalInputTypes.USER_PASSWORD_REPEAT:
                    return { ...state, userPasswordRepeat: action.input.payload };
                default:
                    return state;
            }
        }
        case LoginModalActionTypes.VERIFY_REQUEST: {
            switch (action.verify) {
                case LoginModalVerifyTypes.USER_EMAIL: {
                    // TODO move or inline getUserEmailErrorAndNextState() to this file
                    const { mailInputError, nextUserAuthState } = getUserEmailErrorAndNextState(state.userEmail);
                    return { ...state, userAuthState: nextUserAuthState, userEmailError: mailInputError };
                }
                case LoginModalVerifyTypes.USER_PASSWORD: {
                    // TODO move or inline getPasswordInputErrorAndNextState() to this file
                    const { passwordInputError, nextUserAuthState } = getPasswordInputErrorAndNextState(
                        state.userPassword,
                        state.userPasswordRepeat,
                    );
                    return { ...state, userAuthState: nextUserAuthState, userPasswordError: passwordInputError };
                }
                default:
                    return state;
            }
        }
        case LoginModalActionTypes.BUTTON_CLICKED:
            switch (action.button) {
                case 'accountRegister':
                    return { ...state, userAuthState: UserAuthState.MAIL_INPUT };
                case 'accountLogin':
                    return { ...state, userAuthState: UserAuthState.LOGIN, userEmailError: null };
                case 'cancel':
                    return { ...state, userAuthState: UserAuthState.WELCOME };
                case 'passwordReset':
                    return { ...state, userAuthState: UserAuthState.LOGIN_PASSWORD_RESET, userPassword: '' };
                case 'next':
                    switch (state.userAuthState) {
                        case UserAuthState.SIGNUP_OTP:
                            return { ...state, userAuthState: UserAuthState.SIGNUP_OTP_LOADING };
                        case UserAuthState.LOGIN_OTP:
                            return { ...state, userAuthState: UserAuthState.LOGIN_OTP_LOADING };
                        default:
                            return state;
                    }
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
