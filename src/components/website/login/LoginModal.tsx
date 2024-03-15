import React from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../../redux/store';
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
import { UserAuthState } from './UserAuthStateUtils';
import { LoginModalState } from './reducer';
import { loginModalButtonClick } from './actions';

export function LoginModal() {
    const { t } = useI18next();

    const loginModalState: LoginModalState = useSelector((state: RootState) => state.loginModalState);
    const dispatch = useAppDispatch();

    const userAuthState = loginModalState.userAuthState;

    return (
        <div className="login-modal-window">
            <div className="login-modal-container">
                {userAuthState === UserAuthState.WELCOME && (
                    // TODO extract welcome component and move it and its tests to a separate file
                    <>
                        <LoginModalShadows />
                        <LoginModalHeader state={LoginModalHeaderState.WELCOME} />
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
                        <LoginModalHeader state={LoginModalHeaderState.SIGNUP} />
                        <MailInputForm />
                    </>
                )}
                {userAuthState === UserAuthState.SIGNUP_PASSWORD && (
                    <>
                        <NavigationButtons />
                        <LoginModalHeader state={LoginModalHeaderState.SIGNUP} />
                        <PasswordCreationForm />
                    </>
                )}
                {userAuthState === UserAuthState.SIGNUP_OTP && (
                    <>
                        <LoginModalHeader state={LoginModalHeaderState.SIGNUP} />
                        <OTPForm />
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
                        <NavigationButtons />
                        <LoginModalHeader state={LoginModalHeaderState.LOGIN} />
                        <LogInForm />
                    </>
                )}
                {userAuthState === UserAuthState.LOGIN_PASSWORD_RESET && (
                    <>
                        <NavigationButtons />
                        <LoginModalHeader state={LoginModalHeaderState.NEW_PASSWORD} />
                        <PasswordResetRequestForm />
                    </>
                )}
                {userAuthState === UserAuthState.LOGIN_OTP && (
                    <>
                        <LoginModalHeader state={LoginModalHeaderState.LOGIN} />
                        <OTPForm />
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
