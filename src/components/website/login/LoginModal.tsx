import React from 'react';
import { ComponentMap } from '../common/ComponentMap';
import { MailInputForm } from './MailInputForm';
import { PasswordCreationForm } from './PasswordCreationForm';
import { OTPForm } from './OTPForm';
import { LoginModalShadows } from './LoginModalShadows';
import './LoginModal.scss';
import './LoginModalCommon.scss';
import { LogInForm } from './LogInForm';
import { NavigationButtons } from './NavigationButtons';
import { PasswordResetRequestForm } from './PasswordResetRequestForm';
import { LoginModalLoader } from './LoginModalLoader';
import { AuthenticationStep, useLoginModalAuthentication } from './redux/AuthenticationState';
import { WelcomeForm } from './WelcomeForm';
import { LoginModalHeader } from './LoginModalHeader';

export function LoginModal() {
    const { step: authenticationStep } = useLoginModalAuthentication();

    const showShadows = authenticationStep === AuthenticationStep.WELCOME;
    const showNavigationButtons = [
        AuthenticationStep.MAIL_INPUT,
        AuthenticationStep.PASSWORD_CREATION,
        AuthenticationStep.LOGIN,
        AuthenticationStep.PASSWORD_RESET_REQUEST,
    ].includes(authenticationStep);

    const authenticationComponents: ComponentMap<AuthenticationStep> = {
        WELCOME: <WelcomeForm />,
        // Sign up
        MAIL_INPUT: <MailInputForm />,
        PASSWORD_CREATION: <PasswordCreationForm />,
        PASSWORD_CREATION_LOADING: <LoginModalLoader />,
        PASSWORD_CREATION_OTP: <OTPForm />,
        PASSWORD_CREATION_OTP_LOADING: <LoginModalLoader />,
        PASSWORD_CREATION_OTP_RESEND_LOADING: <LoginModalLoader />,
        // Sign in
        LOGIN: <LogInForm />,
        LOGIN_LOADING: <LoginModalLoader />,
        // Password reset
        PASSWORD_RESET_REQUEST: <PasswordResetRequestForm />,
        PASSWORD_RESET_REQUEST_LOADING: <LoginModalLoader />,
        PASSWORD_RESET_OTP: <OTPForm />,
        PASSWORD_RESET: <PasswordCreationForm />,
        PASSWORD_RESET_LOADING: <LoginModalLoader />,
        // Logged in
        LOGGED_IN: <></>,
    };

    return (
        <div className="login-modal-window">
            <div className="login-modal-container">
                {showShadows && <LoginModalShadows />}
                {showNavigationButtons && <NavigationButtons />}
                <LoginModalHeader />
                {authenticationComponents[authenticationStep]}
            </div>
        </div>
    );
}
