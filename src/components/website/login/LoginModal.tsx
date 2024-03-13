import React from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { MailInputForm } from './MailInputForm';
import { PasswordCreationForm } from './PasswordCreationForm';
import { OTPForm } from './OTPForm';
import { LoginModalHeader, LoginModalHeaderState } from './LoginModalHeader';
import { LoginModalShadows } from './LoginModalShadows/LoginModalShadows';
import './LoginModal.scss';
import { LogInForm } from './LogInForm';
import { NavigationButtons } from './NavigationButtons';
import { PasswordResetRequestForm } from './PasswordResetRequestForm';
import { Loader } from './Loader';

export enum UserAuthState {
    WELCOME = 'WELCOME',
    MAIL_INPUT = 'MAIL_INPUT',
    SIGNUP_PASSWORD = 'SIGNUP_PASSWORD',
    SIGNUP_OTP = 'SIGNUP_OTP',
    SIGNUP_OTP_LOADING = 'SIGNUP_OTP_LOADING',
    LOGIN = 'LOGIN',
    LOGIN_PASSWORD_RESET = 'LOGIN_PASSWORD_RESET',
    LOGIN_OTP = 'LOGIN_OTP',
    LOGIN_OTP_LOADING = 'LOGIN_OTP_LOADING',
    LOGGED_IN = 'LOGGED_IN',
}

export function LoginModal() {
    const { t } = useI18next();

    const [userAuthState, setUserAuthState] = React.useState(UserAuthState.WELCOME);
    const [userEmail, setUserEmail] = React.useState('');
    const [userPassword, setUserPassword] = React.useState('');
    const [userPasswordRepeat, setUserPasswordRepeat] = React.useState('');

    return (
        <div className="login-modal-window">
            <div className="login-modal-container">
                {userAuthState === UserAuthState.WELCOME && (
                    <>
                        <LoginModalShadows />
                        <LoginModalHeader state={LoginModalHeaderState.WELCOME} />
                        <div className="login-modal-input-container"></div>
                        <div className="login-modal-button-container">
                            <button
                                className="login-modal-button-black-on-green"
                                onClick={() => {
                                    setUserAuthState(UserAuthState.LOGIN);
                                }}
                            >
                                {t('accountLogin')}
                            </button>
                            <button
                                className="login-modal-button-green-on-black"
                                onClick={() => {
                                    setUserAuthState(UserAuthState.MAIL_INPUT);
                                }}
                            >
                                {t('accountRegister')}
                            </button>
                        </div>
                    </>
                )}
                {userAuthState === UserAuthState.MAIL_INPUT && (
                    <>
                        <NavigationButtons {...{ setUserAuthState, goBackState: UserAuthState.WELCOME }} />
                        <LoginModalHeader state={LoginModalHeaderState.SIGNUP} />
                        <MailInputForm
                            {...{
                                setUserAuthState,
                                userEmail,
                                setUserEmail,
                            }}
                        />
                    </>
                )}
                {userAuthState === UserAuthState.SIGNUP_PASSWORD && (
                    <>
                        <NavigationButtons {...{ setUserAuthState, goBackState: UserAuthState.MAIL_INPUT }} />
                        <LoginModalHeader state={LoginModalHeaderState.SIGNUP} />
                        <PasswordCreationForm
                            {...{
                                setUserAuthState,
                                userPassword,
                                setUserPassword,
                                userPasswordRepeat,
                                setUserPasswordRepeat,
                            }}
                        />
                    </>
                )}
                {userAuthState === UserAuthState.SIGNUP_OTP && (
                    <>
                        <LoginModalHeader state={LoginModalHeaderState.SIGNUP} />
                        <OTPForm {...{ userAuthState, setUserAuthState }} />
                    </>
                )}
                {userAuthState === UserAuthState.SIGNUP_OTP_LOADING && (
                    <>
                        <LoginModalHeader state={LoginModalHeaderState.SIGNUP} />
                        <Loader />
                    </>
                )}
                {userAuthState === UserAuthState.LOGIN && (
                    <>
                        <NavigationButtons {...{ setUserAuthState, goBackState: UserAuthState.MAIL_INPUT }} />
                        <LoginModalHeader state={LoginModalHeaderState.LOGIN} />
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
                {userAuthState === UserAuthState.LOGIN_PASSWORD_RESET && (
                    <>
                        <NavigationButtons {...{ setUserAuthState, goBackState: UserAuthState.LOGIN }} />
                        <LoginModalHeader state={LoginModalHeaderState.NEW_PASSWORD} />
                        <PasswordResetRequestForm {...{ setUserAuthState, userEmail, setUserEmail }} />
                    </>
                )}
                {userAuthState === UserAuthState.LOGIN_OTP && (
                    <>
                        <LoginModalHeader state={LoginModalHeaderState.LOGIN} />
                        <OTPForm {...{ userAuthState, setUserAuthState }} />
                    </>
                )}
                {userAuthState === UserAuthState.LOGIN_OTP_LOADING && (
                    <>
                        <LoginModalHeader state={LoginModalHeaderState.LOGIN} />
                        <Loader />
                    </>
                )}
            </div>
        </div>
    );
}
