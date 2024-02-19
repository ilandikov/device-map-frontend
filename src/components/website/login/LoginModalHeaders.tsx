import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import LogoGreen from '*.svg';

export enum LoginModalHeaderState {
    WELCOME = 'WELCOME',
    SIGNUP = 'SIGNUP',
    LOGIN = 'LOGIN',
    NEW_PASSWORD = 'NEW_PASSWORD',
}

export function WelcomeHeader(props: { state: LoginModalHeaderState }) {
    function getHeaderDetails() {
        const { t } = useI18next();

        if (props.state === LoginModalHeaderState.SIGNUP) {
            return {
                header: t('signUp'),
                description: t('finikMapProductDescription'),
                opaqueDescription: true,
            };
        }

        if (props.state === LoginModalHeaderState.LOGIN) {
            return {
                header: t('logIn'),
                description: t('finikMapProductDescription'),
                opaqueDescription: true,
            };
        }

        if (props.state === LoginModalHeaderState.NEW_PASSWORD) {
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

    const { header, description, opaqueDescription } = getHeaderDetails();

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
