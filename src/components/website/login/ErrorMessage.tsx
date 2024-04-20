import React from 'react';

export function ErrorMessage(props: { error: Error }) {
    return (
        <>{props.error && <p className="login-modal-input-help login-modal-wrong-input">{props.error.message}</p>}</>
    );
}
