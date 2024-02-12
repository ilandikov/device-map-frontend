import React from 'react';

export function LoginModalHeader(props: { header: string; description: string; opaqueDescription: boolean }) {
    return (
        <>
            <p className="login-modal-header">{props.header}</p>
            <p className={`login-modal-header-description${props.opaqueDescription ? ' login-modal-opaque-text' : ''}`}>
                {props.description}
            </p>
        </>
    );
}
