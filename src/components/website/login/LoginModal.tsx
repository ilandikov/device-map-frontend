import React, { useRef } from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { MailInput } from './MailInput';
import { PasswordCreation } from './PasswordCreation';
import { MailInputBox } from './MailInputBox';
import { PasswordInputBox } from './PasswordInputBox';
import { OTPInput } from './OTPInput';
import { userAuthStateFromOTP, userAuthStateFromUserEmail, userAuthStateFromUserPasswords } from './UserAuthStateUtils';
import { LogInHeader, SignUpHeader, WelcomeHeader } from './LoginModalHeaders';
import { Ellipses } from './Ellipses/Ellipses';

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

export function AppleSauce() {
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
        <>
            {userAuthState === UserAuthState.WELCOME && (
                <>
                    <Ellipses />
                    <div className="login-modal-input-container">
                        <WelcomeHeader />
                    </div>
                    <div className="login-modal-button-container">
                        <input className="login-modal-button-black-on-green" type="button" value={t('accountLogin')} />
                        <input
                            className="login-modal-button-green-on-black"
                            type="button"
                            value={t('accountRegister')}
                            onClick={() => {
                                nextUserState();
                            }}
                        />
                    </div>
                </>
            )}
            {(userAuthState === UserAuthState.MAIL_INPUT_START ||
                userAuthState === UserAuthState.MAIL_ALREADY_EXISTS ||
                userAuthState === UserAuthState.MAIL_NOT_VALID) && (
                <>
                    <div className="login-modal-input-container">
                        <SignUpHeader />
                        <MailInput {...{ setUserEmail, userAuthState, userEmail }} />
                    </div>
                    <div className="login-modal-button-container">
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
                    </div>
                </>
            )}
            {userAuthState === UserAuthState.PASSWORD_INPUT && (
                <>
                    <div className="login-modal-input-container">
                        <LogInHeader />
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
                    </div>
                    <div className="login-modal-button-container">
                        <input
                            className="login-modal-button-black-on-green"
                            type="button"
                            value={t('next')}
                            onClick={() => {
                                const nextUserState = userAuthStateFromUserPasswords(userPassword, userPasswordRepeat);
                                setUserState(nextUserState);
                            }}
                        />
                    </div>
                </>
            )}
            {(userAuthState === UserAuthState.PASSWORD_CREATION ||
                userAuthState === UserAuthState.PASSWORD_CREATION_MATCH_ERROR) && (
                <>
                    <div className="login-modal-input-container">
                        <SignUpHeader />
                        <PasswordCreation {...{ userAuthState, setUserPassword, setUserPasswordRepeat }} />
                    </div>
                    <div className="login-modal-button-container">
                        <input
                            className="login-modal-button-black-on-green"
                            type="button"
                            value={t('next')}
                            onClick={() => {
                                const nextUserState = userAuthStateFromUserPasswords(userPassword, userPasswordRepeat);
                                setUserState(nextUserState);
                            }}
                        />
                    </div>
                </>
            )}
            {userAuthState === UserAuthState.OTP_INPUT && (
                <>
                    <div className="login-modal-input-container">
                        <SignUpHeader />
                        <OTPInput nextButton={OTPNextButton} />
                    </div>
                    <div className="login-modal-button-container">
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
                    </div>
                </>
            )}
            {userAuthState === UserAuthState.OTP_LOADING && (
                <>
                    <div className="login-modal-input-container">
                        <SignUpHeader />
                        <p className="login-modal-input-help">{t('OTPVerifying')}</p>
                    </div>
                    <div className="login-modal-button-container"></div>
                </>
            )}
        </>
    );
}
