import React from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { StaticImage } from 'gatsby-plugin-image';

export function LoginModal() {
    const { t } = useI18next();
    return (
        <div className="login-modal-container">
            <div className="login-modal">
                <Ellipses />
                <div className="login-modal-content-container">
                    <div className="login-modal-top-container">
                        <StaticImage
                            className="login-modal-logo"
                            src="../../../assets/images/LogoGreen.svg"
                            alt="logo"
                        />
                        <p className="login-modal-brand">
                            {t('brand')} {t('map')}
                        </p>
                        <p className="login-modal-description">{t('loginCallToAction')}</p>
                    </div>
                    <div className="login-modal-bottom-container">
                        <div className="login-modal-button login-modal-button-sign-in">
                            <p>{t('accountLogin')}</p>
                        </div>
                        <div className="login-modal-button login-modal-button-register">
                            <p>{t('accountRegister')}</p>
                        </div>
                    </div>
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
