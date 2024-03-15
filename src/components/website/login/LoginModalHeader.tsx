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

export function LoginModalHeader(props: { state: LoginModalHeaderState; userAuthState: UserAuthState }) {
    const loginModalHeaderState = props.state;
    const { header, description, opaqueDescription } = getHeaderDetails(loginModalHeaderState);

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

    if (state === LoginModalHeaderState.SIGNUP) {
        return {
            header: t('signUp'),
            description: t('finikMapProductDescription'),
            opaqueDescription: true,
        };
    }

    if (state === LoginModalHeaderState.LOGIN) {
        return {
            header: t('logIn'),
            description: t('finikMapProductDescription'),
            opaqueDescription: true,
        };
    }

    if (state === LoginModalHeaderState.NEW_PASSWORD) {
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
