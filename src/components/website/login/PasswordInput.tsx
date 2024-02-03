import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { UserAuthState } from './LoginModal';

export function PasswordInput(props: {
    userAuthState: UserAuthState.PASSWORD_INPUT | UserAuthState.PASSWORD_MATCH_ERROR;
    setUserPasswordA: (newUserPassword: string) => void;
    setUserPasswordB: (newUserPassword: string) => void;
}) {
    const { t } = useI18next();
    return (
        <>
            <p className="login-modal-input-help">{t('enterPassword')}</p>
            <div
                className={`login-modal-input-inner-container${props.userAuthState === UserAuthState.PASSWORD_MATCH_ERROR ? ' login-modal-input-inner-container-wrong-input' : ''}`}
            >
                <input
                    className="login-modal-input-text"
                    type="password"
                    onChange={(event) => props.setUserPasswordA(event.target.value)}
                />
            </div>
            <p className="login-modal-input-help">{t('repeatPassword')}</p>
            <div
                className={`login-modal-input-inner-container${props.userAuthState === UserAuthState.PASSWORD_MATCH_ERROR ? ' login-modal-input-inner-container-wrong-input' : ''}`}
            >
                <input
                    className="login-modal-input-text"
                    type="password"
                    onChange={(event) => props.setUserPasswordB(event.target.value)}
                />
            </div>
        </>
    );
}
