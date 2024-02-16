import React from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { MailInputForm } from './MailInputForm';
import { PasswordCreationForm } from './PasswordCreationForm';
import { OTPInputForm } from './OTPInputForm';
import { LogInHeader, NewPasswordHeader, SignUpHeader, WelcomeHeader } from './LoginModalHeaders';
import { Ellipses } from './Ellipses/Ellipses';
import './LoginModal.scss';
import { LogInForm } from './LogInForm';
import { NavigationButtons } from './NavigationButtons';
import { PasswordResetRequestForm } from './PasswordResetRequestForm';

export enum UserAuthState {
    WELCOME,
    MAIL_INPUT,
    MAIL_INPUT_ERROR_EXISTENCE,
    MAIL_INPUT_ERROR_VALIDITY,
    SIGNUP_PASSWORD,
    SIGNUP_PASSWORD_ERROR,
    SIGNUP_OTP,
    SIGNUP_OTP_LOADING,
    LOGIN,
    LOGIN_PASSWORD_RESET,
    LOGGED_IN,
}

export function LoginModal() {
    const { t } = useI18next();

    const [userAuthState, setUserAuthState] = React.useState(UserAuthState.WELCOME);
    const [userEmail, setUserEmail] = React.useState('');
    const [userPassword, setUserPassword] = React.useState('');
    const [userPasswordRepeat, setUserPasswordRepeat] = React.useState('');

    return (
        <>
            {userAuthState === UserAuthState.WELCOME && (
                <>
                    <Ellipses />
                    <WelcomeHeader />
                    <div className="login-modal-input-container"></div>
                    <div className="login-modal-button-container">
                        <input
                            className="login-modal-button-black-on-green"
                            type="button"
                            value={t('accountLogin')}
                            onClick={() => {
                                setUserAuthState(UserAuthState.LOGIN);
                            }}
                        />
                        <input
                            className="login-modal-button-green-on-black"
                            type="button"
                            value={t('accountRegister')}
                            onClick={() => {
                                setUserAuthState(UserAuthState.MAIL_INPUT);
                            }}
                        />
                    </div>
                </>
            )}
            {(userAuthState === UserAuthState.MAIL_INPUT ||
                userAuthState === UserAuthState.MAIL_INPUT_ERROR_EXISTENCE ||
                userAuthState === UserAuthState.MAIL_INPUT_ERROR_VALIDITY) && (
                <>
                    <NavigationButtons {...{ setUserAuthState, goBackState: UserAuthState.WELCOME }} />
                    <SignUpHeader />
                    <MailInputForm
                        {...{
                            userAuthState,
                            setUserAuthState: setUserAuthState,
                            setUserEmail,
                            userEmail,
                        }}
                    />
                </>
            )}
            {userAuthState === UserAuthState.LOGIN && (
                <>
                    <NavigationButtons {...{ setUserAuthState, goBackState: UserAuthState.MAIL_INPUT }} />
                    <LogInHeader />
                    <LogInForm
                        {...{
                            userAuthState,
                            setUserAuthState,
                            userEmail,
                            setUserEmail,
                            userPassword,
                            setUserPassword,
                            userPasswordRepeat,
                        }}
                    />
                </>
            )}
            {(userAuthState === UserAuthState.SIGNUP_PASSWORD ||
                userAuthState === UserAuthState.SIGNUP_PASSWORD_ERROR) && (
                <>
                    <NavigationButtons {...{ setUserAuthState, goBackState: UserAuthState.MAIL_INPUT }} />
                    <SignUpHeader />
                    <PasswordCreationForm
                        {...{
                            userAuthState,
                            setUserAuthState,
                            userPassword,
                            setUserPassword,
                            userPasswordRepeat,
                            setUserPasswordRepeat,
                        }}
                    />
                </>
            )}
            {userAuthState === UserAuthState.LOGIN_PASSWORD_RESET && (
                <>
                    <NewPasswordHeader />
                    <PasswordResetRequestForm {...{ userEmail, setUserEmail }} />
                </>
            )}
            {userAuthState === UserAuthState.SIGNUP_OTP && (
                <>
                    <SignUpHeader />
                    <OTPInputForm {...{ setUserAuthState }} />
                </>
            )}
            {userAuthState === UserAuthState.SIGNUP_OTP_LOADING && (
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
