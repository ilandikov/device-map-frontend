import React from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { StaticImage } from 'gatsby-plugin-image';

enum UserAuthState {
    WELCOME,
    MAIL_INPUT_START,
    MAIL_ALREADY_EXISTS,
    MAIL_NOT_VALID,
    PASSWORD_INPUT,
}

export function LoginModal() {
    const { t } = useI18next();
    const [userAuthState, setUserState] = React.useState(UserAuthState.WELCOME);
    const [userEmail, setUserEmail] = React.useState('');
    const [userPasswordA, setUserPasswordA] = React.useState('');
    const [userPasswordB, setUserPasswordB] = React.useState('');

    function nextUserState() {
        setUserState(userAuthState + 1);
    }

    function isValidEmail(email: string) {
        const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegexp.test(email);
    }

    function tryRegisterUserEmail() {
        if (userEmail === 'already@exists.com') {
            setUserState(UserAuthState.MAIL_ALREADY_EXISTS);
            return;
        }

        if (!isValidEmail(userEmail)) {
            setUserState(UserAuthState.MAIL_NOT_VALID);
            return;
        }

        setUserState(UserAuthState.PASSWORD_INPUT);
    }

    return (
        <div className="login-modal-container">
            <div className="login-modal">
                {userAuthState === UserAuthState.WELCOME && <Ellipses />}
                <div className="login-modal-content-container">
                    <div className="login-modal-top-container">
                        <StaticImage
                            className="login-modal-logo"
                            src="../../../assets/images/LogoGreen.svg"
                            alt="logo"
                        />
                        {userAuthState === UserAuthState.WELCOME && (
                            <>
                                <p className="login-modal-header">
                                    {t('brand')} {t('map')}
                                </p>
                                <p className="login-modal-description">{t('loginCallToAction')}</p>
                            </>
                        )}
                        {(userAuthState === UserAuthState.MAIL_INPUT_START ||
                            userAuthState === UserAuthState.MAIL_ALREADY_EXISTS) && (
                            <>
                                <p className="login-modal-header">{t('register')}</p>
                                <p className="login-modal-description login-modal-opaque-text">
                                    {t('finikMapProductDescription')}
                                </p>
                                <div className="login-modal-input-outer-container">
                                    <p className="login-modal-input-help">{t('onlyEmail')}</p>
                                    <div className="login-modal-input-inner-container">
                                        <StaticImage
                                            className="login-modal-input-envelope-image"
                                            src="../../../assets/images/Envelope.svg"
                                            alt="input-email"
                                        />
                                        <input
                                            className="login-modal-input-text"
                                            type="email"
                                            onChange={(event) => setUserEmail(event.target.value)}
                                        />
                                    </div>
                                    {userAuthState === UserAuthState.MAIL_ALREADY_EXISTS && (
                                        <p className="login-modal-input-bad-email">{t('mailAlreadyExists')}</p>
                                    )}
                                </div>
                            </>
                        )}
                        {userAuthState === UserAuthState.PASSWORD_INPUT && (
                            <>
                                <p className="login-modal-header">{t('register')}</p>
                                <p className="login-modal-description login-modal-opaque-text">
                                    {t('finikMapProductDescription')}
                                </p>
                                <div className="login-modal-input-outer-container">
                                    <p className="login-modal-input-help">{t('enterPassword')}</p>
                                    <div className="login-modal-input-inner-container">
                                        <input className="login-modal-input-text" type="password" />
                                    </div>
                                    <p className="login-modal-input-help">{t('repeatPassword')}</p>
                                    <div className="login-modal-input-inner-container">
                                        <input className="login-modal-input-text" type="password" />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="login-modal-bottom-container">
                        {userAuthState === UserAuthState.WELCOME && (
                            <>
                                <input
                                    className="login-modal-button-black-on-green"
                                    type="button"
                                    value={t('accountLogin')}
                                />
                                <input
                                    className="login-modal-button-green-on-black"
                                    type="button"
                                    value={t('accountRegister')}
                                    onClick={() => {
                                        nextUserState();
                                    }}
                                />
                            </>
                        )}
                        {(userAuthState === UserAuthState.MAIL_INPUT_START ||
                            userAuthState === UserAuthState.MAIL_ALREADY_EXISTS) && (
                            <>
                                {userAuthState === UserAuthState.MAIL_ALREADY_EXISTS && (
                                    <input
                                        className="login-modal-button-green-on-black"
                                        type="button"
                                        value={t('accountLogin')}
                                    />
                                )}
                                <input
                                    className="login-modal-button-black-on-green"
                                    type="button"
                                    value={t('next')}
                                    onClick={() => {
                                        tryRegisterUserEmail();
                                    }}
                                />
                            </>
                        )}
                        {userAuthState === UserAuthState.PASSWORD_INPUT && (
                            <>
                                <input className="login-modal-button-black-on-green" type="button" value={t('next')} />
                            </>
                        )}
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
