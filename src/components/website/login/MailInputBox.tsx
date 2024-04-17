import { StaticImage } from 'gatsby-plugin-image';
import React, { ChangeEventHandler } from 'react';

export function MailInputBox(props: {
    helpText: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
    email: string;
    error: Error | null;
}) {
    return (
        <>
            <p className="login-modal-input-help">{props.helpText}</p>
            <div className={`login-modal-input-box-container${props.error ? ' login-modal-wrong-input-border' : ''}`}>
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
        </>
    );
}
