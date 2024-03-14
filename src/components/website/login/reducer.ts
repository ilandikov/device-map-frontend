import { UserAuthState, getPasswordInputErrorAndNextState, getUserEmailErrorAndNextState } from './UserAuthStateUtils';
import { LoginModalAction, LoginModalActionTypes, LoginModalVerifyTypes } from './actions';

export interface LoginModalState {
    userAuthState: UserAuthState;
    userEmail: string;
    // TODO make userEmailError optional
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
            return { ...state, userEmail: action.input.payload };
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
                    const { nextUserAuthState } = getPasswordInputErrorAndNextState(
                        state.userPassword,
                        state.userPasswordRepeat,
                    );
                    return { ...state, userAuthState: nextUserAuthState };
                }
            }
            return state;
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
