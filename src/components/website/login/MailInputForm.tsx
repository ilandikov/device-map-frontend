import { useI18next } from 'gatsby-plugin-react-i18next';
import React, { useState } from 'react';
import { UserAuthState } from './LoginModal';
import { MailInputBox } from './MailInputBox';
import { userAuthStateFromUserEmail } from './UserAuthStateUtils';

export function getError(userAuthState: UserAuthState): Error | null {
    if (userAuthState === UserAuthState.MAIL_INPUT_ERROR_EXISTENCE) {
        return new Error('mailAlreadyExists');
    }

    if (userAuthState === UserAuthState.MAIL_INPUT_ERROR_VALIDITY) {
        return new Error('mailNotValid');
    }

    return null;
}

export function MailInputForm(props: {
    userAuthState: UserAuthState;
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
                        const [nextUserAuthState, mailInputError] = userAuthStateFromUserEmail(props.userEmail);

                        if (mailInputError === null) {
                            props.setUserAuthState(nextUserAuthState);
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
