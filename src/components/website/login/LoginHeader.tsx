import { useI18next } from 'gatsby-plugin-react-i18next';
import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

export function LoginHeader() {
    const { t } = useI18next();
    return (
        <header className="login-container login-header">
            <div className="login-header-block">
                <StaticImage
                    className="login-header-brand-logo"
                    src="../../../assets/images/LogoGreen.svg"
                    alt="logo"
                />
                <p className="login-header-brand-text">{t('map')}</p>
            </div>
            <div className="login-header-block">
                <div className="login-header-inner-block">
                    <StaticImage
                        className="login-header-account-image"
                        src="../../../assets/images/Account.svg"
                        alt="login-header-account"
                    />
                    <p className="login-header-account-text">{t('login')}</p>
                </div>
                <div className="login-header-inner-block">
                    <StaticImage
                        className="login-header-apps-google-play"
                        src="../../../assets/images/GooglePlay.svg"
                        alt="login-header-apps-google-play"
                    />
                    <StaticImage
                        className="login-header-apps-app-store"
                        src="../../../assets/images/AppStore.svg"
                        alt="login-header-apps-app-store"
                    />
                </div>
            </div>
        </header>
    );
}
