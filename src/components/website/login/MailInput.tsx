import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import { UserAuthState } from './LoginModal';
import { MailInputBox } from './MailInputBox';

export function MailInput(props: { setUserEmail: (newUserEmail: string) => void; userAuthState: UserAuthState }) {
    const { t } = useI18next();
    return (
        <>
            <MailInputBox
                helpText={t('onlyEmail')}
                onChange={(event) => {
                    props.setUserEmail(event.target.value);
                }}
            />
            {props.userAuthState === UserAuthState.MAIL_ALREADY_EXISTS && (
                <p className="login-modal-wrong-input">{t('mailAlreadyExists')}</p>
            )}
            {props.userAuthState === UserAuthState.MAIL_NOT_VALID && (
                <p className="login-modal-wrong-input">{t('mailNotValid')}</p>
            )}
        </>
    );
}
