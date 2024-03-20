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
    const userAuthState = useAuthentication().authenticationStep;

    const showShadows = userAuthState === AuthenticationStep.WELCOME;
    const showNavigationButtons = [
        AuthenticationStep.MAIL_INPUT,
        AuthenticationStep.SIGNUP_PASSWORD,
        AuthenticationStep.LOGIN,
        AuthenticationStep.LOGIN_PASSWORD_RESET,
    ].includes(userAuthState);

    function getAuthorisationComponent(userAuthState: AuthenticationStep) {
        switch (userAuthState) {
            case AuthenticationStep.WELCOME:
                return <WelcomeForm />;
            case AuthenticationStep.MAIL_INPUT:
                return <MailInputForm />;
            case AuthenticationStep.SIGNUP_PASSWORD:
                return <PasswordCreationForm />;
            case AuthenticationStep.LOGIN:
                return <LogInForm />;
            case AuthenticationStep.LOGIN_PASSWORD_RESET:
                return <PasswordResetRequestForm />;
            case AuthenticationStep.SIGNUP_OTP:
            case AuthenticationStep.LOGIN_OTP:
                return <OTPForm />;
            case AuthenticationStep.SIGNUP_OTP_LOADING:
            case AuthenticationStep.LOGIN_OTP_LOADING:
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
                {getAuthorisationComponent(userAuthState)}
            </div>
        </div>
    );
}
