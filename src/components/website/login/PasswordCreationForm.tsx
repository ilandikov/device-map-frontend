import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../../redux/store';
import { PasswordInputBox } from './PasswordInputBox';
import { LoginModalInputTypes, LoginModalVerifyTypes, loginModalInput, loginModalVerifyRequest } from './actions';
import { LoginModalState } from './reducer';

interface PasswordCreationFormProps {
    setUserAuthState: (string) => void;
    userPassword: string;
    setUserPassword: (newUserPassword: string) => void;
    userPasswordRepeat: string;
    setUserPasswordRepeat: (newUserPassword: string) => void;
}

export function PasswordCreationForm(props: PasswordCreationFormProps) {
    const { t } = useI18next();
    const dispatch = useAppDispatch();

    const loginModalState: LoginModalState = useSelector((state: RootState) => state.loginModalState);
    const passwordInputError = loginModalState.userPasswordError;

    return (
        <>
            <div className="login-modal-input-container">
                <PasswordInputBox
                    helpText={t('enterPassword')}
                    testId="userPassword"
                    onChange={(event) => {
                        dispatch(loginModalInput(LoginModalInputTypes.USER_PASSWORD, event.target.value));
                    }}
                    error={passwordInputError}
                />
                <PasswordInputBox
                    helpText={t('repeatPassword')}
                    testId="userPasswordRepeat"
                    onChange={(event) => {
                        dispatch(loginModalInput(LoginModalInputTypes.USER_PASSWORD_REPEAT, event.target.value));
                    }}
                    error={passwordInputError}
                />
            </div>
            <div className="login-modal-button-container">
                <button
                    className="login-modal-button-black-on-green"
                    onClick={() => {
                        dispatch(loginModalVerifyRequest(LoginModalVerifyTypes.USER_PASSWORD));
                    }}
                >
                    {t('next')}
                </button>
            </div>
        </>
    );
}
