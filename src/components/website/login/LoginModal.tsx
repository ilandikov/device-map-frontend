import React, { useRef } from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { MailInput } from './MailInput';
import { PasswordCreation } from './PasswordCreation';
import { MailInputBox } from './MailInputBox';
import { PasswordInputBox } from './PasswordInputBox';
import { OTPInput } from './OTPInput';
import LogoGreen from '/src/assets/images/LogoGreen.svg';
import { userAuthStateFromOTP, userAuthStateFromUserEmail, userAuthStateFromUserPasswords } from './UserAuthStateUtils';
import { LoginModalHeader } from './LoginModalHeader';

export enum UserAuthState {
    WELCOME,
    MAIL_INPUT_START,
    MAIL_ALREADY_EXISTS,
    MAIL_NOT_VALID,
    PASSWORD_CREATION,
    PASSWORD_CREATION_MATCH_ERROR,
    PASSWORD_INPUT,
    OTP_INPUT,
    OTP_LOADING,
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

    return (
        <div className="login-modal-container">
            <div className="login-modal">
                {userAuthState === UserAuthState.WELCOME && <Ellipses />}
                <div className="login-modal-content-container">
                    <div className="login-modal-input-container">
                        <img className="login-modal-logo" src={LogoGreen} alt="login-modal-logo" />
                        {userAuthState === UserAuthState.WELCOME && (
                            <LoginModalHeader
                                header={`${t('brand')} ${t('map')}`}
                                description={t('loginCallToAction')}
                                opaqueDescription={false}
                            />
                        )}
                        {(userAuthState === UserAuthState.MAIL_INPUT_START ||
                            userAuthState === UserAuthState.MAIL_ALREADY_EXISTS ||
                            userAuthState === UserAuthState.MAIL_NOT_VALID) && (
                            <>
                                <LoginModalHeader
                                    header={t('register')}
                                    description={t('finikMapProductDescription')}
                                    opaqueDescription={true}
                                />
                                <MailInput {...{ setUserEmail, userAuthState, userEmail }} />
                            </>
                        )}
                        {userAuthState === UserAuthState.PASSWORD_INPUT && (
                            <>
                                <LoginModalHeader
                                    header={t('entrance')}
                                    description={t('finikMapProductDescription')}
                                    opaqueDescription={true}
                                />
                                <MailInputBox
                                    helpText={t('onlyEmail')}
                                    userEmail={userEmail}
                                    onChange={(event) => {
                                        setUserEmail(event.target.value);
                                    }}
                                />
                                <PasswordInputBox
                                    userAuthState={userAuthState}
                                    helpText={t('enterPassword')}
                                    testId="userPasswordLogin"
                                    onChange={(event) => {
                                        const nextUserState = userAuthStateFromUserPasswords(
                                            event.target.value,
                                            event.target.value,
                                        );
                                        setUserState(nextUserState);
                                    }}
                                />
                            </>
                        )}
                        {(userAuthState === UserAuthState.PASSWORD_CREATION ||
                            userAuthState === UserAuthState.PASSWORD_CREATION_MATCH_ERROR) && (
                            <>
                                <LoginModalHeader
                                    header={t('register')}
                                    description={t('finikMapProductDescription')}
                                    opaqueDescription={true}
                                />
                                <PasswordCreation {...{ userAuthState, setUserPassword, setUserPasswordRepeat }} />
                            </>
                        )}
                        {userAuthState === UserAuthState.OTP_INPUT && (
                            <>
                                <LoginModalHeader
                                    header={t('register')}
                                    description={t('finikMapProductDescription')}
                                    opaqueDescription={true}
                                />
                                <OTPInput nextButton={OTPNextButton} />
                            </>
                        )}
                        {userAuthState === UserAuthState.OTP_LOADING && (
                            <>
                                <LoginModalHeader
                                    header={t('register')}
                                    description={t('finikMapProductDescription')}
                                    opaqueDescription={true}
                                />
                                <p className="login-modal-input-help">{t('OTPVerifying')}</p>
                            </>
                        )}
                    </div>
                    <div className="login-modal-button-container">
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
                                        const nextUserState = userAuthStateFromUserPasswords(
                                            userPassword,
                                            userPasswordRepeat,
                                        );
                                        setUserState(nextUserState);
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
                                        const nextUserState = userAuthStateFromUserPasswords(
                                            userPassword,
                                            userPasswordRepeat,
                                        );
                                        setUserState(nextUserState);
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
                                    onClick={() => {
                                        const nextUserAuthState = userAuthStateFromOTP();
                                        setUserState(nextUserAuthState);
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
