import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import LogoGreen from '/src/assets/images/LogoGreen.svg';
import { AuthenticationStep, useLoginModalAuthentication } from './redux/LoginModalAuthenticationState';

export function LoginModalHeader() {
    const { step: authenticationStep } = useLoginModalAuthentication();

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
        case AuthenticationStep.PASSWORD_CREATION_OTP:
        case AuthenticationStep.PASSWORD_CREATION_OTP_LOADING:
        case AuthenticationStep.PASSWORD_CREATION:
            return {
                header: t('signUp'),
                description: t('finikMapProductDescription'),
                opaqueDescription: true,
            };
        case AuthenticationStep.LOGIN:
        case AuthenticationStep.LOGIN_LOADING:
            return {
                header: t('logIn'),
                description: t('finikMapProductDescription'),
                opaqueDescription: true,
            };
        case AuthenticationStep.PASSWORD_RESET_REQUEST:
        case AuthenticationStep.PASSWORD_RESET_OTP:
        case AuthenticationStep.PASSWORD_RESET:
        case AuthenticationStep.PASSWORD_RESET_LOADING:
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
