import { useI18next } from 'gatsby-plugin-react-i18next';
import React, { useState } from 'react';
import { UserAuthState } from './LoginModal';
import { MailInputBox } from './MailInputBox';
import { userAuthStateFromUserEmail } from './UserAuthStateUtils';

export function MailInputForm(props: {
    setUserAuthState: (userAuthState: UserAuthState) => void;
    userEmail: string;
    setUserEmail: (newUserEmail: string) => void;
}) {
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
                {mailInputError && mailInputError.message === 'mailAlreadyExists' && (
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
                        const mailInputError = userAuthStateFromUserEmail(props.userEmail);

                        if (mailInputError === null) {
                            props.setUserAuthState(UserAuthState.SIGNUP_PASSWORD);
                        }

                        setMailInputError(mailInputError);
                    }}
                >
                    {t('next')}
                </button>
            </div>
        </>
    );
}
