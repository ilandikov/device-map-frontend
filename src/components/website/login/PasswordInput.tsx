import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { UserAuthState } from './LoginModal';

export function PasswordInput(props: {
    userAuthState: UserAuthState.PASSWORD_INPUT | UserAuthState.PASSWORD_MATCH_ERROR;
    setUserPasswordA: (newUserPassword: string) => void;
    setUserPasswordB: (newUserPassword: string) => void;
}) {
    const { t } = useI18next();

    let inputInnerContainerCSSClass = 'login-modal-input-inner-container';
    if (props.userAuthState === UserAuthState.PASSWORD_MATCH_ERROR) {
        inputInnerContainerCSSClass += ' login-modal-input-inner-container-wrong-input';
    }

    return (
        <>
            <p className="login-modal-input-help">{t('enterPassword')}</p>
            <div className={inputInnerContainerCSSClass}>
                <input
                    className="login-modal-input-text"
                    type="password"
                    onChange={(event) => props.setUserPasswordA(event.target.value)}
                    data-testid="userPasswordA"
                />
            </div>
            <p className="login-modal-input-help">{t('repeatPassword')}</p>
            <div className={inputInnerContainerCSSClass}>
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
