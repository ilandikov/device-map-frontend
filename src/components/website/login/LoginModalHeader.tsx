import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import LogoGreen from '/src/assets/images/LogoGreen.svg';
import { UserAuthState } from './redux/state';

export enum LoginModalHeaderState {
    WELCOME = 'WELCOME',
    SIGNUP = 'SIGNUP',
    LOGIN = 'LOGIN',
    NEW_PASSWORD = 'NEW_PASSWORD',
}

function getHeaderState(userAuthState: UserAuthState): LoginModalHeaderState {
    switch (userAuthState) {
        case UserAuthState.MAIL_INPUT:
        case UserAuthState.SIGNUP_OTP:
        case UserAuthState.SIGNUP_OTP_LOADING:
        case UserAuthState.SIGNUP_PASSWORD:
            return LoginModalHeaderState.SIGNUP;
        case UserAuthState.LOGIN:
        case UserAuthState.LOGIN_OTP:
        case UserAuthState.LOGIN_OTP_LOADING:
            return LoginModalHeaderState.LOGIN;
        case UserAuthState.LOGIN_PASSWORD_RESET:
            return LoginModalHeaderState.NEW_PASSWORD;
    }

    return LoginModalHeaderState.WELCOME;
}

function newGetHeaderDetails(userAuthState: UserAuthState) {
    const loginModalHeaderState = getHeaderState(userAuthState);
    return getHeaderDetails(loginModalHeaderState);
}

export function LoginModalHeader(props: { state: LoginModalHeaderState; userAuthState: UserAuthState }) {
    const { header, description, opaqueDescription } = newGetHeaderDetails(props.userAuthState);

    return (
        <div className="login-modal-header-container">
            <img className="login-modal-logo" src={LogoGreen} alt="login-modal-logo" />
            <p className="login-modal-header">{header}</p>
            <p className={`login-modal-header-description${opaqueDescription ? ' login-modal-opaque-text' : ''}`}>
                {description}
            </p>
        </div>
    );
}

function getHeaderDetails(state: LoginModalHeaderState) {
    const { t } = useI18next();

    switch (state) {
        case LoginModalHeaderState.SIGNUP:
            return {
                header: t('signUp'),
                description: t('finikMapProductDescription'),
                opaqueDescription: true,
            };
        case LoginModalHeaderState.LOGIN:
            return {
                header: t('logIn'),
                description: t('finikMapProductDescription'),
                opaqueDescription: true,
            };
        case LoginModalHeaderState.NEW_PASSWORD:
            return {
                header: t('newPassword'),
                description: t('finikMapProductDescription'),
                opaqueDescription: true,
            };
    }

    const header = `${t('brand')} ${t('map')}`;
    const description = t('loginCallToAction');
    const opaqueDescription = false;

    return { header, description, opaqueDescription };
}
