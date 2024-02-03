import { useI18next } from 'gatsby-plugin-react-i18next';
import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';
import { UserAuthState } from './LoginModal';

export function MailInput(props: { setUserEmail: (newUserEmail: string) => void; userAuthState: UserAuthState }) {
    const { t } = useI18next();
    return (
        <>
            <p className="login-modal-input-help">{t('onlyEmail')}</p>
            <div className="login-modal-input-inner-container">
                <StaticImage
                    className="login-modal-input-envelope-image"
                    src="../../../assets/images/Envelope.svg"
                    alt="input-email"
                />
                <input
                    className="login-modal-input-text"
                    type="email"
                    onChange={(event) => {
                        props.setUserEmail(event.target.value);
                    }}
                    data-testid="emailInput"
                />
            </div>
            {props.userAuthState === UserAuthState.MAIL_ALREADY_EXISTS && (
                <p className="login-modal-wrong-input">{t('mailAlreadyExists')}</p>
            )}
            {props.userAuthState === UserAuthState.MAIL_NOT_VALID && (
                <p className="login-modal-wrong-input">{t('mailNotValid')}</p>
            )}
        </>
    );
}
