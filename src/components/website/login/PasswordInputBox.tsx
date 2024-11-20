import React, { ChangeEventHandler } from 'react';

export function PasswordInputBox(props: {
    helpText: string;
    testId: string;
    value: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
    error: Error | null;
}) {
    return (
        <>
            <p className="login-modal-input-help">{props.helpText}</p>
            <div className={`login-modal-input-box-container${props.error ? ' login-modal-wrong-input-border' : ''}`}>
                <input
                    value={props.value}
                    className="login-modal-input-text"
                    type="password"
                    onChange={props.onChange}
                    data-testid={props.testId}
                />
            </div>
        </>
    );
}
