import React from 'react';
import { MailInputForm } from './MailInputForm';
import { PasswordCreationForm } from './PasswordCreationForm';
import { OTPForm } from './OTPForm';
import { LoginModalShadows } from './LoginModalShadows';
import './LoginModal.scss';
import { LogInForm } from './LogInForm';
import { NavigationButtons } from './NavigationButtons';
import { PasswordResetRequestForm } from './PasswordResetRequestForm';
import { Loader } from './Loader';
import { AuthenticationStep, useLoginModalAuthentication } from './redux/LoginModalAuthenticationState';
import { WelcomeForm } from './WelcomeForm';
import { LoginModalHeader } from './LoginModalHeader';
import { MapAppUsageStep, useMapAppState } from '../mapApp/redux/MapAppState';

export function LoginModal() {
    const mapAppState = useMapAppState();
    const showLoginModal = mapAppState.usageStep === MapAppUsageStep.USER_AUTHENTICATION;
    const animationClass = showLoginModal ? 'login-modal-window-appears' : 'login-modal-window-disappears';

    const { step: authenticationStep } = useLoginModalAuthentication();

    const showShadows = authenticationStep === AuthenticationStep.WELCOME;
    const showNavigationButtons = [
        AuthenticationStep.MAIL_INPUT,
        AuthenticationStep.PASSWORD_CREATION,
        AuthenticationStep.LOGIN,
        AuthenticationStep.PASSWORD_RESET_REQUEST,
    ].includes(authenticationStep);

    function getAuthenticationComponent(authenticationStep: AuthenticationStep) {
        switch (authenticationStep) {
            case AuthenticationStep.WELCOME:
                return <WelcomeForm />;
            // Sign up
            case AuthenticationStep.MAIL_INPUT:
                return <MailInputForm />;
            case AuthenticationStep.PASSWORD_CREATION:
                return <PasswordCreationForm />;
            case AuthenticationStep.PASSWORD_CREATION_LOADING:
                return <Loader />;
            case AuthenticationStep.PASSWORD_CREATION_OTP:
                return <OTPForm />;
            case AuthenticationStep.PASSWORD_CREATION_OTP_LOADING:
                return <Loader />;
            // Sign in
            case AuthenticationStep.LOGIN:
                return <LogInForm />;
            case AuthenticationStep.LOGIN_LOADING:
                return <Loader />;
            // Password reset
            case AuthenticationStep.PASSWORD_RESET_REQUEST:
                return <PasswordResetRequestForm />;
            case AuthenticationStep.PASSWORD_RESET_OTP:
                return <OTPForm />;
            case AuthenticationStep.PASSWORD_RESET:
                return <PasswordCreationForm />;
            case AuthenticationStep.PASSWORD_RESET_LOADING:
                return <Loader />;
        }

        return <></>;
    }

    return (
        <div className={`login-modal-window ${animationClass}`}>
            <div className="login-modal-container">
                {showShadows && <LoginModalShadows />}
                {showNavigationButtons && <NavigationButtons />}
                <LoginModalHeader />
                {getAuthenticationComponent(authenticationStep)}
            </div>
        </div>
    );
}
