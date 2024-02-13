import React, { useRef } from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { MailInputForm } from './MailInputForm';
import { PasswordCreation } from './PasswordCreation';
import { OTPInput } from './OTPInput';
import { userAuthStateFromOTP, userAuthStateFromUserPasswords } from './UserAuthStateUtils';
import { LogInHeader, SignUpHeader, WelcomeHeader } from './LoginModalHeaders';
import { Ellipses } from './Ellipses/Ellipses';
import './LoginModal.scss';
import { LogInForm } from './LogInForm';

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
        <>
            {userAuthState === UserAuthState.WELCOME && (
                <>
                    <Ellipses />
                    <WelcomeHeader />
                    <div className="login-modal-input-container"></div>
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
                    <SignUpHeader />
                    <MailInputForm
                        {...{
                            userAuthState,
                            setUserAuthState: setUserState,
                            setUserEmail,
                            userEmail,
                        }}
                    />
                </>
            )}
            {userAuthState === UserAuthState.PASSWORD_INPUT && (
                <>
                    <LogInHeader />
                    <LogInForm
                        userAuthState={userAuthState}
                        setUserAuthState={setUserState}
                        userEmail={userEmail}
                        setUserEmail={setUserEmail}
                        userPassword={userPassword}
                        userPasswordRepeat={userPasswordRepeat}
                        onClick={() => {
                            const nextUserState = userAuthStateFromUserPasswords(userPassword, userPasswordRepeat);
                            setUserState(nextUserState);
                        }}
                    />
                </>
            )}
            {(userAuthState === UserAuthState.PASSWORD_CREATION ||
                userAuthState === UserAuthState.PASSWORD_CREATION_MATCH_ERROR) && (
                <>
                    <SignUpHeader />
                    <div className="login-modal-input-container">
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
                    <SignUpHeader />
                    <div className="login-modal-input-container">
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
                    <SignUpHeader />
                    <div className="login-modal-input-container">
                        <p className="login-modal-input-help">{t('OTPVerifying')}</p>
                    </div>
                    <div className="login-modal-button-container"></div>
                </>
            )}
        </>
    );
}
