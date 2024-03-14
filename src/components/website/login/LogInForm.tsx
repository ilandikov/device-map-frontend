import React from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { useAppDispatch } from '../../../redux/store';
import { MailInputBox } from './MailInputBox';
import { PasswordInputBox } from './PasswordInputBox';
import { UserAuthState, userAuthStateFromUserLogin } from './UserAuthStateUtils';
import { LoginModalInputTypes, LoginModalVerifyTypes, loginModalInput, loginModalVerifyRequest } from './actions';

interface LogInFormProps {
    userAuthState: UserAuthState;
    setUserAuthState: (string) => void;
    userEmail: string;
    setUserEmail: (string) => void;
    userPassword: string;
    setUserPassword: (string) => void;
    userPasswordRepeat: string;
}

export function LogInForm(props: LogInFormProps) {
    const { t } = useI18next();
    const dispatch = useAppDispatch();

    return (
        <>
            <div className="login-modal-input-container">
                <MailInputBox
                    helpText={t('onlyEmail')}
                    userEmail={props.userEmail}
                    onChange={(event) => {
                        dispatch(loginModalInput(LoginModalInputTypes.USER_EMAIL, event.target.value));
                        props.setUserEmail(event.target.value);
                    }}
                    error={null}
                />
                <PasswordInputBox
                    helpText={t('enterPassword')}
                    testId="userPasswordLogin"
                    onChange={(event) => {
                        dispatch(loginModalInput(LoginModalInputTypes.USER_PASSWORD, event.target.value));
                        props.setUserPassword(event.target.value);
                    }}
                    error={null}
                />
            </div>
            <div className="login-modal-button-container">
                <div className="login-modal-two-buttons-on-one-row">
                    <button
                        className="login-modal-correct-input"
                        onClick={() => {
                            props.setUserAuthState(UserAuthState.LOGIN_PASSWORD_RESET);
                        }}
                    >
                        {t('resetPassword')}
                    </button>
                    <button
                        className="login-modal-button-black-on-green"
                        onClick={() => {
                            dispatch(loginModalVerifyRequest(LoginModalVerifyTypes.USER_EMAIL_AND_PASSWORD));
                            const nextUserState = userAuthStateFromUserLogin(props.userEmail, props.userPassword);
                            props.setUserAuthState(nextUserState);
                        }}
                    >
                        {t('next')}
                    </button>
                </div>
            </div>
        </>
    );
}
