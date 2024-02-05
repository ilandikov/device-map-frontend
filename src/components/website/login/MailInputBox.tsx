import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

export function MailInputBox(props: { onChange: (newUserEmail) => void }) {
    return (
        <div className="login-modal-input-inner-container">
            <StaticImage
                className="login-modal-input-envelope-image"
                src="../../../assets/images/Envelope.svg"
                alt="input-email"
            />
            <input className="login-modal-input-text" type="email" onChange={props.onChange} data-testid="emailInput" />
        </div>
    );
}
