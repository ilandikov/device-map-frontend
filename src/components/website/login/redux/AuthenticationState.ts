import { useSelector } from 'react-redux';
import { RootState, StateBuilder } from '../../../../redux/store';

export function useLoginModalAuthentication(): AuthenticationState {
    return useSelector((state: RootState) => state).authentication;
}

export enum AuthenticationStep {
    WELCOME = 'WELCOME',
    MAIL_INPUT = 'MAIL_INPUT',
    PASSWORD_CREATION = 'PASSWORD_CREATION',
    PASSWORD_CREATION_LOADING = 'PASSWORD_CREATION_LOADING',
    PASSWORD_CREATION_OTP = 'PASSWORD_CREATION_OTP',
    PASSWORD_CREATION_OTP_LOADING = 'PASSWORD_CREATION_OTP_LOADING',
    PASSWORD_CREATION_OTP_RESEND_LOADING = 'PASSWORD_CREATION_OTP_RESEND_LOADING',
    LOGIN = 'LOGIN',
    LOGIN_LOADING = 'LOGIN_LOADING',
    PASSWORD_RESET_REQUEST = 'PASSWORD_RESET_REQUEST',
    PASSWORD_RESET_REQUEST_LOADING = 'PASSWORD_RESET_REQUEST_LOADING',
    PASSWORD_RESET = 'PASSWORD_RESET',
    PASSWORD_RESET_OTP = 'PASSWORD_RESET_OTP',
    PASSWORD_RESET_LOADING = 'PASSWORD_RESET_LOADING',
    LOGGED_IN = 'LOGGED_IN',
}

export interface AuthenticationState {
    step: AuthenticationStep;
    email: string;
    error: Error | null;
    password: string;
    passwordRepeat: string;
    OTP: string;
}

export const buildAuthenticationState: StateBuilder<AuthenticationState> = (partialState) => ({
    step: AuthenticationStep.WELCOME,
    email: '',
    error: null,
    password: '',
    passwordRepeat: '',
    OTP: '',
    ...partialState,
});
