import React from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../../redux/store';
import { MailInputForm } from './MailInputForm';
import { PasswordCreationForm } from './PasswordCreationForm';
import { OTPForm } from './OTPForm';
import { LoginModalHeader } from './LoginModalHeader';
import { LoginModalShadows } from './LoginModalShadows/LoginModalShadows';
import './LoginModal.scss';
import { LogInForm } from './LogInForm';
import { NavigationButtons } from './NavigationButtons';
import { PasswordResetRequestForm } from './PasswordResetRequestForm';
import { Loader } from './Loader';
import { loginModalButtonClick } from './redux/actions';
import { LoginModalState, UserAuthState } from './redux/state';

export function LoginModal() {
    const { t } = useI18next();
    const dispatch = useAppDispatch();

    const loginModalState: LoginModalState = useSelector((state: RootState) => state.loginModalState);
    const userAuthState = loginModalState.userAuthState;

    return (
        <div className="login-modal-window">
            <div className="login-modal-container">
                {userAuthState === UserAuthState.WELCOME && (
                    <>
                        <LoginModalShadows />
                        <LoginModalHeader />
                        <div className="login-modal-input-container"></div>
                        <div className="login-modal-button-container">
                            <button
                                className="login-modal-button-black-on-green"
                                onClick={() => {
                                    dispatch(loginModalButtonClick('accountLogin'));
                                }}
                            >
                                {t('accountLogin')}
                            </button>
                            <button
                                className="login-modal-button-green-on-black"
                                onClick={() => {
                                    dispatch(loginModalButtonClick('accountRegister'));
                                }}
                            >
                                {t('accountRegister')}
                            </button>
                        </div>
                    </>
                )}
                {userAuthState === UserAuthState.MAIL_INPUT && (
                    <>
                        <NavigationButtons />
                        <LoginModalHeader />
                        <MailInputForm />
                    </>
                )}
                {userAuthState === UserAuthState.SIGNUP_PASSWORD && (
                    <>
                        <NavigationButtons />
                        <LoginModalHeader />
                        <PasswordCreationForm />
                    </>
                )}
                {userAuthState === UserAuthState.SIGNUP_OTP && (
                    <>
                        <LoginModalHeader />
                        <OTPForm />
                    </>
                )}
                {userAuthState === UserAuthState.SIGNUP_OTP_LOADING && (
                    <>
                        <LoginModalHeader />
                        <Loader />
                    </>
                )}
                {userAuthState === UserAuthState.LOGIN && (
                    <>
                        <NavigationButtons />
                        <LoginModalHeader />
                        <LogInForm />
                    </>
                )}
                {userAuthState === UserAuthState.LOGIN_PASSWORD_RESET && (
                    <>
                        <NavigationButtons />
                        <LoginModalHeader />
                        <PasswordResetRequestForm />
                    </>
                )}
                {userAuthState === UserAuthState.LOGIN_OTP && (
                    <>
                        <LoginModalHeader />
                        <OTPForm />
                    </>
                )}
                {userAuthState === UserAuthState.LOGIN_OTP_LOADING && (
                    <>
                        <LoginModalHeader />
                        <Loader />
                    </>
                )}
            </div>
        </div>
    );
}
