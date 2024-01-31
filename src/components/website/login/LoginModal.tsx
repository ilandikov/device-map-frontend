import React from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { StaticImage } from 'gatsby-plugin-image';

enum UserAuthState {
    WELCOME,
    MAIL_INPUT_START,
}

export function LoginModal() {
    const { t } = useI18next();
    const [userAuthState, setUserState] = React.useState(UserAuthState.WELCOME);

    function nextUserState() {
        setUserState(userAuthState + 1);
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
                        {userAuthState === UserAuthState.MAIL_INPUT_START && (
                            <>
                                <p className="login-modal-header">Регистрация</p>
                                <p className="login-modal-description login-modal-opaque-text">
                                    Карта терминалов от Finik, исследуйте, отмечайте и зарабатывайте баллы
                                </p>
                                <div className="login-modal-input-outer-container">
                                    <p className="login-modal-input-help">Нам нужна только ваша почта</p>
                                    <div className="login-modal-input-inner-container">
                                        <StaticImage
                                            className="login-modal-input-envelope-image"
                                            src="../../../assets/images/Envelope.svg"
                                            alt="input-email"
                                        />
                                        <input className="login-modal-input-text" type="email" />
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
                        {userAuthState === UserAuthState.MAIL_INPUT_START && (
                            <>
                                <input
                                    className="login-modal-button-black-on-green"
                                    type="button"
                                    value="Далее"
                                    onClick={() => {
                                        nextUserState();
                                    }}
                                />
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
