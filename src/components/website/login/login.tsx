/* External dependencies */
import React from 'react';
import { StaticImage } from 'gatsby-plugin-image';

/* Local dependencies */
import './login.css';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { LoginHeader } from './LoginHeader';

export default function Login() {
    return (
        <div className="login-container login-background">
            <LoginHeader />
            <LoginWindow />
        </div>
    );
}

export function LoginWindow() {
    return (
        <div className="login-window-container">
            <div className="login-window">
                <Ellipses />
                <div className="login-window-content-container">
                    <LoginWelcome />
                </div>
            </div>
        </div>
    );
}

function Ellipses() {
    return (
        <div className="login-ellipses-container">
            <div className="login-ellipse-left-container">
                <div className="login-ellipse login-ellipse-green"></div>
            </div>
            <div className="login-ellipse-right-container">
                <div className="login-ellipse login-ellipse-blue"></div>
            </div>
        </div>
    );
}

function LoginWelcome() {
    const { t } = useI18next();
    return (
        <>
            <div className="login-window-top-container">
                <StaticImage className="login-window-logo" src="../../../assets/images/LogoGreen.svg" alt="logo" />
                <p className="login-window-brand">
                    {t('brand')} {t('map')}
                </p>
                <p className="login-window-description">{t('loginCallToAction')}</p>
            </div>
            <div className="login-window-bottom-container">
                <div className="login-window-button login-window-button-sign-in">
                    <p>{t('accountLogin')}</p>
                </div>
                <div className="login-window-button login-window-button-register">
                    <p>{t('accountRegister')}</p>
                </div>
            </div>
        </>
    );
}
