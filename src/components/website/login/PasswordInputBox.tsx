import React, { ChangeEventHandler } from 'react';
import { UserAuthState } from './LoginModal';

export function PasswordInputBox(props: {
    userAuthState: UserAuthState;
    helpText: string;
    testId: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
    error: Error | null;
}) {
    return (
        <>
            <p className="login-modal-input-help">{props.helpText}</p>
            <div
                className={`login-modal-input-box-container${props.userAuthState === UserAuthState.SIGNUP_PASSWORD_ERROR ? ' login-modal-wrong-input-border' : ''}`}
            >
                <input
                    className="login-modal-input-text"
                    type="password"
                    onChange={props.onChange}
                    data-testid={props.testId}
                />
            </div>
        </>
    );
}
