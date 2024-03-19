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
        return (
            <>
                {userAuthState === UserAuthState.WELCOME && (
                    <>
                        <WelcomeForm />
                    </>
                )}
                {userAuthState === UserAuthState.MAIL_INPUT && (
                    <>
                        <MailInputForm />
                    </>
                )}
                {userAuthState === UserAuthState.SIGNUP_PASSWORD && (
                    <>
                        <PasswordCreationForm />
                    </>
                )}
                {userAuthState === UserAuthState.SIGNUP_OTP && (
                    <>
                        <OTPForm />
                    </>
                )}
                {userAuthState === UserAuthState.SIGNUP_OTP_LOADING && (
                    <>
                        <Loader />
                    </>
                )}
                {userAuthState === UserAuthState.LOGIN && (
                    <>
                        <LogInForm />
                    </>
                )}
                {userAuthState === UserAuthState.LOGIN_PASSWORD_RESET && (
                    <>
                        <PasswordResetRequestForm />
                    </>
                )}
                {userAuthState === UserAuthState.LOGIN_OTP && (
                    <>
                        <OTPForm />
                    </>
                )}
                {userAuthState === UserAuthState.LOGIN_OTP_LOADING && (
                    <>
                        <Loader />
                    </>
                )}
            </>
        );
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
