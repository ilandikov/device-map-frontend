import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { UserAuthState } from './LoginModal';
import { MailInputBox } from './MailInputBox';
import { userAuthStateFromUserEmail } from './UserAuthStateUtils';

export function MailInputForm(props: {
    userAuthState: UserAuthState;
    setUserAuthState: (userAuthState: UserAuthState) => void;
    userEmail: string;
    setUserEmail: (newUserEmail: string) => void;
}) {
    const { t } = useI18next();

    return (
        <>
            <div className="login-modal-input-container">
                <MailInputBox
                    helpText={t('onlyEmail')}
                    userEmail={props.userEmail}
                    onChange={(event) => {
                        props.setUserEmail(event.target.value);
                    }}
                />
                {props.userAuthState === UserAuthState.MAIL_INPUT_ERROR_EXISTENCE && (
                    <p className="login-modal-input-help login-modal-wrong-input">{t('mailAlreadyExists')}</p>
                )}
                {props.userAuthState === UserAuthState.MAIL_INPUT_ERROR_VALIDITY && (
                    <p className="login-modal-input-help login-modal-wrong-input">{t('mailNotValid')}</p>
                )}
            </div>
            <div className="login-modal-button-container">
                {props.userAuthState === UserAuthState.MAIL_INPUT_ERROR_EXISTENCE && (
                    <input
                        className="login-modal-button-green-on-black"
                        type="button"
                        value={t('accountLogin')}
                        onClick={() => {
                            props.setUserAuthState(UserAuthState.LOGIN);
                        }}
                    />
                )}
                <input
                    className="login-modal-button-black-on-green"
                    type="button"
                    value={t('next')}
                    onClick={() => {
                        const nextUserAuthState = userAuthStateFromUserEmail(props.userEmail);
                        props.setUserAuthState(nextUserAuthState);
                    }}
                />
            </div>
        </>
    );
}
