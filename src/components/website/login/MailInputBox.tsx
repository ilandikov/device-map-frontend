import { StaticImage } from 'gatsby-plugin-image';
import React, { ChangeEventHandler } from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';

export function MailInputBox(props: {
    helpText: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
    email: string;
    error: Error | null;
}) {
    const { t } = useI18next();

    return (
        <>
            <p className="login-modal-input-help">{props.helpText}</p>
            <div className="login-modal-input-box-container">
                <StaticImage
                    className="login-modal-input-envelope-image"
                    src="../../../assets/images/Envelope.svg"
                    alt="input-email"
                />
                <input
                    className="login-modal-input-text"
                    type="email"
                    value={props.email}
                    onChange={props.onChange}
                    data-testid="emailInput"
                />
            </div>
            {props.error && <p className="login-modal-input-help login-modal-wrong-input">{t(props.error.message)}</p>}
        </>
    );
}
