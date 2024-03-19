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
import { UserAuthState, useLoginModalState } from './redux/state';
import { WelcomeForm } from './WelcomeForm';
import { LoginModalHeader } from './LoginModalHeader';

export function LoginModal() {
    const userAuthState = useLoginModalState().userAuthState;

    const showShadows = userAuthState === UserAuthState.WELCOME;
    const showNavigationButtons = [
        UserAuthState.MAIL_INPUT,
        UserAuthState.SIGNUP_PASSWORD,
        UserAuthState.LOGIN,
        UserAuthState.LOGIN_PASSWORD_RESET,
    ].includes(userAuthState);

    function getAuthorisationComponent(userAuthState: UserAuthState) {
        switch (userAuthState) {
            case UserAuthState.WELCOME:
                return <WelcomeForm />;
            case UserAuthState.MAIL_INPUT:
                return <MailInputForm />;
            case UserAuthState.SIGNUP_PASSWORD:
                return <PasswordCreationForm />;
            case UserAuthState.LOGIN:
                return <LogInForm />;
            case UserAuthState.LOGIN_PASSWORD_RESET:
                return <PasswordResetRequestForm />;
            case UserAuthState.SIGNUP_OTP:
            case UserAuthState.LOGIN_OTP:
                return <OTPForm />;
            case UserAuthState.SIGNUP_OTP_LOADING:
            case UserAuthState.LOGIN_OTP_LOADING:
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
