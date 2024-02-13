import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { UserAuthState } from './LoginModal';
import { MailInputBox } from './MailInputBox';
import { userAuthStateFromUserEmail } from './UserAuthStateUtils';

export function MailInput(props: {
    userAuthState: UserAuthState;
    setUserAuthState: (userAuthState: UserAuthState) => void;
    userEmail: string;
    setUserEmail: (newUserEmail: string) => void;
    onLoginButtonClick: React.MouseEventHandler<HTMLInputElement>;
    onNextButtonClick: React.MouseEventHandler<HTMLInputElement>;
}) {
    const { t } = useI18next();

    const onNextButtonClick = () => {
        const nextUserAuthState = userAuthStateFromUserEmail(props.userEmail);
        props.setUserAuthState(nextUserAuthState);
    };
    const onLoginButtonClick = () => {
        props.setUserAuthState(UserAuthState.PASSWORD_INPUT);
    };

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
                {props.userAuthState === UserAuthState.MAIL_ALREADY_EXISTS && (
                    <p className="login-modal-input-help login-modal-wrong-input">{t('mailAlreadyExists')}</p>
                )}
                {props.userAuthState === UserAuthState.MAIL_NOT_VALID && (
                    <p className="login-modal-input-help login-modal-wrong-input">{t('mailNotValid')}</p>
                )}
            </div>
            <div className="login-modal-button-container">
                {props.userAuthState === UserAuthState.MAIL_ALREADY_EXISTS && (
                    <input
                        className="login-modal-button-green-on-black"
                        type="button"
                        value={t('accountLogin')}
                        onClick={onLoginButtonClick}
                    />
                )}
                <input
                    className="login-modal-button-black-on-green"
                    type="button"
                    value={t('next')}
                    onClick={onNextButtonClick}
                />
            </div>
        </>
    );
}
