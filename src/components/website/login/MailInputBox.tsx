import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

export function MailInputBox(props: { helpText: string; onChange: (newUserEmail) => void }) {
    return (
        <>
            <p className="login-modal-input-help">{props.helpText}</p>
            <div className="login-modal-input-inner-container">
                <StaticImage
                    className="login-modal-input-envelope-image"
                    src="../../../assets/images/Envelope.svg"
                    alt="input-email"
                />
                <input
                    className="login-modal-input-text"
                    type="email"
                    onChange={props.onChange}
                    data-testid="emailInput"
                />
            </div>
        </>
    );
}
