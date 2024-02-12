import React from 'react';

export function LoginModalHeader(props: { header: string; description: string }) {
    return (
        <>
            <p className="login-modal-header">{props.header}</p>
            <p className="login-modal-header-description">{props.description}</p>
        </>
    );
}
