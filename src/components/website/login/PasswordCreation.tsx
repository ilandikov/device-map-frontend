import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { UserAuthState } from './LoginModal';
import { PasswordInputBox } from './PasswordInputBox';

export function PasswordCreation(props: {
    userAuthState: UserAuthState.PASSWORD_CREATION | UserAuthState.PASSWORD_CREATION_MATCH_ERROR;
    setUserPassword: (newUserPassword: string) => void;
    setUserPasswordRepeat: (newUserPassword: string) => void;
}) {
    const { t } = useI18next();

    return (
        <div className="login-modal-input-container">
            <PasswordInputBox
                userAuthState={props.userAuthState}
                helpText={t('enterPassword')}
                testId="userPassword"
                onChange={(event) => props.setUserPassword(event.target.value)}
            />
            <PasswordInputBox
                userAuthState={props.userAuthState}
                helpText={t('repeatPassword')}
                testId="userPasswordRepeat"
                onChange={(event) => props.setUserPasswordRepeat(event.target.value)}
            />
        </div>
    );
}
