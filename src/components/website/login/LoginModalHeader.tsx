import React from 'react';
import LogoGreen from '/src/assets/images/LogoGreen.svg';

export function LoginModalHeader(props: { header: string; description: string; opaqueDescription: boolean }) {
    return (
        <div className="login-modal-header-container">
            <img className="login-modal-logo" src={LogoGreen} alt="login-modal-logo" />
            <p className="login-modal-header">{props.header}</p>
            <p className={`login-modal-header-description${props.opaqueDescription ? ' login-modal-opaque-text' : ''}`}>
                {props.description}
            </p>
        </div>
    );
}
