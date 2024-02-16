import React from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { MailInputForm } from './MailInputForm';
import { PasswordCreationForm } from './PasswordCreationForm';
import { OTPInputForm } from './OTPInputForm';
import { LogInHeader, SignUpHeader, WelcomeHeader } from './LoginModalHeaders';
import { Ellipses } from './Ellipses/Ellipses';
import './LoginModal.scss';
import { LogInForm } from './LogInForm';
import { NavigationButtons } from './NavigationButtons';
import { LoginModalHeader } from './LoginModalHeader';
import { MailInputBox } from './MailInputBox';

export enum UserAuthState {
    WELCOME,
    MAIL_INPUT_START,
    MAIL_ALREADY_EXISTS,
    MAIL_NOT_VALID,
    PASSWORD_CREATION,
    PASSWORD_CREATION_MATCH_ERROR,
    PASSWORD_INPUT,
    PASSWORD_RESET,
    OTP_INPUT,
    OTP_LOADING,
    USER_LOGGED_IN,
}

function NewPasswordHeader() {
    const { t } = useI18next();

    return (
        <LoginModalHeader
            header={t('newPassword')}
            description={t('finikMapProductDescription')}
            opaqueDescription={true}
        />
    );
}

export function LoginModal() {
    const { t } = useI18next();

    const [userAuthState, setUserAuthState] = React.useState(UserAuthState.WELCOME);
    const [userEmail, setUserEmail] = React.useState('');
    const [userPassword, setUserPassword] = React.useState('');
    const [userPasswordRepeat, setUserPasswordRepeat] = React.useState('');

    return (
        <>
            {userAuthState === UserAuthState.WELCOME && (
                <>
                    <Ellipses />
                    <WelcomeHeader />
                    <div className="login-modal-input-container"></div>
                    <div className="login-modal-button-container">
                        <input className="login-modal-button-black-on-green" type="button" value={t('accountLogin')} />
                        <input
                            className="login-modal-button-green-on-black"
                            type="button"
                            value={t('accountRegister')}
                            onClick={() => {
                                setUserAuthState(UserAuthState.MAIL_INPUT_START);
                            }}
                        />
                    </div>
                </>
            )}
            {(userAuthState === UserAuthState.MAIL_INPUT_START ||
                userAuthState === UserAuthState.MAIL_ALREADY_EXISTS ||
                userAuthState === UserAuthState.MAIL_NOT_VALID) && (
                <>
                    <NavigationButtons {...{ setUserAuthState, goBackState: UserAuthState.WELCOME }} />
                    <SignUpHeader />
                    <MailInputForm
                        {...{
                            userAuthState,
                            setUserAuthState: setUserAuthState,
                            setUserEmail,
                            userEmail,
                        }}
                    />
                </>
            )}
            {userAuthState === UserAuthState.PASSWORD_INPUT && (
                <>
                    <NavigationButtons {...{ setUserAuthState, goBackState: UserAuthState.MAIL_INPUT_START }} />
                    <LogInHeader />
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
            {(userAuthState === UserAuthState.PASSWORD_CREATION ||
                userAuthState === UserAuthState.PASSWORD_CREATION_MATCH_ERROR) && (
                <>
                    <NavigationButtons {...{ setUserAuthState, goBackState: UserAuthState.MAIL_INPUT_START }} />
                    <SignUpHeader />
                    <PasswordCreationForm
                        {...{
                            userAuthState,
                            setUserAuthState,
                            userPassword,
                            setUserPassword,
                            userPasswordRepeat,
                            setUserPasswordRepeat,
                        }}
                    />
                </>
            )}
            {userAuthState === UserAuthState.PASSWORD_RESET && (
                <>
                    <NewPasswordHeader />
                    <div className="login-modal-input-container">
                        <MailInputBox
                            helpText={t('mailForPasswordReset')}
                            userEmail={userEmail}
                            onChange={(event) => {
                                setUserEmail(event.target.value);
                            }}
                        />
                    </div>
                    <div className="login-modal-button-container">
                        <input className="login-modal-button-black-on-green" type="button" value={t('OTPSendSMS')} />
                    </div>
                </>
            )}
            {userAuthState === UserAuthState.OTP_INPUT && (
                <>
                    <SignUpHeader />
                    <OTPInputForm {...{ setUserAuthState }} />
                </>
            )}
            {userAuthState === UserAuthState.OTP_LOADING && (
                <>
                    <SignUpHeader />
                    <div className="login-modal-input-container">
                        <p className="login-modal-input-help">{t('OTPVerifying')}</p>
                    </div>
                    <div className="login-modal-button-container"></div>
                </>
            )}
        </>
    );
}
