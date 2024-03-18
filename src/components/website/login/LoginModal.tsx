import React from 'react';
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
import { UserAuthState, useLoginModalState } from './redux/state';
import { WelcomeForm } from './WelcomeForm';

export function LoginModal() {
    const userAuthState = useLoginModalState().userAuthState;

    const showShadows = userAuthState === UserAuthState.WELCOME;

    return (
        <div className="login-modal-window">
            <div className="login-modal-container">
                {showShadows && <LoginModalShadows />}
                {userAuthState === UserAuthState.WELCOME && (
                    <>
                        <LoginModalHeader />
                        <WelcomeForm />
                    </>
                )}
                {(userAuthState === UserAuthState.MAIL_INPUT ||
                    userAuthState === UserAuthState.SIGNUP_PASSWORD ||
                    userAuthState === UserAuthState.LOGIN ||
                    userAuthState === UserAuthState.LOGIN_PASSWORD_RESET) && <NavigationButtons />}
                {userAuthState === UserAuthState.MAIL_INPUT && (
                    <>
                        <LoginModalHeader />
                        <MailInputForm />
                    </>
                )}
                {userAuthState === UserAuthState.SIGNUP_PASSWORD && (
                    <>
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
                        <LoginModalHeader />
                        <LogInForm />
                    </>
                )}
                {userAuthState === UserAuthState.LOGIN_PASSWORD_RESET && (
                    <>
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
