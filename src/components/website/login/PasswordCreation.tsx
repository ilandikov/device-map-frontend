import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { UserAuthState } from './LoginModal';
import { PasswordInputBox } from './PasswordInputBox';

export function PasswordCreation(props: {
    userAuthState: UserAuthState.PASSWORD_CREATION | UserAuthState.PASSWORD_CREATION_MATCH_ERROR;
    setUserPasswordA: (newUserPassword: string) => void;
    setUserPasswordB: (newUserPassword: string) => void;
}) {
    const { t } = useI18next();

    return (
        <>
            <PasswordInputBox
                helpText={t('enterPassword')}
                userAuthState={props.userAuthState}
                onChange={(event) => props.setUserPasswordA(event.target.value)}
            />
            <p className="login-modal-input-help">{t('repeatPassword')}</p>
            <div
                className={`login-modal-input-inner-container${props.userAuthState === UserAuthState.PASSWORD_CREATION_MATCH_ERROR ? ' login-modal-input-inner-container-wrong-input' : ''}`}
            >
                <input
                    className="login-modal-input-text"
                    type="password"
                    onChange={(event) => props.setUserPasswordB(event.target.value)}
                    data-testid="userPasswordB"
                />
            </div>
        </>
    );
}
