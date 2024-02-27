import { useI18next } from 'gatsby-plugin-react-i18next';
import React, { useState } from 'react';
import { UserAuthState } from './LoginModal';
import { MailInputBox } from './MailInputBox';
import { MailInputError, getUserEmailError } from './UserAuthStateUtils';

interface MailInputFormProps {
    setUserAuthState: (userAuthState: UserAuthState) => void;
    userEmail: string;
    setUserEmail: (newUserEmail: string) => void;
}

function getUserEmailErrorAndNextState(userEmail: string) {
    const mailInputError = getUserEmailError(userEmail);
    const nextUserAuthState = mailInputError ? UserAuthState.MAIL_INPUT : UserAuthState.SIGNUP_PASSWORD;
    return { mailInputError, nextUserAuthState };
}

export function MailInputForm(props: MailInputFormProps) {
    const { t } = useI18next();

    const [mailInputError, setMailInputError] = useState(null);

    return (
        <>
            <div className="login-modal-input-container">
                <MailInputBox
                    helpText={t('onlyEmail')}
                    userEmail={props.userEmail}
                    onChange={(event) => {
                        props.setUserEmail(event.target.value);
                    }}
                    error={mailInputError}
                />
            </div>
            <div className="login-modal-button-container">
                {mailInputError && mailInputError.message === MailInputError.ALREADY_EXISTS && (
                    <button
                        className="login-modal-button-green-on-black"
                        onClick={() => {
                            props.setUserAuthState(UserAuthState.LOGIN);
                        }}
                    >
                        {t('accountLogin')}
                    </button>
                )}
                <button
                    className="login-modal-button-black-on-green"
                    onClick={() => {
                        const { mailInputError, nextUserAuthState } = getUserEmailErrorAndNextState(props.userEmail);

                        setMailInputError(mailInputError);
                        props.setUserAuthState(nextUserAuthState);
                    }}
                >
                    {t('next')}
                </button>
            </div>
        </>
    );
}
