import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';

import LogoGreen from '/src/assets/images/LogoGreen.svg';
import Account from '/src/assets/images/Account.svg';
import GooglePlay from '/src/assets/images/GooglePlay.svg';
import AppStore from '/src/assets/images/AppStore.svg';

export function LoginHeader() {
    const { t } = useI18next();
    return (
        <header className="login-container login-header">
            <div className="login-header-block">
                <img className="login-header-brand-logo" src={LogoGreen} alt="logo" />
                <p className="login-header-brand-text">{t('map')}</p>
            </div>
            <div className="login-header-block">
                <div className="login-header-inner-block">
                    <img className="login-header-account-image" src={Account} alt="login-header-account" />
                    <p className="login-header-account-text">{t('login')}</p>
                </div>
                <div className="login-header-inner-block">
                    <img
                        className="login-header-apps-google-play"
                        src={GooglePlay}
                        alt="login-header-apps-google-play"
                    />
                    <img className="login-header-apps-app-store" src={AppStore} alt="login-header-apps-app-store" />
                </div>
            </div>
        </header>
    );
}
