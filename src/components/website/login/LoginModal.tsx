import React, { useRef } from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { MailInput } from './MailInput';
import { PasswordCreation } from './PasswordCreation';
import { MailInputBox } from './MailInputBox';
import { PasswordInputBox } from './PasswordInputBox';
import { OTPInput } from './OTPInput';
import LogoGreen from '/src/assets/images/LogoGreen.svg';
import { userAuthStateFromUserEmail } from './UserAuthStateUtils';

export enum UserAuthState {
    WELCOME,
    MAIL_INPUT_START,
    MAIL_ALREADY_EXISTS,
    MAIL_NOT_VALID,
    PASSWORD_CREATION,
    PASSWORD_CREATION_MATCH_ERROR,
    PASSWORD_INPUT,
    OTP_INPUT,
}

export function LoginModal() {
    const { t } = useI18next();
    const [userAuthState, setUserState] = React.useState(UserAuthState.WELCOME);
    const [userEmail, setUserEmail] = React.useState('');
    const [userPassword, setUserPassword] = React.useState('');

    const [userPasswordRepeat, setUserPasswordRepeat] = React.useState('');

    const OTPNextButton = useRef(null);

    function nextUserState() {
        setUserState(userAuthState + 1);
    }

    function tryStorePassword(userPasswordA: string, userPasswordB: string) {
        if (userPasswordA !== userPasswordB) {
            setUserState(UserAuthState.PASSWORD_CREATION_MATCH_ERROR);
            return;
        }

        setUserState(UserAuthState.OTP_INPUT);
    }

    return (
        <div className="login-modal-container">
            <div className="login-modal">
                {userAuthState === UserAuthState.WELCOME && <Ellipses />}
                <div className="login-modal-content-container">
                    <div className="login-modal-top-container">
                        <img className="login-modal-logo" src={LogoGreen} alt="login-modal-logo" />
                        {userAuthState === UserAuthState.WELCOME && (
                            <>
                                <p className="login-modal-header">
                                    {t('brand')} {t('map')}
                                </p>
                                <p className="login-modal-header-description">{t('loginCallToAction')}</p>
                            </>
                        )}
                        {(userAuthState === UserAuthState.MAIL_INPUT_START ||
                            userAuthState === UserAuthState.MAIL_ALREADY_EXISTS ||
                            userAuthState === UserAuthState.MAIL_NOT_VALID) && (
                            <>
                                <p className="login-modal-header">{t('register')}</p>
                                <p className="login-modal-header-description login-modal-opaque-text">
                                    {t('finikMapProductDescription')}
                                </p>
                                <div className="login-modal-input-outer-container">
                                    <MailInput {...{ setUserEmail, userAuthState, userEmail }} />
                                </div>
                            </>
                        )}
                        {userAuthState === UserAuthState.PASSWORD_INPUT && (
                            <>
                                <p className="login-modal-header">{t('entrance')}</p>
                                <p className="login-modal-header-description login-modal-opaque-text">
                                    {t('finikMapProductDescription')}
                                </p>
                                <div className="login-modal-input-outer-container">
                                    <MailInputBox
                                        helpText={t('onlyEmail')}
                                        userEmail={userEmail}
                                        onChange={(event) => {
                                            setUserEmail(event.target.value);
                                        }}
                                    />
                                    <PasswordInputBox
                                        helpText={t('enterPassword')}
                                        userAuthState={userAuthState}
                                        onChange={(event) => {
                                            tryStorePassword(event.target.value, event.target.value);
                                        }}
                                        testId="userPasswordLogin"
                                    />
                                </div>
                            </>
                        )}
                        {(userAuthState === UserAuthState.PASSWORD_CREATION ||
                            userAuthState === UserAuthState.PASSWORD_CREATION_MATCH_ERROR) && (
                            <>
                                <p className="login-modal-header">{t('register')}</p>
                                <p className="login-modal-header-description login-modal-opaque-text">
                                    {t('finikMapProductDescription')}
                                </p>
                                <div className="login-modal-input-outer-container">
                                    <PasswordCreation {...{ userAuthState, setUserPassword, setUserPasswordRepeat }} />
                                </div>
                            </>
                        )}
                        {userAuthState === UserAuthState.OTP_INPUT && (
                            <>
                                <p className="login-modal-header">{t('register')}</p>
                                <p className="login-modal-header-description login-modal-opaque-text">
                                    {t('finikMapProductDescription')}
                                </p>
                                <OTPInput nextButton={OTPNextButton} />
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
                            userAuthState === UserAuthState.MAIL_ALREADY_EXISTS ||
                            userAuthState === UserAuthState.MAIL_NOT_VALID) && (
                            <>
                                {userAuthState === UserAuthState.MAIL_ALREADY_EXISTS && (
                                    <input
                                        className="login-modal-button-green-on-black"
                                        type="button"
                                        value={t('accountLogin')}
                                        onClick={() => {
                                            setUserState(UserAuthState.PASSWORD_INPUT);
                                        }}
                                    />
                                )}
                                <input
                                    className="login-modal-button-black-on-green"
                                    type="button"
                                    value={t('next')}
                                    onClick={() => {
                                        const nextUserAuthState = userAuthStateFromUserEmail(userEmail);
                                        setUserState(nextUserAuthState);
                                    }}
                                />
                            </>
                        )}
                        {(userAuthState === UserAuthState.PASSWORD_CREATION ||
                            userAuthState === UserAuthState.PASSWORD_CREATION_MATCH_ERROR) && (
                            <>
                                <input
                                    className="login-modal-button-black-on-green"
                                    type="button"
                                    value={t('next')}
                                    onClick={() => {
                                        tryStorePassword(userPassword, userPasswordRepeat);
                                    }}
                                />
                            </>
                        )}
                        {userAuthState === UserAuthState.PASSWORD_INPUT && (
                            <>
                                <input
                                    className="login-modal-button-black-on-green"
                                    type="button"
                                    value={t('next')}
                                    onClick={() => {
                                        tryStorePassword(userPassword, userPasswordRepeat);
                                    }}
                                />
                            </>
                        )}
                        {userAuthState === UserAuthState.OTP_INPUT && (
                            <>
                                <input
                                    className="login-modal-button-black-on-green"
                                    type="button"
                                    value={t('next')}
                                    ref={OTPNextButton}
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
        <div className="login-ellipses-container" data-testid="ellipses">
            <div className="login-ellipse-left-container">
                <div className="login-ellipse login-ellipse-green"></div>
            </div>
            <div className="login-ellipse-right-container">
                <div className="login-ellipse login-ellipse-blue"></div>
            </div>
        </div>
    );
}
