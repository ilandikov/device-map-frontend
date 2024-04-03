import React from 'react';
import { MailInputForm } from './MailInputForm';
import { PasswordCreationForm } from './PasswordCreationForm';
import { OTPForm } from './OTPForm';
import { LoginModalShadows } from './LoginModalShadows/LoginModalShadows';
import './LoginModal.scss';
import { LogInForm } from './LogInForm';
import { NavigationButtons } from './NavigationButtons';
import { PasswordResetRequestForm } from './PasswordResetRequestForm';
import { Loader } from './Loader';
import { AuthenticationStep, useAuthentication } from './redux/state';
import { WelcomeForm } from './WelcomeForm';
import { LoginModalHeader } from './LoginModalHeader';

export function LoginModal() {
    const { step: authenticationStep } = useAuthentication();

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
            case AuthenticationStep.MAIL_INPUT:
                return <MailInputForm />;
            case AuthenticationStep.PASSWORD_CREATION:
                return <PasswordCreationForm />;
            case AuthenticationStep.LOGIN:
                return <LogInForm />;
            case AuthenticationStep.PASSWORD_RESET_REQUEST:
                return <PasswordResetRequestForm />;
            case AuthenticationStep.PASSWORD_CREATION_OTP:
            case AuthenticationStep.PASSWORD_RESET_OTP:
                return <OTPForm />;
            case AuthenticationStep.PASSWORD_CREATION_OTP_LOADING:
            case AuthenticationStep.PASSWORD_RESET_OTP_LOADING:
                return <Loader />;
        }

        return <></>;
    }

    return (
        <div className="login-modal-window">
            <div className="login-modal-container">
                {showShadows && <LoginModalShadows />}
                {showNavigationButtons && <NavigationButtons />}
                <LoginModalHeader />
                {getAuthenticationComponent(authenticationStep)}
            </div>
        </div>
    );
}
