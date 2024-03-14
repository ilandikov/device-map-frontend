import { useI18next } from 'gatsby-plugin-react-i18next';
import React, { useState } from 'react';
import { useAppDispatch } from '../../../redux/store';
import { PasswordInputBox } from './PasswordInputBox';
import { getPasswordInputErrorAndNextState } from './UserAuthStateUtils';
import { LoginModalActionTypes, LoginModalVerifyTypes, loginModalVerifyRequest } from './actions';

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

    const [passwordInputError, setPasswordInputError] = useState(null);

    return (
        <>
            <div className="login-modal-input-container">
                <PasswordInputBox
                    helpText={t('enterPassword')}
                    testId="userPassword"
                    onChange={(event) => {
                        dispatch({ type: LoginModalActionTypes.USER_PASSWORD_INPUT, userPassword: event.target.value });
                        props.setUserPassword(event.target.value);
                    }}
                    error={passwordInputError}
                />
                <PasswordInputBox
                    helpText={t('repeatPassword')}
                    testId="userPasswordRepeat"
                    onChange={(event) => {
                        dispatch({
                            type: LoginModalActionTypes.USER_PASSWORD_REPEAT_INPUT,
                            userPassword: event.target.value,
                        });
                        props.setUserPasswordRepeat(event.target.value);
                    }}
                    error={passwordInputError}
                />
            </div>
            <div className="login-modal-button-container">
                <button
                    className="login-modal-button-black-on-green"
                    onClick={() => {
                        dispatch(loginModalVerifyRequest(LoginModalVerifyTypes.USER_PASSWORD));
                        const { passwordInputError, nextUserAuthState } = getPasswordInputErrorAndNextState(
                            props.userPassword,
                            props.userPasswordRepeat,
                        );

                        setPasswordInputError(passwordInputError);
                        props.setUserAuthState(nextUserAuthState);
                    }}
                >
                    {t('next')}
                </button>
            </div>
        </>
    );
}
