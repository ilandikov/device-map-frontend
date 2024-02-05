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
                testId="userPasswordA"
            />
            <PasswordInputBox
                helpText={t('repeatPassword')}
                userAuthState={props.userAuthState}
                onChange={(event) => props.setUserPasswordB(event.target.value)}
                testId="userPasswordB"
            />
        </>
    );
}
