import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import LogoGreen from '/src/assets/images/LogoGreen.svg';
import { AuthenticationStep, useAuthentication } from './redux/state';

export function LoginModalHeader() {
    const authenticationStep = useAuthentication().step;

    const { header, description, opaqueDescription } = getHeaderDetails(authenticationStep);

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

function getHeaderDetails(authenticationStep: AuthenticationStep) {
    const { t } = useI18next();

    switch (authenticationStep) {
        case AuthenticationStep.MAIL_INPUT:
        case AuthenticationStep.SIGNUP_OTP:
        case AuthenticationStep.SIGNUP_OTP_LOADING:
        case AuthenticationStep.SIGNUP_PASSWORD:
            return {
                header: t('signUp'),
                description: t('finikMapProductDescription'),
                opaqueDescription: true,
            };
        case AuthenticationStep.LOGIN:
        case AuthenticationStep.LOGIN_OTP:
        case AuthenticationStep.LOGIN_OTP_LOADING:
            return {
                header: t('logIn'),
                description: t('finikMapProductDescription'),
                opaqueDescription: true,
            };
        case AuthenticationStep.LOGIN_PASSWORD_RESET:
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
