export enum UserAuthState {
    WELCOME = 'WELCOME',
    MAIL_INPUT = 'MAIL_INPUT',
    SIGNUP_PASSWORD = 'SIGNUP_PASSWORD',
    SIGNUP_OTP = 'SIGNUP_OTP',
    SIGNUP_OTP_LOADING = 'SIGNUP_OTP_LOADING',
    LOGIN = 'LOGIN',
    LOGIN_PASSWORD_RESET = 'LOGIN_PASSWORD_RESET',
    LOGIN_OTP = 'LOGIN_OTP',
    LOGIN_OTP_LOADING = 'LOGIN_OTP_LOADING',
    LOGGED_IN = 'LOGGED_IN',
}

export const loginModalInitialState: LoginModalState = {
    userAuthState: UserAuthState.WELCOME,
    userEmail: '',
    userEmailError: null,
    userPassword: '',
    userPasswordRepeat: '',
    userPasswordError: null,
};

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

export enum MailInputError {
    NOT_VALID = 'mailNotValid',
    ALREADY_EXISTS = 'mailAlreadyExists',
}
